<script lang="ts">
    import "@fontsource/fira-mono/500.css";
    import Plotly, { type Datum } from 'plotly.js-dist-min'
    import Button from '../Button.svelte'
    import type { Metadata } from "../../lib/models/Result";
    import { onDestroy } from "svelte";
    import { loadedMetadata } from "../../lib/data/Stores";
    
    export let plot: any
    export let metadata: Metadata | null = null

    let originalXRange: [Datum, Datum] = [0, 0]
    let originalYRange: [Datum, Datum] = [0, 0]

    let zoomResetButton = {
        label: undefined,
        color: "#4d4d4d",
        icon: "zoom_out_map",
        action:  () => {
            Plotly.relayout(plot, {
                'xaxis.range': originalXRange, 
                'xaxis.autorange': true, 
                'yaxis.range': originalYRange, 
                'yaxis.autorange': true
            })
        },
        disabled: false
    }

    $: plot, update()

    async function update() {
        if (plot === undefined) return

        if (plot.childNodes?.length > 0) {
            originalXRange = plot.layout.xaxis.range
            originalYRange = plot.layout.yaxis.range
        }
    }

    function zoom(mag: number) {
        let r0 = (1 + mag) / 2;
        let r1 = (1 - mag) / 2;

        let axx = plot._fullLayout.xaxis
        let axy = plot._fullLayout.yaxis

        let xRangeNow = [
            axx.r2l(plot.layout.xaxis.range[0]),
            axx.r2l(plot.layout.xaxis.range[1])
        ]

        let yRangeNow = [
            axy.r2l(plot.layout.yaxis.range[0]),
            axy.r2l(plot.layout.yaxis.range[1])
        ]

        let xNew: [Datum, Datum] = [
            axx.l2r(r0 * xRangeNow[0] + r1 * xRangeNow[1]),
            axx.l2r(r0 * xRangeNow[1] + r1 * xRangeNow[0]),
        ]

        let yNew: [Datum, Datum] = [
            axy.l2r(r0 * yRangeNow[0] + r1 * yRangeNow[1]),
            axy.l2r(r0 * yRangeNow[1] + r1 * yRangeNow[0]),
        ]

        Plotly.relayout(plot, {
            'xaxis.range': xNew, 
            'yaxis.range': yNew
        })
    }

    let unsubscribe = loadedMetadata.subscribe((value) => {
        metadata = value
    })

    onDestroy(() => {
       unsubscribe()
    })
</script>

<div class="flex flex-row w-full items-center">
    <div class="flex flex-col w-full mx-0.5">
        <button class="flex flex-col text-md" style="font-family:'Material Icons';" 
        disabled={plot?._fullLayout?.dragmode !== 'zoom'} on:click={() => {
            zoom(2)
        }}>
            zoom_out
        </button>
    </div>
    <div class="flex flex-col w-full mx-0.5">
        <button class="flex flex-col text-md" style="font-family:'Material Icons';"
        disabled={plot?._fullLayout?.dragmode !== 'zoom'} on:click={() => {
            zoom(0.5)
        }}>
            zoom_in
        </button>
    </div>
    <div class="flex flex-col w-full mx-0.5">
        <Button data={zoomResetButton}/>
    </div>
</div>

<style>

</style>