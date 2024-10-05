<script lang="ts">
    import Plotly from 'plotly.js-dist-min'
    import type { Data } from "plotly.js-dist-min"
    import { crosshairHorizontalLabel, crosshairVerticalLabel } from '../../lib/plotting/Annotations'
    import { UltraVision } from '../../lib/plotting/Colorscales';
    import { loadedMetadata, cursorData, theme } from '../../lib/data/Stores';
    import { invoke } from '@tauri-apps/api/core';
    import { Interpolation, LoadingState, type Metadata, type Point, type Top } from '../../lib/models/Result';
    import Spinner from '../Spinner.svelte';
    import { onDestroy, onMount } from 'svelte';
    import { interpolationToZsmooth } from '../../lib/plotting/Utils';
    import { clayout } from '../../lib/plotting/Layouts';
    import { get } from 'svelte/store';
    import Modebar from './Modebar.svelte';
    import Zoombar from './Zoombar.svelte';
    import type { Position3D } from '../../lib/models/Positions';

    export let interpolation: Interpolation
    export let colorscale = UltraVision

    let mode = "All"
    let currentDecibel: number = 0
    let loading: LoadingState = LoadingState.LOADING
    let currentMetadata: Metadata
    let loadedTopData: Top
    let plot: any
    let div: any
    let cfg = {
        responsive: true,
        displayModeBar: false,
        dragmode: 'zoom'
    }

    let unsubscribeData = loadedMetadata.subscribe((metadata) => {
        if (metadata === undefined || div === undefined) return

        // Active load status again
        loading = LoadingState.LOADING

        // Load the C.dat file
        invoke('commands_results_parse_top_view', { path: metadata.path }).then((cdat: any) => {
            let top = cdat as Top
            let midPointX = Math.floor(((top.columns-1) * metadata.coordinates.x.increment) / 2) + metadata.coordinates.x.start
            midPointX += midPointX % metadata.coordinates.x.increment
            let midPointY = Math.floor(((top.rows-1) * metadata.coordinates.y.increment) / 2) + metadata.coordinates.y.start
            midPointY += midPointY % metadata.coordinates.y.increment

            clayout.annotations = [
                crosshairHorizontalLabel(midPointY),
                crosshairVerticalLabel(midPointX)
            ]

            loading = LoadingState.OK
            setTimeout(() => {
                loadedTopData = top
                currentMetadata = metadata

                // Trigger a plot update since data has changed
                updatePlot()

                // Manually update on first plot draw
                cursorData.set({
                    topData: top,
                    pos: {
                        x: midPointX, 
                        y: midPointY
                    },
                    forceRefresh: true
                })

                // Listen to click events in the plot
                div.on('plotly_click', function(d: any) {
                    for(var i=0; i < d.points.length; i++){
                        top.content.find((cd) => {
                            let x = metadata.coordinates.x.start + (cd.x * metadata.coordinates.x.increment)
                            let y = metadata.coordinates.y.start + (cd.y * metadata.coordinates.y.increment)
                            // Only update if the coordinate has data in it
                            if (x === d.points[i].x && y === d.points[i].y) {
                                cursorData.set({
                                    topData: top,
                                    pos: {
                                        x: x, 
                                        y: y
                                    },
                                    forceRefresh: false
                                })
                            }
                        })
                    }
                })
            }, 10)
        }).catch((e) => {
            console.log(e)
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

    let unsubscribeCursorData = cursorData.subscribe(point => {
        if (point === undefined || currentMetadata === undefined || plot === undefined) return

        clayout.annotations = [
            crosshairHorizontalLabel(point.pos.y),
            crosshairVerticalLabel(point.pos.x)
        ]

        // Update the current decibel value
        currentDecibel = getCurrentDecibel(point.topData.content, point.pos.x, point.pos.y)

        Plotly.relayout(div, clayout)
    })

    function onKeyDown(e: any) {
        const metadata = get(loadedMetadata)
        const currentPoint = get(cursorData)
        const movements: Record<number, Point> = {
            40: { topData: currentPoint.topData, pos: { x: currentPoint.pos.x, y: currentPoint.pos.y - Math.abs(metadata.coordinates.y.increment) }, forceRefresh: false } as Point,
            39: { topData: currentPoint.topData, pos: { x: currentPoint.pos.x + Math.abs(metadata.coordinates.x.increment), y: currentPoint.pos.y }, forceRefresh: false } as Point,
            38: { topData: currentPoint.topData, pos: { x: currentPoint.pos.x, y: currentPoint.pos.y + Math.abs(metadata.coordinates.y.increment) }, forceRefresh: false } as Point,
            37: { topData: currentPoint.topData, pos: { x: currentPoint.pos.x - Math.abs(metadata.coordinates.x.increment), y: currentPoint.pos.y }, forceRefresh: false } as Point
        }

        if (movements[e.keyCode] === undefined) return

        // Sample the data at the new position to check if it is valid, and if so update the cursor
        let found = currentPoint.topData.content.find((cd) => {
            let xd = currentMetadata.coordinates.x.start + (cd.x * currentMetadata.coordinates.x.increment)
            let yd = currentMetadata.coordinates.y.start + (cd.y * currentMetadata.coordinates.y.increment)
            return xd === movements[e.keyCode].pos.x && yd === movements[e.keyCode].pos.y
        })

        if (found !== undefined) {
            cursorData.set(movements[e.keyCode])
        }
    }

    let getCurrentDecibel = (data: Array<Position3D>, x: number, y: number) => {
        if (plot !== undefined) {
            let point = data.find((cd) => {
                let xd = currentMetadata.coordinates.x.start + (cd.x * currentMetadata.coordinates.x.increment)
                let yd = currentMetadata.coordinates.y.start + (cd.y * currentMetadata.coordinates.y.increment)
                return xd === x && yd === y
            })

            if (point !== undefined) {
                return Number(point.z.toFixed(2))
            }
        }

        return 0
    }

    let findZero = () => {
        let data = get(cursorData)

        // Find the point where Z is 0
        let zero = data.topData.content.find((cd) => {
            return cd.z === 0
        })

        if (zero !== undefined) {
            cursorData.update(point => {
                point.pos.x = currentMetadata.coordinates.x.start + (zero.x * currentMetadata.coordinates.x.increment)
                point.pos.y = currentMetadata.coordinates.y.start + (zero.y * currentMetadata.coordinates.y.increment)
                return point
            })
        }
    }

    let updatePlot = () => {
        if (loadedTopData === undefined || div === undefined) return

        let data: Data[] = [
            {
                x: loadedTopData.content.map(c => currentMetadata.coordinates.x.start + (c.x * currentMetadata.coordinates.x.increment)),
                y: loadedTopData.content.map(c => currentMetadata.coordinates.y.start + (c.y * currentMetadata.coordinates.y.increment)),
                z: loadedTopData.content.map(c => c.z),
                zsmooth: interpolationToZsmooth(interpolation),
                type: 'heatmap',
                showscale: false,
                colorscale: colorscale,
                hoverinfo: 'none'
            }
        ]

        clayout.font.color = get(theme) === 'business' ? '#fff' : '#000'

        plot = Plotly.react(div, data, clayout, cfg)
    }

    onDestroy(() => {
        unsubscribeTheme()
        unsubscribeData()
        unsubscribeCursorData()
    })

    $: interpolation || colorscale, updatePlot()
</script>

<svelte:window on:keydown|preventDefault={onKeyDown}/>
<div class="flex flex-row items-center pt-1">
    <div class="flex flex-col">
        <p class="px-2 text-base-content">Top View (C)</p>
    </div>
    <div class="flex flex-col ml-1">
        {#if loading === LoadingState.LOADING}
            <span class="loading loading-bars loading-xs"/>
        {:else if loading === LoadingState.INVALID}
            <div class="tooltip" data-tip="hello">
                <div style="font-family: 'Material Icons'; font-size: 24px; color: #f44336;">error</div>
            </div>
        {:else}
        <div class="flex flex-row items-center">
            <button class="flex flex-col pr-1.5 {mode == "All" ? "opacity-100" : "opacity-40"}" style="font-size:12px; color:#4d4d4d;" on:click={() => mode = "All"}>
                All
            </button>
            <button class="flex flex-col pr-1.5 {mode == "B" ? "opacity-100" : "opacity-40"}" style="font-size:12px; color:#4d4d4d;" on:click={() => mode = "B"}>
                B
            </button>
            <button class="flex flex-col {mode == "D" ? "opacity-100" : "opacity-40"}" style="font-size:12px; color:#4d4d4d;" on:click={() => mode = "D"}>
                D
            </button>
        </div>
        {/if}
    </div>
    <div class="flex flex-col ml-auto mr-0.5">
        <!-- dB gain display -->
        <p class="text-xs">{currentDecibel} dB</p>
    </div>
    <div class="flex flex-col mx-0.5">
        <button class="btn btn-xs btn-primary text-xs" on:click={findZero}>Z0</button>
    </div>
    <div class="divider divider-horizontal -mx-1 my-1"/>
    <div class="flex flex-col mr-0.5">
        <Modebar bind:plot={plot}/>
    </div>
    <div class="divider divider-horizontal -mx-1 my-1"/>
    <div class="flex flex-col ml-0.5 mr-2">
        <Zoombar bind:plot={plot}/>
    </div>
</div>
<div class="flex flex-row h-full" style="max-height: calc(100% - 28px);">
    <div class="w-full h-full">
        <div class="w-full h-full" bind:this={div}/>
    </div>
</div>

<style>

</style>