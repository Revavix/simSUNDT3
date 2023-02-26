<script>
    import Plotly from 'plotly.js-dist-min'
    import PlotModebar from "./PlotModebar.svelte";
    import { selectedSignalData } from '../lib/stores.js'

    export let rectification

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

    selectedSignalData.subscribe(v => {
        if (div == undefined) {
            return
        }

        let rectifiedData = []

        if (rectification == 2) {
            rectifiedData = rectifyFullwave(v.data, v.amplitude)
        } else if (rectification == 3) { 
            rectifiedData = rectifyHalfwavePositive(v.data, v.amplitude)
        } else if (rectification == 4) { 
            rectifiedData = rectifyHalfwaveNegative(v.data, v.amplitude)
        } else {
            rectifiedData = unrectified(v.data, v.amplitude)
        }

        let data = [
            {
                x: rectifiedData.map(x => x.x),
                y: rectifiedData.map(x => x.y),
                type: 'scatter',
            }
        ]

        plot = Plotly.newPlot(div, data, layout, cfg)
    })

    function clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }

    function unrectified(arr, amplitude) {
        let r = []

        arr.forEach(element => {
            r.push({x: element.x, y: element.y / amplitude})
        });

        return r
    }

    function rectifyFullwave(arr, amplitude) {
        let r = []

        arr.forEach(element => {
            r.push({x: element.x, y: Math.abs(element.y / amplitude)})
        });

        return r
    }

    function rectifyHalfwavePositive(arr, amplitude) {
        let r = []

        arr.forEach(element => {
            r.push({x: element.x, y: clamp(element.y / amplitude, 0, 1)})
        });

        return r
    }

    function rectifyHalfwaveNegative(arr, amplitude) {
        let r = []

        arr.forEach(element => {
            r.push({x: element.x, y: clamp(element.y / amplitude, -1, 0)})
        });

        return r
    }

    $: rectification, selectedSignalData.update(n => n)
</script>


<div class="flex flex-row">
    <div class="flex flex-col">
        <p class="pt-1 px-2" style="color:#4d4d4d">A-Scan</p>
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