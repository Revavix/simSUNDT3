<script lang="ts">
    import Plotly, { type Data } from 'plotly.js-dist-min'
    import PlotModebar from "./PlotModebar.svelte";
    import { rectifyXY } from '../lib/utils.js';
    import { resultData, selectedPosSignal } from '../lib/data/Stores';
    

    export let rectification: any

    let amplitude: number = 0
    let compressionalWaveSpeed: number = 0
    let shearWaveSpeed: number = 0

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
        }
    }
    let cfg = {
        responsive: true,
        displayModeBar: false,
        dragmode: 'pan'
    }

    function constructSignalData(x: number, y: number) {
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
        
        let plotData: Data[] = [
            {
                x: rd.map(x => x.x),
                y: rd.map(x => x.y),
                type: 'scatter',
            }
        ]

        plot = Plotly.react(div, plotData, layout, cfg)
    }

    resultData.subscribe(v => {
        if (v === undefined) return

        data = v.data
        amplitude = v.amplitude
        compressionalWaveSpeed = v.wavespeeds.compressional
        shearWaveSpeed = v.wavespeeds.shear
    })

    selectedPosSignal.subscribe(v => {
        if (div == undefined || v === undefined) return

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