<script lang="ts">
    import Plotly from 'plotly.js-dist-min'
    import PlotModebar from "./PlotModebar.svelte";
    import { densityAndSignalData, selectedPosSide } from "../lib/stores";
    import { rectifyXYZ } from '../lib/utils';
    import { ultravision } from '../lib/colorscales';
    import { CalculationMode, DistanceMode } from '../lib/models/SoundYAxisMode';
    import { onMount } from 'svelte';
    import { BLayout } from '../lib/plotting/Layouts';

    export let rectification
    
    let calculationMode = CalculationMode.Time
    let distanceMode = DistanceMode.Compressional
    let smoothing: boolean = false
    let amplitude: number = 0
    let compressionalWaveSpeed: number = 0
    let shearWaveSpeed: number = 0
    let samples: number = 0
    let ts: number = 0
    let te: number = 10
    let lastPos: number = undefined

    // Side data, constructed from Density and Signal data and coordinates updated from
    // C scan selection
    let sideData: Array<any> = []

    // Density and Signal data set from densityAndSignalData.subscribe
    let data: Array<any> = []

    // Bound variables
    let plot
    let div
    
    let cfg = {
        responsive: true,
        displayModeBar: false,
        dragmode: 'pan'
    }

    function constructSideData(y) {
        sideData = []

        const increment = ((te - ts) / samples)
        const multiplier = calculationMode === CalculationMode.Distance ? 
            (distanceMode === DistanceMode.Compressional ? 
            compressionalWaveSpeed * Math.pow(10, 3) : shearWaveSpeed * Math.pow(10, 3)) 
            : 1.0

        data.forEach(element => {
            if (element.y == y) {
                for(let i = 0; i < samples; i++) {
                    sideData.push({x: element.x, y: increment * i * multiplier, z: element.r[i].y})
                }
            }
        });
    }

    function updatePlot() {
        if (sideData.length === 0) {
            return
        }

        let rectifiedData = rectifyXYZ(sideData, amplitude, rectification)

        let data = [
            {
                x: sideData.map(d => d.x),
                y: sideData.map(d => d.y),
                z: rectifiedData.map(d => d.z),
                zsmooth: smoothing,
                type: 'heatmap',
                colorscale: ultravision
            }
        ]

        BLayout.yaxis.ticksuffix = calculationMode === CalculationMode.Time ? 's' : 'm'

        plot = Plotly.react(div, data, BLayout, cfg)
    }

    function refreshData(pos) {
        if (div == undefined) {
            return
        }

        console.log("Test")

        constructSideData(pos)
        updatePlot()

        lastPos = pos
    }

    onMount(() => {
        refreshData(lastPos)
    })

    densityAndSignalData.subscribe(v => {
        data = v.data
        amplitude = v.amplitudeMax
        compressionalWaveSpeed = v.compressionalWaveSpeed
        shearWaveSpeed = v.shearWaveSpeed
        samples = v.numberOfSignalPoints
        ts = v.timeGateStart
        te = v.timeGateEnd
    })

    selectedPosSide.subscribe(v => {
        lastPos = v
    })

    $: rectification, updatePlot()
    $: calculationMode || distanceMode, refreshData(lastPos)
</script>

<div class="flex flex-row">
    <div class="flex flex-col">
        <p class="pt-1 px-2" style="color:#4d4d4d">Side View (B)</p>
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