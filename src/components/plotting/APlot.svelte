<script lang="ts">
    import Plotly, { type Data } from 'plotly.js-dist-min'
    import { loadedMetadata, theme, activePlot } from '../../lib/data/Stores';
    import { onDestroy, onMount } from 'svelte';
    import { LoadingState, Rectification, type Metadata } from '../../lib/models/Result';
    import { invoke } from '@tauri-apps/api/core';
    import type { Position2D } from '../../lib/models/Positions';
    import { calculateDistance, calculateTime, rectify } from '../../lib/plotting/Utils';
    import Zoombar from './Zoombar.svelte';
    import Modebar from './Modebar.svelte';
    import { crosshairVerticalLabel } from '../../lib/plotting/Annotations';
    import { layoutAPlot } from '../../lib/plotting/Layouts';
    import { aScanCursor, bScanCursor, dScanCursor } from '../../lib/data/stores/Cursors';
    import { cScanLoadedData } from '../../lib/data/stores/Data';
    import Unitbar from './Unitbar.svelte';
    

    export let rectification: any

    let active: boolean = true
    let loading: LoadingState = LoadingState.LOADING
    let yAxisUnitType: "dB" | "Percentage" = "Percentage"
    let xAxisUnitType: "Time" | "Distance" = "Time"
    let waveType: "Shear" | "Longitudinal" = "Shear"
    let waveLength: "Half" | "Full" = "Half"
    let wavePath: "Soundpath" | "True" = "Soundpath"
    let loadedSignal: Array<Position2D> = []
    let plot: any
    let root: any

    onMount(() => {
        plot = Plotly.react(root, [], layoutAPlot, {
            responsive: true,
            displayModeBar: false
        })
    })

    let unsubscribeCScanLoadedData = cScanLoadedData.subscribe(data => {
        if (data === undefined) return

        loading = LoadingState.LOADING

        invoke('cmd_parse_ultrasound', { column: data.currentCol, row: data.currentRow }).then(async (signals: any) => {
            loadedSignal = signals as Array<Position2D>

            updatePlot().then((p) => {
                plot = p
                root?.removeAllListeners('plotly_click')
                loading = LoadingState.OK
                plot.on('plotly_click', (data: any) => {
                    if (!active) return
                    aScanCursor.set({ xIndex: data.points[0].pointIndex })
                    bScanCursor.update(cursor => { return { x: cursor?.x, yIndex: data.points[0].pointIndex } })
                    dScanCursor.update(cursor => { return { x: cursor?.x, yIndex: data.points[0].pointIndex } })
                    activePlot.set("A")
                })
            })
        }).catch((e) => {
            console.error(e)
            loading = LoadingState.INVALID
        })
    })

    let unsubscribeAScanCursor = aScanCursor.subscribe(cursor => {
        if (cursor === undefined || plot?.data === undefined) return
        layoutAPlot.annotations = [
            crosshairVerticalLabel(plot?.data[0].x[cursor.xIndex], 'bottom', xAxisUnitType === "Time" ? 6 : 0, 2)
        ]

        Plotly.relayout(root, layoutAPlot)
    })

    let unsubscribeTheme = theme.subscribe(theme => {
        if (root === undefined) return

        Plotly.relayout(root, {
            font: {
                color: theme === 'business' ? '#fff' : '#000'
            },
        })
    })

    const updatePlot = async () => {
        if (root === undefined) return

        let transformedData: Data[] = [
            {
                x: loadedSignal.map(s => xAxisUnitType === "Time" ? 
                    calculateTime($loadedMetadata, s.x) / (waveLength === "Half" ? 2 : 1) :
                    calculateDistance($loadedMetadata, waveType, wavePath, s.x) / (waveLength === "Half" ? 2 : 1)
                ),
                y: loadedSignal.map(s => yAxisUnitType === 'dB' ? (20 * Math.log10(rectify(rectification, s.y / $cScanLoadedData.amplitude))) : rectify(rectification, s.y / $cScanLoadedData.amplitude)),
                type: 'scatter',
            }
        ]
        layoutAPlot.xaxis.ticksuffix = xAxisUnitType === "Time" ? 's' : 'mm'

        if (yAxisUnitType === 'Percentage') {
            layoutAPlot.margin.l = 40
            layoutAPlot.margin.r = 20
            layoutAPlot.yaxis.ticksuffix = ''
            layoutAPlot.yaxis.autorange = false
            layoutAPlot.yaxis.range = rectification === Rectification.FULLWAVE || rectification === Rectification.HALFWAVE_POS || rectification === Rectification.HALFWAVE_NEG  ? [0, 1.1] : [-1.1, 1.1]
        } else {
            layoutAPlot.margin.l = 50
            layoutAPlot.margin.r = 30
            layoutAPlot.yaxis.ticksuffix = 'dB'
            layoutAPlot.yaxis.autorange = true
        }

        return Plotly.react(root, transformedData, layoutAPlot, {
            responsive: true,
            displayModeBar: false
        })
    }

    onDestroy(() => {
        unsubscribeTheme()
        unsubscribeCScanLoadedData()
        unsubscribeAScanCursor()
    })

    // Internal wrapper method for refreshing the annotations, necessary to not trigger a re-render loop
    let refreshAnnotations = () => {
        aScanCursor.update(cursor => { return { xIndex: cursor?.xIndex } })
    }

    $: yAxisUnitType, xAxisUnitType, waveLength, waveType, wavePath, rectification, updatePlot().then((p) => {
        loading = LoadingState.OK
        plot = p
    })
    $: yAxisUnitType, xAxisUnitType, waveLength, waveType, wavePath, refreshAnnotations()
