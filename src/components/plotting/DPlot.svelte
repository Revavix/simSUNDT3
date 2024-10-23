<script lang="ts">
    import Plotly, { type Data } from 'plotly.js-dist-min'
    import { UltraVision } from '../../lib/plotting/Colorscales';
    import { onDestroy, onMount } from 'svelte';
    import { layoutDPlot } from '../../lib/plotting/Layouts';
    import { activePlot, loadedMetadata, theme } from '../../lib/data/Stores';
    import { Interpolation, LoadingState, Rectification, type Metadata } from '../../lib/models/Result';
    import { get } from 'svelte/store';
    import { invoke } from '@tauri-apps/api/core';
    import type { Position3D } from '../../lib/models/Positions';
    import { interpolationToZsmooth, rectify, calculateDistance, calculateTime } from '../../lib/plotting/Utils';
    import Zoombar from './Zoombar.svelte';
    import Modebar from './Modebar.svelte';
    import { cScanLoadedData } from '../../lib/data/stores/Data';
    import { aScanCursor, bScanCursor, cScanCursor, dScanCursor } from '../../lib/data/stores/Cursors';
    import { crosshairHorizontalLabel, crosshairVerticalLabel } from '../../lib/plotting/Annotations';
    import Unitbar from './Unitbar.svelte';

    export let rectification: Rectification
    export let interpolation: Interpolation
    export let colorscale = UltraVision

    let active: boolean = true
    let loading: LoadingState = LoadingState.LOADING
    let zAxisUnitType: "dB" | "Percentage" = "Percentage"
    let yAxisUnitType: "Time" | "Distance" = "Time"
    let waveType: "Shear" | "Longitudinal" = "Shear"
    let waveLength: "Half" | "Full" = "Half"
    let wavePath: "Soundpath" | "True" = "Soundpath"

    // Stored data
    let loadedSignals: Array<Position3D> = []
    
    // Bound variables
    let plot: any
    let root: any

    let unsubscribeCScanLoadedData = cScanLoadedData.subscribe(data => {
        if (data === undefined) return

        loading = LoadingState.LOADING

        invoke('cmd_parse_dscan', { col: data.currentCol }).then((v: any) => {
            const metadata: Metadata = get(loadedMetadata)
            loadedSignals = v as Array<Position3D>
            updatePlot().then((p) => {
                plot = p
                loading = LoadingState.OK
                root?.removeAllListeners('plotly_click')
                plot.on('plotly_click', (clickData: any) => {
                    if (!active) return

                    cScanLoadedData.update(data => {
                        data.currentRow = Math.floor((clickData.points[0].x - metadata.coordinates.y.start) / metadata.coordinates.y.increment)
                        return data
                    })
                    cScanCursor.update(cursor => { return { x: cursor?.x, y: clickData.points[0].x} })
                    bScanCursor.update(cursor => { return { x: cursor?.x, yIndex: clickData.points[0].pointIndex % data.samples} })
                    dScanCursor.set({ x: clickData.points[0].x, yIndex: clickData.points[0].pointIndex % data.samples})
                    aScanCursor.set({ xIndex: clickData.points[0].pointIndex % data.samples })
                    activePlot.set("D")
                })
            })
        }).catch((e) => {
            loading = LoadingState.INVALID
        })
    })

    let unsubscribeDScanCursor = dScanCursor.subscribe(cursor => {
        if (cursor === undefined || plot?.data === undefined) return
        layoutDPlot.annotations = [
            crosshairVerticalLabel(cursor.x, 'bottom', 0, 2),
            crosshairHorizontalLabel(plot?.data[0].y[cursor.yIndex], 'left', yAxisUnitType === "Time" ? 6 : 0, 2)
        ]
        Plotly.relayout(root, layoutDPlot)
    })

    let unsubscribeTheme = theme.subscribe(theme => {
        if (root === undefined) return

        Plotly.relayout(root, {
            font: {
                color: theme === 'business' ? '#fff' : '#000'
            },
        })
    })

    onDestroy(() => {
        unsubscribeTheme()
        unsubscribeCScanLoadedData()
        unsubscribeDScanCursor()
    })

    // Internal method for updating the plot
    let updatePlot = async () => {
        if (root === undefined) return

        let data: Data[] = [
            {
                x: loadedSignals.map(s => $loadedMetadata.coordinates.y.start + (s.x * $loadedMetadata.coordinates.y.increment)),
                y: loadedSignals.map(s => yAxisUnitType === "Time" ? 
                    calculateTime($loadedMetadata, s.y) / (waveLength === "Half" ? 2 : 1) :
                    calculateDistance($loadedMetadata, waveType, wavePath, s.y) / (waveLength === "Half" ? 2 : 1)
                ),
                z: loadedSignals.map(s => zAxisUnitType === 'dB' ? (20 * Math.log10(rectify(Rectification.FULLWAVE, s.z / $cScanLoadedData.amplitude))) : rectify(rectification, s.z / $cScanLoadedData.amplitude)),
                zsmooth: interpolationToZsmooth(interpolation),
                type: 'heatmap',
                showscale: false,
                colorscale: colorscale,
                hovertemplate: `${yAxisUnitType === 'Distance' ? 'Depth: %{y:.2f} mm' : 'Time: %{y:s}s'}<br>${zAxisUnitType === 'Percentage' ? 'Amplitude: %{z:.2f}' : 'Amplitude: %{z:.2f} dB'}<extra></extra>`,
                zmin: -1,
                zmax: 1
            }
        ]

        if (zAxisUnitType === 'dB') {
            (data[0] as any).zmin = undefined;
            (data[0] as any).zmax = undefined;
        } else {
            (data[0] as any).zmin = rectification === Rectification.FULLWAVE || rectification === Rectification.HALFWAVE_POS || rectification === Rectification.HALFWAVE_NEG ? 0 : -1;
            (data[0] as any).zmax = 1;
        }

        layoutDPlot.yaxis.ticksuffix = yAxisUnitType === "Time" ? 's' : 'mm'
        layoutDPlot.margin.l = yAxisUnitType === "Time" ? 40 : 60
        layoutDPlot.font.color = get(theme) === 'business' ? '#fff' : '#000'

        return Plotly.react(root, data, layoutDPlot, {
            responsive: true,
            displayModeBar: false
        })
    }

    // Internal wrapper method for refreshing the annotations, necessary to not trigger a re-render loop
    let refreshAnnotations = () => {
        dScanCursor.update(cursor => { return { x: cursor?.x, yIndex: cursor?.yIndex } })
    }

    $: yAxisUnitType, zAxisUnitType, waveLength, waveType, wavePath, rectification, colorscale, updatePlot().then((p) => {
        loading = LoadingState.OK
        plot = p
    })
    $: yAxisUnitType, zAxisUnitType, waveLength, waveType, wavePath, refreshAnnotations()
