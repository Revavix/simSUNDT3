<script>
    import Plotly from 'plotly.js-dist-min'
    import PlotModebar from "./PlotModebar.svelte";
    import { selectedSideData } from "../lib/stores";
    import { rectifyXYZ } from '../lib/utils';

    export let rectification

    let smoothing = false
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
        },
        shapes: [],
        annotations: []
    }
    let cfg = {
        responsive: true,
        displayModeBar: false,
        dragmode: 'pan'
    }

    selectedSideData.subscribe(v => {
        if (div == undefined) {
            return
        }

        let rectifiedData = rectifyXYZ(v.data, v.amplitude, rectification)

        let data = [
            {
                x: rectifiedData.map(d => d.x),
                y: rectifiedData.map(d => d.y),
                z: rectifiedData.map(d => d.z),
                zsmooth: smoothing,
                type: 'heatmap'
            }
        ]

        plot = Plotly.react(div, data, layout, cfg)
    })

    $: rectification, selectedSideData.update(n => n)
</script>

<div class="flex flex-row">
    <div class="flex flex-col">
        <p class="pt-1 px-2" style="color:#4d4d4d">Side View (B)</p>
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