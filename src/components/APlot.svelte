<script>
    import Plotly from 'plotly.js-dist-min'
    import PlotModebar from "./PlotModebar.svelte";
    import { selectedSignalData } from '../lib/stores.js'

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

        let data = [
            {
                x: v.map(x => x.x),
                y: v.map(x => x.y),
                type: 'scatter',
            }
        ]

        plot = Plotly.newPlot(div, data, layout, cfg)
    })
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