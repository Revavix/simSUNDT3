<script lang="ts">
    import Plotly from 'plotly.js-dist-min'
    import { Button } from '../lib/buttonDef'
    import ButtonComponent from '../components/Button.svelte'

    // Expects a Plotly.js plot
    export let plot: Promise<object>

    let plotDiv
    let originalXRange = [0, 0]
    let originalYRange = [0, 0]

    let panModeBtn: Button = new Button("", "#4d4d4d", "pan_tool_alt", () => {
        Plotly.relayout(plotDiv, {
            dragmode: 'pan'
        })

        // Force update for Svelte
        plotDiv = plotDiv

        // Re-enable zoom buttons in pan mode
        zoomOutBtn.disabled = false
        zoomInBtn.disabled = false
    })

    let zoomModeBtn: Button = new Button("", "#4d4d4d", "search", () => {
        Plotly.relayout(plotDiv, {
            dragmode: 'zoom'
        })

        // Force update for Svelte
        plotDiv = plotDiv

        // Disable zoom buttons in zoom mode, unexpected behavior outside of bounds
        zoomOutBtn.disabled = true
        zoomInBtn.disabled = true
    })

    let zoomOutBtn: Button = new Button("", "#4d4d4d", "zoom_out", () => {
        zoom(2)
    })
    zoomOutBtn.disabled = true

    let zoomInBtn: Button = new Button("", "#4d4d4d", "zoom_in", () => {
        zoom(0.5)
    })
    zoomInBtn.disabled = true

    let zoomResetBtn: Button = new Button("", "#4d4d4d", "zoom_out_map", () => {
        Plotly.relayout(plotDiv, {
            'xaxis.range': originalXRange, 
            'xaxis.autorange': true, 
            'yaxis.range': originalYRange, 
            'yaxis.autorange': true
        })
    })

    $: plot, update()

    async function update() {
        if (plot != undefined) {
            plot.then((v) => {
                plotDiv = v
                // @ts-ignore
                originalXRange = v.layout.xaxis.range
                // @ts-ignore
                originalYRange = v.layout.yaxis.range
            })
        }
    }

    function zoom(mag) {
        let r0 = (1 + mag) / 2;
        let r1 = (1 - mag) / 2;

        let axx = plotDiv._fullLayout.xaxis
        let axy = plotDiv._fullLayout.yaxis

        let xRangeNow = [
            axx.r2l(plotDiv.layout.xaxis.range[0]),
            axx.r2l(plotDiv.layout.xaxis.range[1])
        ]

        let yRangeNow = [
            axy.r2l(plotDiv.layout.yaxis.range[0]),
            axy.r2l(plotDiv.layout.yaxis.range[1])
        ]

        let xNew = [
            axx.l2r(r0 * xRangeNow[0] + r1 * xRangeNow[1]),
            axx.l2r(r0 * xRangeNow[1] + r1 * xRangeNow[0]),
        ]

        let yNew = [
            axy.l2r(r0 * yRangeNow[0] + r1 * yRangeNow[1]),
            axy.l2r(r0 * yRangeNow[1] + r1 * yRangeNow[0]),
        ]

        Plotly.relayout(plotDiv, {
            'xaxis.range': xNew, 
            'yaxis.range': yNew
        })
    }
</script>

<div class="flex flex-row w-full">
    {#if plotDiv != undefined}
        {#if plotDiv._fullLayout.dragmode == "zoom"}
        <div class="flex flex-col w-full mx-0.5">
            <ButtonComponent btn={panModeBtn}></ButtonComponent>
        </div>
        {:else}
        <div class="flex flex-col w-full mx-0.5">
            <ButtonComponent btn={zoomModeBtn}></ButtonComponent>
        </div>
        {/if}
    {/if}
    <div class="flex flex-col w-full mx-0.5">
        <ButtonComponent btn={zoomOutBtn}></ButtonComponent>
    </div>
    <div class="flex flex-col w-full mx-0.5">
        <ButtonComponent btn={zoomInBtn}></ButtonComponent>
    </div>
    <div class="flex flex-col w-full mx-0.5">
        <ButtonComponent btn={zoomResetBtn}></ButtonComponent>
    </div>
</div>

<style>

</style>