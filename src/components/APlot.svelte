<script>
    import Plotly from 'plotly.js-dist-min'
    import PlotModebar from "./PlotModebar.svelte";
    import { selectedSignalData } from '../lib/stores.js'
    import { rectifyXY } from '../lib/utils';

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

        let rectifiedData = rectifyXY(v.data, v.amplitude, rectification)

        let data = [
            {
                x: rectifiedData.map(x => x.x),
                y: rectifiedData.map(x => x.y),
                type: 'scatter',
            }
        ]

        plot = Plotly.react(div, data, layout, cfg)
    })

    $: rectification, selectedSignalData.update(n => n)
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