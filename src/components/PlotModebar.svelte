<script lang="ts">
    import Plotly, { type Datum } from 'plotly.js-dist-min'
    import Button from '../components/Button.svelte'
    import { CalculationMode, DistanceMode } from '../lib/models/SoundYAxisMode'
    import CompressionalWave from './icons/CompressionalWave.svelte';
    import ShearWave from './icons/ShearWave.svelte';
    import Tooltip from './Tooltip.svelte';
    import type { ResultInfo } from '../lib/models/Result';
    
    export let calculationMode: CalculationMode | undefined = undefined
    export let distanceMode: DistanceMode | undefined = undefined
    export let plot: Promise<object>
    export let info: ResultInfo | null = null

    let plotDiv: any
    let originalXRange: [Datum, Datum] = [0, 0]
    let originalYRange: [Datum, Datum] = [0, 0]
    
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
        disabled: true
    }

    let zoomInButton = {
        label: "",
        color: "#4d4d4d",
        icon: "zoom_in",
        action:  () => {
            zoom(0.5)
        },
        disabled: true
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
            plot.then((v: any) => {
                plotDiv = v
                originalXRange = v.layout.xaxis.range
                originalYRange = v.layout.yaxis.range
            })
        }
    }

    function zoom(mag: number) {
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

        let xNew: [Datum, Datum] = [
            axx.l2r(r0 * xRangeNow[0] + r1 * xRangeNow[1]),
            axx.l2r(r0 * xRangeNow[1] + r1 * xRangeNow[0]),
        ]

        let yNew: [Datum, Datum] = [
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
    {#if info !== null}
    <div class="flex flex-col px-0.5 items-center" style="color:#4d4d4d; font-size: 12px; cursor: pointer">
        <Tooltip label={"Calibration level: " + info.calibration}>
            <div class="flex flex-col" style="font-family:'Material Icons'; font-size:12px; color:#4d4d4d">
                info
            </div>
        </Tooltip>
    </div>
    {/if}
    {#if calculationMode !== undefined && distanceMode !== undefined}
        {#if distanceMode === DistanceMode.Shear}
        <div class="flex flex-col w-full mx-0.5">
            <button style="color:#4d4d4d; font-size: 12px" on:click={() => { distanceMode = DistanceMode.Compressional}} disabled={calculationMode === CalculationMode.Time}>
                <Tooltip label="Swap to Shear Wave distance mode" disabled={calculationMode === CalculationMode.Time}>
                    <ShearWave opacity={calculationMode === CalculationMode.Time ? 0.5 : 1.0}/>
                </Tooltip>
            </button>
        </div>
        {:else if distanceMode === DistanceMode.Compressional}
        <div class="flex flex-col w-full mx-0.5">
            <button style="color:#4d4d4d; font-size: 12px" on:click={() => { distanceMode = DistanceMode.Shear}} disabled={calculationMode === CalculationMode.Time}>
                <Tooltip label="Swap to Compressional Wave distance mode" disabled={calculationMode === CalculationMode.Time}>
                    <CompressionalWave opacity={calculationMode === CalculationMode.Time ? 0.5 : 1.0}/>
                </Tooltip>
            </button>
        </div>
        {/if}
        {#if calculationMode === CalculationMode.Distance}
        <div class="flex flex-col w-full mx-0.5">
            <button style="color:#4d4d4d; font-size: 12px" on:click={() => { calculationMode = CalculationMode.Time}}>
                μs
            </button>
        </div>
        {:else if calculationMode === CalculationMode.Time}
        <div class="flex flex-col w-full mx-0.5">
            <button style="color:#4d4d4d; font-size: 12px" on:click={() => { calculationMode = CalculationMode.Distance}}>
                mm
            </button>
        </div>
        {/if}
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