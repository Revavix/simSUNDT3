<script lang="ts">
    import Plotly, { type Data } from 'plotly.js-dist-min'
    import { UltraVision } from '../../lib/plotting/Colorscales';
    import { CalculationLength, CalculationMode, DistanceMode, DistancePath } from '../../lib/models/SoundYAxisMode';
    import { onDestroy } from 'svelte';
    import { blayout } from '../../lib/plotting/Layouts';
    import { cursorData, loadedMetadata, theme } from '../../lib/data/Stores';
    import { LoadingState, Rectification, type Metadata, Interpolation, type Point } from '../../lib/models/Result';
    import { get } from 'svelte/store';
    import type { Position3D } from '../../lib/models/Positions';
    import Spinner from '../Spinner.svelte';
    import { calculateDistance, calculateTime, interpolationToZsmooth, rectify } from '../../lib/plotting/Utils';
    import Zoombar from './Zoombar.svelte';
    import Waveproperties from './Waveproperties.svelte';
    import Modebar from './Modebar.svelte';
    import { invoke } from '@tauri-apps/api/core';
    import { crosshairVerticalLabel } from '../../lib/plotting/Annotations';

    export let rectification: Rectification
    export let interpolation: Interpolation
    export let colorscale = UltraVision

    let loading: LoadingState = LoadingState.LOADING
    let calculationMode = CalculationMode.Time
    let calculationLength = CalculationLength.Half
    let distanceMode = DistanceMode.Compressional
    let pathMode = DistancePath.Soundpath

    // Cached X and Y values to check if a replot is necessary
    let cachedY: number

    // Stored data
    let loadedPoint: Point
    let loadedSignals: Array<Position3D> = []
    
    // Bound variables
    let plot: any
    let div: any

    let unsubscribeData = cursorData.subscribe(point => {
        if (point === undefined) return

        // Always refresh the loadedPoint
        loadedPoint = point

        if (cachedY === point.pos.y && point.forceRefresh === false) {
            blayout.annotations = [
                crosshairVerticalLabel(point.pos.x)
            ]
            Plotly.relayout(div, blayout)
        } else {
            loading = LoadingState.LOADING
            const metadata: Metadata = get(loadedMetadata)
            cachedY = point.pos.y

            invoke('cmd_parse_bscan', { row: (point.pos.y - metadata.coordinates.y.start) / metadata.coordinates.y.increment }).then((v: any) => {
                loadedSignals = v as Array<Position3D>
                blayout.annotations = [crosshairVerticalLabel(point.pos.x)]
                updatePlot()
                loading = LoadingState.OK
            }).catch((e) => {
                loading = LoadingState.INVALID
            })
        }
    })

    let unsubscribeTheme = theme.subscribe(theme => {
        if (div === undefined) return

        Plotly.relayout(div, {
            font: {
                color: theme === 'business' ? '#fff' : '#000'
            },
        })
    })

    onDestroy(() => {
        unsubscribeTheme()
        unsubscribeData()
    })

    // Internal method for updating the plot
    function updatePlot() {
        if (loadedPoint === undefined || div === undefined) return

        const metadata: Metadata = get(loadedMetadata)

        let data: Data[] = [
            {
                x: loadedSignals.map(s => metadata.coordinates.x.start + (s.x * metadata.coordinates.x.increment)),
                y: loadedSignals.map(s => calculationMode === CalculationMode.Time ? 
                    calculateTime(metadata, s.y) / (calculationLength === CalculationLength.Half ? 2 : 1) :
                    calculateDistance(metadata, distanceMode, pathMode, s.y) / (calculationLength === CalculationLength.Half ? 2 : 1)
                ),
                z: loadedSignals.map(s => rectify(rectification, s.z / loadedPoint.topData.amplitude)),
                zsmooth: interpolationToZsmooth(interpolation),
                type: 'heatmap',
                showscale: false,
                colorscale: colorscale,
                zmin: -1,
                zmax: 1
            }
        ]

        blayout.yaxis.ticksuffix = calculationMode === CalculationMode.Time ? 's' : 'mm'
        blayout.margin.l = calculationMode === CalculationMode.Time ? 40 : 60
        blayout.font.color = get(theme) === 'business' ? '#fff' : '#000'

        plot = Plotly.react(div, data, blayout, {
            responsive: true,
            displayModeBar: false
        })
    }

    $: calculationMode || calculationLength || distanceMode || pathMode || rectification || colorscale, updatePlot()
</script>


<div class="flex flex-row items-center">
    <div class="flex flex-col">
        <p class="px-2 text-base-content">Side View (B)</p>
    </div>
    <div class="flex flex-col ml-1 my-1">
        {#if loading === LoadingState.LOADING}
            <span class="loading loading-bars loading-xs"/>
        {:else if loading === LoadingState.INVALID}
            <div class="tooltip" data-tip="hello">
                <div style="font-family: 'Material Icons'; font-size: 24px; color: #f44336;">error</div>
            </div>
        {/if}
    </div>
    <div class="flex flex-col ml-auto mr-2 pt-1">
        <Waveproperties bind:calculationMode={calculationMode} 
                        bind:calculationLength={calculationLength} 
                        bind:distanceMode={distanceMode} 
                        bind:pathMode={pathMode}
        />
    </div>
    <div class="flex flex-col ml-0.5 mr-0.5 pt-1">
        <Modebar bind:plot={plot}/>
    </div>
    <div class="divider divider-horizontal -mx-1 my-1 pt-1"/>
    <div class="flex flex-col ml-0.5 mr-2 pt-1">
        <Zoombar bind:plot={plot}/>
    </div>
</div>
<div class="flex flex-row w-full h-full" style="max-height: calc(100% - 28px);">
    <div class="flex flex-col w-full h-full">
        <div class="w-full h-full" bind:this={div}/>
    </div>
</div>
