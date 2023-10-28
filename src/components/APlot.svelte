<script lang="ts">
    import Plotly from 'plotly.js-dist-min'
    import PlotModebar from "./PlotModebar.svelte";
    import { densityAndSignalData, selectedPosSignal } from '../lib/stores.js'
    import { rectifyXY } from '../lib/utils';

    export let rectification

    let amplitude: number = 0
    let compressionalWaveSpeed: number = 0
    let shearWaveSpeed: number = 0

    // Density and Signal data set from densityAndSignalData.subscribe
    let data: Array<any> = []

    // Signal data
    let signalData: Array<any> = []

    let plot
    let div
    let layout = {
        paper_bgcolor: 'rgba(0, 0, 0, 0)',
        plot_bgcolor: 'rgba(0, 0, 0, 0)',
        margin: {
            t: 20,
            l: 40,
            r: 20,
            b: 40
        }
    }
    let cfg = {
        responsive: true,
        displayModeBar: false,
        dragmode: 'pan'
    }

    function constructSignalData(x, y) {
        signalData = []
        
        data.find((cd) => {
            if (cd.x === x && cd.y === y) {
                for(let i = 0; i < cd.r.length; i++) {
                    signalData.push({x: cd.r[i].x * Math.pow(10, -6), y: cd.r[i].y})
                }
            }
        })
    }

    function updatePlot() {
        if (signalData.length === 0) {
            return
        }

        let rd = rectifyXY(signalData, amplitude, rectification)
        
        let plotData = [
            {
                x: rd.map(x => x.x),
                y: rd.map(x => x.y),
                type: 'scatter',
            }
        ]

        plot = Plotly.react(div, plotData, layout, cfg)
    }

    densityAndSignalData.subscribe(v => {
        data = v.data
        amplitude = v.amplitudeMax
        compressionalWaveSpeed = v.compressionalWaveSpeed
        shearWaveSpeed = v.shearWaveSpeed
    })

    selectedPosSignal.subscribe(v => {
        if (div == undefined) {
            return
        }

        constructSignalData(v.x, v.y)
        updatePlot()
    })

    $: rectification, updatePlot()
</script>


<div class="flex flex-row">
    <div class="flex flex-col">
        <p class="pt-1 px-2" style="color:#4d4d4d">Pulse Amplitude (A)</p>
    </div>
    <div class="flex flex-col ml-auto mr-2">
        <PlotModebar bind:plot={plot}/>
    </div>
</div>
<div class="flex flex-row h-full" style="max-height: calc(100% - 28px);">
    <div class="w-full h-full">
        <div class="w-full h-full" bind:this={div}/>
    </div>    
</div>

<style>

</style>