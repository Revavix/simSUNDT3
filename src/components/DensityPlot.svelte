<script lang="ts">
    import Plotly from 'plotly.js-dist-min'
    import { densityAndSignalData } from '../lib/stores'

    // Format [[x, y, v], [x, y, v]]
    export let plot

    let plotDiv
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
    let plotlyCfg = {
        responsive: true,
        displayModeBar: false,
        dragmode: 'pan'
    }

    densityAndSignalData.subscribe(v => {
        let plotData = [
            {
                x: v.data.map(x => x.x),
                y: v.data.map(x => x.y),
                z: v.data.map(x => x.z),
                zsmooth: false,
                type: 'heatmap'
            }
        ]

        plot = Plotly.react(plotDiv, plotData, layout, plotlyCfg)
    })
</script>

<div class="w-full h-full">
    <div class="w-full h-full" bind:this={plotDiv}/>
</div>

<style>
    
</style>