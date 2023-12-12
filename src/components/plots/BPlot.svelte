<script lang="ts">
    import Plotly, { type Data } from 'plotly.js-dist-min'
    import PlotModebar from "../PlotModebar.svelte";
    import { rectifyXYZ } from '../../lib/utils.js';
    import { UltraVision } from '../../lib/plotting/Colorscales';
    import { CalculationMode, DistanceMode } from '../../lib/models/SoundYAxisMode';
    import { onDestroy, onMount } from 'svelte';
    import { blayout } from '../../lib/plotting/Layouts';
    import { loadedMetadata, selectedPosSide } from '../../lib/data/Stores';
    import { invoke } from '@tauri-apps/api/tauri';
    import { LoadingState, Rectification, type Metadata, Interpolation } from '../../lib/models/Result';
    import { get } from 'svelte/store';
    import type { Position3D } from '../../lib/models/Positions';
    import Spinner from '../Spinner.svelte';
    import { interpolationToZsmooth, rectify } from '../../lib/plotting/Utils';

    export let rectification: Rectification
    export let interpolation: Interpolation

    let loading: LoadingState = LoadingState.LOADING
    let calculationMode = CalculationMode.Time
    let distanceMode = DistanceMode.Compressional

    // Bound variables
    let plot: any
    let div: any
    
    let cfg = {
        responsive: true,
        displayModeBar: false,
        dragmode: 'zoom'
    }

    function getYMultiplier(metadata: Metadata) {
        return calculationMode === CalculationMode.Distance ? 
            (distanceMode === DistanceMode.Compressional ? 
            metadata.wavespeeds.compressional : metadata.wavespeeds.shear) 
            : (1.0 * Math.pow(10, -6))
    }

    let unsubscribe = selectedPosSide.subscribe(side => {
        if (side === undefined || div === undefined) return

        // Activate load status again
        loading = LoadingState.LOADING

        // Clear current plot
        Plotly.purge(div)

        const metadata: Metadata = get(loadedMetadata)
        const indicies: Array<number> = []

        for (let i = 0; i < side.ref.cols; i++) {
            let col = i
            let row = (side.y - metadata.coordinates.y.start) / metadata.coordinates.y.increment
            indicies.push(Math.floor(col + (row * side.ref.cols)))
        }

        invoke('commands_results_parse_side_view', { path: metadata.path + "\\utIndefa-A.dat", indicies: indicies, samples: side.ref.samples }).then((v: any) => {
            let signals = v as Array<Position3D>

            let data: Data[] = [
                {
                    x: signals.map(s => metadata.coordinates.x.start + (s.x * metadata.coordinates.x.increment)),
                    y: signals.map(s => s.y * getYMultiplier(metadata) * ((metadata.timegate.end - metadata.timegate.start ) / side.ref.samples)),
                    z: signals.map(s => rectify(rectification, s.z / side.amplitude)),
                    zsmooth: interpolationToZsmooth(interpolation),
                    type: 'heatmap',
                    colorscale: UltraVision
                }
            ]
        
            blayout.yaxis.ticksuffix = calculationMode === CalculationMode.Time ? 's' : 'mm'
            blayout.margin.l = calculationMode === CalculationMode.Time ? 40 : 60

            loading = LoadingState.OK
            plot = Plotly.react(div, data, blayout, cfg)
        }).catch((e) => {
            console.error(e)
            loading = LoadingState.INVALID
        })
    })

    onDestroy(() => {
        unsubscribe()
    })

    $: calculationMode || distanceMode || rectification, selectedPosSide.update(n => n)
</script>


<div class="flex flex-row">
    <div class="flex flex-col">
        <p class="pt-1 px-2" style="color:#4d4d4d">Side View (B)</p>
    </div>
    <div class="flex flex-col ml-auto mr-2">
        <PlotModebar bind:plot={plot} bind:calculationMode={calculationMode} bind:distanceMode={distanceMode}/>
    </div>
</div>
<div class="flex flex-row w-full h-full" style="max-height: calc(100% - 28px);">
    <div class="flex flex-col w-full h-full" style="{loading === LoadingState.LOADING ? 'margin-top:-' + (blayout.margin.t + 4) + 'px;' : null}">
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
