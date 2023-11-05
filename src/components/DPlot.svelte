<script lang="ts">
    import Plotly, { type Data } from 'plotly.js-dist-min'
    import PlotModebar from "./PlotModebar.svelte";
    import { rectifyXYZ } from '../lib/utils';
    import { UltraVision } from '../lib/plotting/Colorscales';
    import { CalculationMode, DistanceMode } from '../lib/models/SoundYAxisMode';
    import { onMount } from 'svelte';
    import { dLayout } from '../lib/plotting/Layouts';
    import { resultData, selectedPosEnd } from '../lib/data/Stores';

    export let rectification: any

    let calculationMode = CalculationMode.Time
    let distanceMode = DistanceMode.Compressional
    let amplitude: number = 0
    let compressionalWaveSpeed: number = 0
    let shearWaveSpeed: number = 0
    let samples: number = 0
    let ts: number = 0
    let te: number = 10
    let lastPos: number | undefined = undefined

    // End data, constructed from Density and Signal data and coordinates updated from
    // C scan selection
    let endData: Array<any> = []

    // Density and Signal data set from resultData
    let data: Array<any> = []

    // Bound variables
    let plot: any
    let div: any

    
    let cfg = {
        responsive: true,
        displayModeBar: false,
        dragmode: 'pan'
    }

    function constructEndData(x: number) {
        endData = []

        const increment = ((te - ts) / samples)
        const multiplier = calculationMode === CalculationMode.Distance ? 
            (distanceMode === DistanceMode.Compressional ? 
            compressionalWaveSpeed * Math.pow(10, 3) : shearWaveSpeed * Math.pow(10, 3)) 
            : 1.0

        data.forEach(element => {
            if (element.x == x) {
                for(let i = 0; i < samples; i++) {
                    endData.push({x: element.y, y: increment * i * multiplier, z: element.r[i].y})
                }
            }
        });
    }

    function updatePlot() {
        if (endData.length === 0) {
            return
        }

        let rectifiedData = rectifyXYZ(endData, amplitude, rectification)

        let data: Data[] = [
            {
                x: endData.map(d => d.x),
                y: endData.map(d => d.y),
                z: rectifiedData.map(d => d.z),
                zsmooth: false,
                type: 'heatmap',
                colorscale: UltraVision
            }
        ]
        dLayout.yaxis.ticksuffix = calculationMode === CalculationMode.Time ? 's' : 'm'

        plot = Plotly.react(div, data, dLayout, cfg)
    }

    function refreshData(pos: any) {
        if (div == undefined) {
            return
        }

        constructEndData(pos)
        updatePlot()

        lastPos = pos
    }

    onMount(() => {
        refreshData(lastPos)
    })

    resultData.subscribe(v => {
        if (v === undefined) return

        data = v.data
        amplitude = v.amplitude
        compressionalWaveSpeed = v.wavespeeds.compressional
        shearWaveSpeed = v.wavespeeds.shear
        samples = v.samples
        ts = v.timegate.start
        te = v.timegate.end
    })
    
    selectedPosEnd.subscribe(v => {
        if (v === undefined) return
        lastPos = v
    })

    $: rectification, updatePlot()
    $: calculationMode || distanceMode, refreshData(lastPos)
</script>

<div class="flex flex-row">
    <div class="flex flex-col">
        <p class="pt-1 px-2" style="color:#4d4d4d">End View (D)</p>
    </div>
    <div class="flex flex-col ml-auto mr-2">
        <PlotModebar bind:plot={plot} bind:calculationMode={calculationMode} bind:distanceMode={distanceMode}/>
    </div>
</div>
<div class="flex flex-row h-full" style="max-height: calc(100% - 28px);">
    <div class="w-full h-full">
        <div class="w-full h-full" bind:this={div}/>
    </div>
</div>