</script>

<div class="flex flex-row items-center">
    <button class="flex flex-col focus:outline-none focus:ring-none" on:click={() => activePlot.set("A")}>
        <p class="px-2 text-base-content {$activePlot === 'A' ? '' : 'opacity-70'}">Signal (A)</p>
    </button>
    {#if ($loadedMetadata?.probe.wave_properties?.type_of_probe === 3 && waveType === 'Shear' || $loadedMetadata?.probe.wave_properties?.type_of_probe !== 3 && waveType === 'Longitudinal') &&
    xAxisUnitType === 'Distance'}
    <div class="flex flex-col w-7 cursor-default">
        <div class="tooltip tooltip-warning tooltip-right text-warning" data-tip="X axis data may be inaccurate since {waveType} waves are used in a 
            {$loadedMetadata?.probe.wave_properties?.type_of_probe === 3 ? 'Longitudinal' : 'Shear'} wave test">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="m2.61 21l-1-1.73L11 13.85V3h2v10.85l9.39 5.42l-1 1.73L12 15.58z"/></svg>
            <p class="absolute right-0 bottom-0 left-4 top-2 text-xs cursor-default">{waveType === 'Longitudinal' ? 'L' : 'S'}</p>
        </div>
    </div>
    {/if}
    <div class="flex flex-col ml-1 my-1">
        {#if loading === LoadingState.LOADING}
            <span class="loading loading-bars loading-xs"/>
        {:else if loading === LoadingState.INVALID}
            <div class="tooltip" data-tip="Invalid data">
                <div style="font-family: 'Material Icons'; font-size: 24px; color: #f44336;">error</div>
            </div>
        {/if}
    </div>
    <div class="flex flex-col ml-auto mr-0.5">
        <Unitbar
            bind:u1={yAxisUnitType}
            bind:u2={xAxisUnitType}
            bind:wave={waveType}
            bind:length={waveLength}
            bind:path={wavePath}
        />
    </div>
    <div class="divider divider-horizontal -mx-1 my-1"/>
    <div class="flex flex-col ml-0.5 mr-0.5">
        <Modebar bind:plot={plot}/>
    </div>
    <div class="divider divider-horizontal -mx-1 my-1"/>
    <div class="flex flex-col ml-0.5 mr-2">
        <Zoombar bind:plot={plot}/>
    </div>
</div>
<div class="flex flex-row h-full" style="max-height: calc(100% - 28px);">
    <div class="w-full h-full">
        <div class="w-full h-full" bind:this={root}/>
    </div>
</div>

<style>

</style>