<script lang="ts">
    import Plotly from 'plotly.js-dist-min'
    import Button from '../components/Button.svelte'

    // Expects a Plotly.js plot
    export let mode: string | undefined
    export let plot: Promise<object>

    let plotDiv
    let originalXRange = [0, 0]
    let originalYRange = [0, 0]
    
    let panModeButton = {
        label: "",
        color: "#4d4d4d",
        icon: "pan_tool_alt",
        action:  () => {
            Plotly.relayout(plotDiv, {
                dragmode: 'pan'
            })

            // Force update for Svelte
            plotDiv = plotDiv

            // Re-enable zoom buttons in pan mode
            zoomOutButton.disabled = false
            zoomInButton.disabled = false
        },
        disabled: false
    }

    let zoomModeButton = {
        label: "",
        color: "#4d4d4d",
        icon: "search",
        action:  () => {
            Plotly.relayout(plotDiv, {
                dragmode: 'zoom'
            })

            // Force update for Svelte
            plotDiv = plotDiv

            // Disable zoom buttons in zoom mode, unexpected behavior outside of bounds
            zoomOutButton.disabled = true
            zoomInButton.disabled = true
        },
        disabled: false
    }

    let zoomOutButton = {
        label: "",
        color: "#4d4d4d",
        icon: "zoom_out",
        action:  () => {
            zoom(2)
        },
        disabled: false
    }

    let zoomInButton = {
        label: "",
        color: "#4d4d4d",
        icon: "zoom_in",
        action:  () => {
            zoom(0.5)
        },
        disabled: false
    }

    let zoomResetButton = {
        label: "",
        color: "#4d4d4d",
        icon: "zoom_out_map",
        action:  () => {
            Plotly.relayout(plotDiv, {
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
    {#if mode === "mm"}
    <div class="flex flex-col w-full mx-0.5">
        <button style="color:#4d4d4d; font-size: 12px" on:click={() => { mode = 'μs'}}>
            μs
        </button>
    </div>
    {:else if mode === "μs"}
    <div class="flex flex-col w-full mx-0.5">
        <button style="color:#4d4d4d; font-size: 12px" on:click={() => { mode = 'mm'}}>
            mm
        </button>
    </div>
    {/if}
    {#if plotDiv != undefined}
        {#if plotDiv._fullLayout.dragmode == "zoom"}
        <div class="flex flex-col w-full mx-0.5">
            <Button data={panModeButton}></Button>
        </div>
        {:else}
        <div class="flex flex-col w-full mx-0.5">
            <Button data={zoomModeButton}></Button>
        </div>
        {/if}
    {/if}
    <div class="flex flex-col w-full mx-0.5">
        <Button data={zoomOutButton}></Button>
    </div>
    <div class="flex flex-col w-full mx-0.5">
        <Button data={zoomInButton}></Button>
    </div>
    <div class="flex flex-col w-full mx-0.5">
        <Button data={zoomResetButton}></Button>
    </div>
</div>

<style>

</style>