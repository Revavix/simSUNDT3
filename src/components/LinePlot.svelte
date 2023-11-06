<script lang="ts">
    import Plotly, { type Data } from 'plotly.js-dist-min'
    import { onMount } from 'svelte';

    // Format [[x, y], [x, y]]
    export let rawData: Array<any> = []
    export let plot: any

    let plotDiv: any
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

    onMount(() => {
        let data: Data[] = [
            {
                x: rawData.map(x => x[0]),
                y: rawData.map(x => x[1]),
                type: 'scatter',
            }
        ]

        plot = Plotly.newPlot(plotDiv, data, layout, plotlyCfg)
    })

</script>

<div class="w-full h-full">
    <div class="w-full h-full" bind:this={plotDiv}/>
</div>

<style>

</style>