</script>

<div class="flex flex-row items-center">
    <button class="flex flex-col" on:click={() => activePlot.set("D")}>
        <p class="px-2 text-base-content {$activePlot === 'D' ? '' : 'opacity-70'}">End (D)</p>
    </button>       
    {#if zAxisUnitType === 'dB'}
    <div class="flex flex-col w-7 cursor-default">
        <div class="tooltip tooltip-warning tooltip-right text-warning" data-tip="Forced fullwave in dB mode">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M2 2v10h2V4h7v18h11V12h-2v8h-7V2z"/></svg>
            <p class="absolute right-0 bottom-0 left-4 top-2 text-xs cursor-default">F</p>
        </div>
    </div>
    {/if}
    {#if ($loadedMetadata?.probe.wave_properties?.type_of_probe === 3 && waveType === 'Shear' || $loadedMetadata?.probe.wave_properties?.type_of_probe !== 3 && waveType === 'Longitudinal') &&
        yAxisUnitType === 'Distance'}
    <div class="flex flex-col w-7 cursor-default">
        <div class="tooltip tooltip-warning tooltip-right text-warning" data-tip="Y axis data may be inaccurate since {waveType} waves are used in a 
            {$loadedMetadata?.probe.wave_properties?.type_of_probe === 3 ? 'Longitudinal' : 'Shear'} wave test">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="m2.61 21l-1-1.73L11 13.85V3h2v10.85l9.39 5.42l-1 1.73L12 15.58z"/></svg>
            <p class="absolute right-0 bottom-0 left-4 top-2 text-xs cursor-default">{waveType === 'Longitudinal' ? 'L' : 'S'}</p>
        </div>
    </div>
    {/if}
    <div class="flex flex-col ml-4">
        {#if loading === LoadingState.LOADING}
            <span class="loading loading-bars loading-xs"/>
        {:else if loading === LoadingState.INVALID}
            <div class="tooltip" data-tip="Something went wrong when loading data">
                <div style="font-family: 'Material Icons'; font-size: 24px; color: #f44336;">error</div>
            </div>
        {/if}
    </div>
    <div class="flex flex-col ml-auto mr-1 pt-1">
        <Unitbar
            bind:u1={zAxisUnitType}
            bind:u2={yAxisUnitType}
            bind:wave={waveType}
            bind:length={waveLength}
            bind:path={wavePath}
        />
    </div>
    <div class="divider divider-horizontal -mx-1 my-1 pt-1"/>
    <div class="flex flex-col ml-0.5 mr-0.5 pt-1">
        <Modebar bind:plot={plot}/>
    </div>
    <div class="divider divider-horizontal -mx-1 my-1 pt-1"/>
    <div class="flex flex-col ml-0.5 mr-2 pt-1">
        <Zoombar bind:plot={plot}/>
    </div>
</div>
<div class="flex flex-row w-full h-full plotly_container" style="max-height: calc(100% - 28px);">
    <div class="flex flex-col w-full h-full">
        <div class="w-full h-full" bind:this={root}/>
    </div>
</div>