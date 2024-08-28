<script lang="ts">
    import Plotly, { type Data } from 'plotly.js-dist-min'
    import PlotModebar from "../PlotModebar.svelte";
    import { loadedMetadata, selectedPosSignal, theme } from '../../lib/data/Stores';
    import { onDestroy } from 'svelte';
    import { get } from 'svelte/store';
    import { LoadingState, type Metadata } from '../../lib/models/Result';
    import { invoke } from '@tauri-apps/api/tauri';
    import Spinner from '../Spinner.svelte';
    import type { Position2D } from '../../lib/models/Positions';
    import { rectify } from '../../lib/plotting/Utils';
    

    export let rectification: any

    let loading: LoadingState = LoadingState.LOADING

    // Density and Signal data set from resultData
    let data: Array<any> = []

    // Signal data
    let signalData: Array<any> = []

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
    }
    let cfg = {
        responsive: true,
        displayModeBar: false,
        dragmode: 'zoom'
    }

    let unsubscribeData = selectedPosSignal.subscribe(point => {
        if (div == undefined || point === undefined) return

        // Active load status again
        loading = LoadingState.LOADING

        // Clear current plot
        Plotly.purge(div)

        const metadata: Metadata = get(loadedMetadata)
        let col = (point.pos.x - metadata.coordinates.x.start) / metadata.coordinates.x.increment
        let row = (point.pos.y - metadata.coordinates.y.start) / metadata.coordinates.y.increment
        let index = col + (row * point.ref.cols)

        invoke('commands_results_parse_point_view', { path: metadata.path + "\\utIndefa-A.dat", index: index, samples: point.ref.samples }).then((v: any) => {
            let signal = v as Array<Position2D>

            let plotData: Data[] = [
                {
                    x: signal.map(s => (metadata.timegate.start + (s.x * metadata.timegate.increment)) * Math.pow(10, -6)),
                    y: signal.map(s => rectify(rectification, s.y / point.amplitude)),
                    type: 'scatter',
                }
            ]

            plot = Plotly.react(div, plotData, layout, cfg)
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

    onDestroy(() => {
        unsubscribeTheme()
        unsubscribeData()
    })

    $: rectification, selectedPosSignal.update(s => s)
</script>

<div class="flex flex-row">
    <div class="flex flex-col">
        <p class="pt-1 px-2 text-base-content">Pulse Amplitude (A)</p>
    </div>
    <div class="flex flex-col ml-auto mr-2">
        <PlotModebar bind:plot={plot}/>
    </div>
</div>
<div class="flex flex-row h-full" style="max-height: calc(100% - 28px);">
    <div class="w-full h-full" style="{loading === LoadingState.LOADING ? 'margin-bottom:-' + (layout.margin.b + 4) + 'px;' : null}">
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