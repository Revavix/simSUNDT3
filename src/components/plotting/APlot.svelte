<script lang="ts">
    import Plotly, { type Data } from 'plotly.js-dist-min'
    import { loadedMetadata, cursorData, theme } from '../../lib/data/Stores';
    import { onDestroy } from 'svelte';
    import { get } from 'svelte/store';
    import { LoadingState, type Metadata, type Point } from '../../lib/models/Result';
    import { invoke } from '@tauri-apps/api/core';
    import Spinner from '../Spinner.svelte';
    import type { Position2D } from '../../lib/models/Positions';
    import { calculateDistance, calculateTime, rectify } from '../../lib/plotting/Utils';
    import Zoombar from './Zoombar.svelte';
    import Modebar from './Modebar.svelte';
    import Waveproperties from './Waveproperties.svelte';
    import { CalculationLength, CalculationMode, DistanceMode, DistancePath } from '../../lib/models/SoundYAxisMode';
    

    export let rectification: any

    let loading: LoadingState = LoadingState.LOADING
    let calculationMode = CalculationMode.Time
    let calculationLength = CalculationLength.Half
    let distanceMode = DistanceMode.Compressional
    let pathMode = DistancePath.Soundpath

    let loadedSignal: Array<Position2D> = []

    let plot: any
    let div: any
    let layout = {
        paper_bgcolor: 'rgba(0, 0, 0, 0)',
        plot_bgcolor: 'rgba(0, 0, 0, 0)',
        margin: {
            t: 20,
            l: 40,
            r: 20,
            b: 40
        },
        font: {
            color: get(theme) === 'business' ? '#fff' : '#000'
        },
        xaxis: {
            showticksuffix: 'all' as const,
            ticksuffix: 's',
        },
        yaxis: {
            range: [-1, 1],
        }
    }
    let cfg = {
        responsive: true,
        displayModeBar: false,
        dragmode: 'zoom'
    }

    let unsubscribeData = cursorData.subscribe(point => {
        if (div == undefined || point === undefined) return

        // Active load status again
        loading = LoadingState.LOADING

        const metadata: Metadata = get(loadedMetadata)
        let col = (point.pos.x - metadata.coordinates.x.start) / metadata.coordinates.x.increment
        let row = (point.pos.y - metadata.coordinates.y.start) / metadata.coordinates.y.increment

        invoke('cmd_parse_ultrasound', { column: col, row: row }).then((v: any) => {
            loadedSignal = v as Array<Position2D>
            updatePlot()
            loading = LoadingState.OK
        }).catch((e) => {
            console.error(e)
            loading = LoadingState.INVALID
        })
    })

    let unsubscribeTheme = theme.subscribe(theme => {
        if (div === undefined) return

        Plotly.relayout(div, {
            font: {
                color: theme === 'business' ? '#fff' : '#000'
            },
        })
    })

    let updatePlot = () => {
        if (loadedSignal === undefined || div === undefined) return

        const metadata: Metadata = get(loadedMetadata)
        const point: Point = get(cursorData)

        let data: Data[] = [
            {
                x: loadedSignal.map(s => calculationMode === CalculationMode.Time ? 
                    calculateTime(metadata, s.x) / (calculationLength === CalculationLength.Half ? 2 : 1) :
                    calculateDistance(metadata, distanceMode, pathMode, s.x) / (calculationLength === CalculationLength.Half ? 2 : 1)
                ),
                y: loadedSignal.map(s => rectify(rectification, s.y / point.topData.amplitude)),
                type: 'scatter',
            }
        ]
        layout.xaxis.ticksuffix = calculationMode === CalculationMode.Time ? 's' : 'mm'

        plot = Plotly.react(div, data, layout, cfg)
    }

    onDestroy(() => {
        unsubscribeTheme()
        unsubscribeData()
    })

    $: calculationMode || calculationLength || distanceMode || pathMode || rectification, updatePlot()
</script>

<div class="flex flex-row items-center">
    <div class="flex flex-col">
        <p class="px-2 text-base-content">Signal (A)</p>
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
    <div class="w-full h-full" style="{loading === LoadingState.LOADING ? 'margin-bottom:-' + (layout.margin.b + 4) + 'px;' : null}">
        <div class="w-full h-full" bind:this={div}/>
    </div>
</div>

<style>

</style>