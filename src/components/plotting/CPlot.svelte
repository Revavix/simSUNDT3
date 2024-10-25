<script lang="ts">
    import Plotly from 'plotly.js-dist-min'
    import type { Data } from "plotly.js-dist-min"
    import { crosshairHorizontalLabel, crosshairVerticalLabel } from '../../lib/plotting/Annotations'
    import { UltraVision } from '../../lib/plotting/Colorscales';
    import { loadedMetadata, theme, activePlot } from '../../lib/data/Stores';
    import { invoke } from '@tauri-apps/api/core';
    import { LoadingState, type Top } from '../../lib/models/Result';
    import { onDestroy, onMount } from 'svelte';
    import { clayout } from '../../lib/plotting/Layouts';
    import { get } from 'svelte/store';
    import Modebar from './Modebar.svelte';
    import Zoombar from './Zoombar.svelte';
    import type { Position3D } from '../../lib/models/Positions';
    import { cScanLoadedData } from '../../lib/data/Stores';
    import { aScanCursor, bScanCursor, cScanCursor, dScanCursor } from '../../lib/data/stores/Cursors';

    export let interpolationOn: boolean
    export let colorscale = UltraVision
    export const isLoaded = () => {
        return div !== undefined
    }

    let active: boolean = true
    let currentDecibel: number = 0
    let loading: LoadingState = LoadingState.OK
    let loadedTopData: Top
    let plot: any
    let div: any
    let cfg = {
        responsive: true,
        displayModeBar: false,
        dragmode: 'zoom'
    }

    onMount(() => {
        if (div === undefined) return

        Plotly.newPlot(div, [], clayout, cfg).then((p) => {
            plot = p
        })
    })

    let unsubscribeData = loadedMetadata.subscribe((metadata) => {
        if (div === undefined) return

        if (metadata === undefined) {
            Plotly.react(div, [], clayout, cfg).then((p) => {
                plot = p
            })
            return
        }

        // Active load status again
        loading = LoadingState.LOADING

        // Load the C.dat file
        invoke('commands_results_parse_top_view', { path: metadata.path }).then((cdat: any) => {
            let midPointX = Math.floor(((cdat.columns-1) * metadata.coordinates.x.increment) / 2) + metadata.coordinates.x.start
            midPointX += midPointX % metadata.coordinates.x.increment
            let midPointY = Math.floor(((cdat.rows-1) * metadata.coordinates.y.increment) / 2) + metadata.coordinates.y.start
            midPointY += midPointY % metadata.coordinates.y.increment
            let midPointColumn = Math.floor(cdat.columns / 2)
            let midPointRow = Math.floor(cdat.rows / 2)

            clayout.annotations = [
                crosshairHorizontalLabel(midPointY),
                crosshairVerticalLabel(midPointX)
            ]

            loading = LoadingState.OK
            loadedTopData = cdat as Top

            // Trigger a plot update since data has changed
            updatePlot()

            // Manually update on first plot draw
            cScanLoadedData.set({
                currentCol: midPointColumn, 
                currentRow: midPointRow,
                cols: cdat.columns,
                rows: cdat.rows,
                samples: cdat.samples,
                amplitude: cdat.amplitude,
                content: cdat.content
            })
            cScanCursor.set({ x: midPointX, y: midPointY })
            setTimeout(() => {
                aScanCursor.set({ xIndex: Math.floor(cdat.samples / 2) })
                bScanCursor.set({ x: midPointX, yIndex: Math.floor(cdat.samples / 2) })
                dScanCursor.set({ x: midPointY, yIndex: Math.floor(cdat.samples / 2) })
                currentDecibel = getCurrentDecibel(loadedTopData.content, midPointX, midPointY)
            }, 500)

            // Listen to click events in the plot
            div.on('plotly_click', function(clickData: any) {
                if (!active) return
                cScanLoadedData.update(data => {
                    data.currentCol = Math.abs(Math.floor((clickData.points[0].x - metadata.coordinates.x.start) / metadata.coordinates.x.increment))
                    data.currentRow = Math.abs(Math.floor((clickData.points[0].y - metadata.coordinates.y.start) / metadata.coordinates.y.increment))
                    return data
                })
                cScanCursor.set({ x: clickData.points[0].x, y: clickData.points[0].y })
                bScanCursor.update(cursor => {
                    cursor.x = clickData.points[0].x
                    return cursor
                })
                dScanCursor.update(cursor => {
                    cursor.x = clickData.points[0].y
                    return cursor
                })
                activePlot.set("C")
            })
        }).catch((e) => {
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

    let unsubscribeCScanCursor = cScanCursor.subscribe(cursor => {
        if (cursor === undefined || $loadedMetadata === undefined || plot === undefined) return

        clayout.annotations = [
            // Horizontal label should align left if cursor is on the right side of the plot, otherwise right
            crosshairHorizontalLabel(
                cursor.y, 
                (cursor.x >= $loadedMetadata.coordinates.x.start + (($loadedMetadata.coordinates.x.end - $loadedMetadata.coordinates.x.start) / 2)) ? 'left' : 'right'
            ),
            // Vertical label should align top if cursor is on the bottom side of the plot, otherwise bottom
            crosshairVerticalLabel(
                cursor.x, 
                (cursor.y >= $loadedMetadata.coordinates.y.start + (($loadedMetadata.coordinates.y.end - $loadedMetadata.coordinates.y.start) / 2)) ? 'bottom' : 'top'
            )
        ]

        // Update the current decibel value
        currentDecibel = getCurrentDecibel(loadedTopData.content, cursor.x, cursor.y)

        Plotly.relayout(div, clayout).then((p) => {
            plot = p
        })
    })

    let getCurrentDecibel = (data: Array<Position3D>, x: number, y: number) => {
        if ($loadedMetadata === undefined || plot === undefined) return 0

        let point = data.find((cd) => {
            let xd = $loadedMetadata.coordinates.x.start + (cd.x * $loadedMetadata.coordinates.x.increment)
            let yd = $loadedMetadata.coordinates.y.start + (cd.y * $loadedMetadata.coordinates.y.increment)
            return xd === x && yd === y
        })

        if (point !== undefined) {
            return Number(point.z.toFixed(2))
        }

        return 0
    }


    let findZero = () => {
        if ($loadedMetadata === undefined) return

        // Find the point where Z is 0
        let zero = $cScanLoadedData.content.find((cd) => {
            return cd.z === 0
        })

        if (zero !== undefined) {
            cScanCursor.update(cursor => {
                cursor.x = $loadedMetadata.coordinates.x.start + (zero.x * $loadedMetadata.coordinates.x.increment)
                cursor.y = $loadedMetadata.coordinates.y.start + (zero.y * $loadedMetadata.coordinates.y.increment)
                return cursor
            })
            cScanLoadedData.update(data => {
                data.currentCol = zero.x
                data.currentRow = zero.y
                return data
            })
            aScanCursor.update(cursor => {
                cursor.xIndex = cursor.xIndex
                return cursor
            })
            bScanCursor.update(cursor => {
                cursor.x = $loadedMetadata.coordinates.x.start + (zero.x * $loadedMetadata.coordinates.x.increment)
                return cursor
            })
            dScanCursor.update(cursor => {
                cursor.x = $loadedMetadata.coordinates.y.start + (zero.y * $loadedMetadata.coordinates.y.increment)
                return cursor
            })
        }
    }

    let updatePlot = () => {
        if ($loadedMetadata === undefined || loadedTopData === undefined || div === undefined) return

        let data: Data[] = [
            {
                x: loadedTopData.content.map(c => $loadedMetadata.coordinates.x.start + (c.x * $loadedMetadata.coordinates.x.increment)),
                y: loadedTopData.content.map(c => $loadedMetadata.coordinates.y.start + (c.y * $loadedMetadata.coordinates.y.increment)),
                z: loadedTopData.content.map(c => c.z),
                zsmooth: interpolationOn ? 'best' : false,
                type: 'heatmap',
                showscale: false,
                colorscale: colorscale,
                hoverinfo: 'none'
            }
        ]

        clayout.font.color = get(theme) === 'business' ? '#fff' : '#000'

        Plotly.react(div, data, clayout, cfg).then((p) => {
            plot = p
        })
    }

    onDestroy(() => {
        unsubscribeTheme()
        unsubscribeData()
        unsubscribeCScanCursor()
    })

    $: interpolationOn || colorscale, updatePlot()
</script>

<svelte:options accessors={true}/>
<div class="flex flex-row items-center pt-1">
    <button class="flex flex-col focus:outline-none focus:ring-none" on:click={() => activePlot.set("C")}>
        <p class="px-2 text-base-content {$activePlot === 'C' ? '' : 'opacity-70'}">Top (C)</p>
    </button>
    <div class="flex flex-col ml-1">
        {#if loading === LoadingState.LOADING}
            <span class="loading loading-bars loading-xs"/>
        {:else if loading === LoadingState.INVALID}
            <div class="tooltip" data-tip="hello">
                <div style="font-family: 'Material Icons'; font-size: 24px; color: #f44336;">error</div>
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