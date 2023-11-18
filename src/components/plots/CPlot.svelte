<script lang="ts">
    import Plotly from 'plotly.js-dist-min'
    import type { Data, Layout } from "plotly.js-dist-min"
    import PlotModebar from "../PlotModebar.svelte"
    import { dot, horizontalLine, verticalLine } from '../../lib/plotting/Annotations'
    import { UltraVision } from '../../lib/plotting/Colorscales';
    import { interpolationMode, loadedMetadata, selectedPosEnd, selectedPosSide, selectedPosSignal } from '../../lib/data/Stores';
    import { invoke } from '@tauri-apps/api/tauri';
    import { Interpolation, LoadingState, Rectification, type Metadata, type Top } from '../../lib/models/Result';
    import Spinner from '../Spinner.svelte';
    import { onDestroy, onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { interpolationToZsmooth } from '../../lib/plotting/Utils';
    import { clayout } from '../../lib/plotting/Layouts';

    export let interpolation: Interpolation

    let mode = "A"
    let loading: LoadingState = LoadingState.LOADING
    let currentMetadata: Metadata
    let plot: any
    let div: any
    let cfg = {
        responsive: true,
        displayModeBar: false,
        dragmode: 'zoom'
    }

    let unsubscribe = loadedMetadata.subscribe((metadata) => {
        if (metadata === undefined || div === undefined) return

        // Active load status again
        loading = LoadingState.LOADING

        // Clear current plot
        Plotly.purge(div)

        // Load the C.dat file
        invoke('commands_results_parse_top_view', { path: metadata.path + "\\utIndefa-C.dat"  }).then((cdat: any) => {
            let top = cdat as Top
            let midPointX = Math.floor(((top.columns-1) * metadata.coordinates.x.increment) / 2) + metadata.coordinates.x.start
            let midPointY = Math.floor(((top.rows-1) * metadata.coordinates.y.increment) / 2) + metadata.coordinates.y.start

            clayout.annotations = [
                dot(midPointX, midPointY, 'A [' + midPointX + ', ' + midPointY + ']', - metadata.coordinates.y.increment * 10),
                verticalLine(midPointX, 'D'),
                horizontalLine(midPointY, 'B')
            ]

            let data: Data[] = [
                {
                    x: top.content.map(c => metadata.coordinates.x.start + (c.x * metadata.coordinates.x.increment)),
                    y: top.content.map(c => metadata.coordinates.y.start + (c.y * metadata.coordinates.y.increment)),
                    z: top.content.map(c => c.z),
                    zsmooth: interpolationToZsmooth(interpolation),
                    type: 'heatmap',
                    colorscale: UltraVision
                }
            ]

            loading = LoadingState.OK
            setTimeout(() => {
                plot = Plotly.react(div, data, clayout, cfg)
                currentMetadata = metadata

                // Manually update on first plot draw
                selectedPosSignal.set({
                    amplitude: top.amplitude,
                    ref: {
                        cols: top.columns,
                        samples: top.samples
                    },
                    pos: {
                        x: midPointX, 
                        y: midPointY
                    }
                })
                selectedPosEnd.set({
                    amplitude: top.amplitude,
                    ref: {
                        rows: top.rows,
                        cols: top.columns,
                        samples: top.samples
                    },
                    x: midPointX
                })
                selectedPosSide.set({
                    amplitude: top.amplitude,
                    ref: {
                        cols: top.columns,
                        samples: top.samples
                    },
                    y: midPointY
                })

                div.on('plotly_click', function(d: any) {
                    for(var i=0; i < d.points.length; i++){
                        top.content.find((cd) => {
                            let x = metadata.coordinates.x.start + (cd.x * metadata.coordinates.x.increment)
                            let y = metadata.coordinates.y.start + (cd.y * metadata.coordinates.y.increment)
                            // Only update if the coordinate has data in it
                            if (x === d.points[i].x && y === d.points[i].y) {
                                // Update annotations according to chosen mode
                                if (mode == "A") {
                                    clayout.annotations[0] = dot(
                                        x, 
                                        y, 
                                        'A [' + x + ', ' + y + ']',
                                        y > midPointY ? 20 : -20
                                    )
                                    selectedPosSignal.set({
                                        amplitude: top.amplitude,
                                        ref: {
                                            cols: top.columns,
                                            samples: top.samples
                                        },
                                        pos: {
                                            x: x, 
                                            y: y
                                        }
                                    })
                                } else if (mode == "D") {
                                    clayout.annotations[1] = verticalLine(x, 'D')
                                    selectedPosEnd.set({
                                        amplitude: top.amplitude,
                                        ref: {
                                            rows: top.rows,
                                            cols: top.columns,
                                            samples: top.samples
                                        },
                                        x: x
                                    })
                                } else if (mode == "B") {
                                    clayout.annotations[2] = horizontalLine(y, 'B')
                                    selectedPosSide.set({
                                        amplitude: top.amplitude,
                                        ref: {
                                            cols: top.columns,
                                            samples: top.samples
                                        },
                                        y: y
                                    })
                                }
                                Plotly.relayout(div, clayout)
                            }
                        })
                    }
                })
            }, 10)
        }).catch((e) => {
            loading = LoadingState.INVALID
        })
    })

    onDestroy(() => {
        unsubscribe()
    })

    $: interpolation, loadedMetadata.update(m => m)
</script>

<div class="flex flex-row">
    <div class="flex flex-col">
        <p class="pt-1 px-2" style="color:#4d4d4d">Top View (C)</p>
    </div>
    <div class="flex flex-row pt-1">
        <button class="flex flex-col pr-1.5 {mode == "A" ? "opacity-100" : "opacity-40"}" style="font-size:12px; color:#4d4d4d;" on:click={() => mode = "A"}>
            A
        </button>
        <button class="flex flex-col pr-1.5 {mode == "B" ? "opacity-100" : "opacity-40"}" style="font-size:12px; color:#4d4d4d;" on:click={() => mode = "B"}>
            B
        </button>
        <button class="flex flex-col {mode == "D" ? "opacity-100" : "opacity-40"}" style="font-size:12px; color:#4d4d4d;" on:click={() => mode = "D"}>
            D
        </button>
    </div>
    <div class="flex flex-col ml-auto mr-2">
        <PlotModebar bind:plot={plot} bind:metadata={currentMetadata}/>
    </div>
</div>
<div class="flex flex-row h-full" style="max-height: calc(100% - 28px);">
    <div class="w-full h-full" style="{loading === LoadingState.LOADING ? 'margin-bottom:-' + (clayout.margin.b + 4) + 'px;' : null}">
        <div class="w-full h-full" bind:this={div}>
            {#if loading === LoadingState.LOADING}
            <Spinner/>
            {:else if loading === LoadingState.INVALID}
            <div class="flex flex-col w-full h-full items-center justify-center">
                <div class="flex flex-row" style="font-family:'Material Icons'; font-size:128px; color:#4d4d4d;">
                    dangerous
                </div>
            </div>
            {/if}
        </div>
    </div>
</div>

<style>

</style>