<script lang="ts">
    import "@fontsource/fira-mono/500.css";
    import Plotly, { type Datum } from 'plotly.js-dist-min'
    import Button from '../components/Button.svelte'
    import { CalculationMode, DistanceMode } from '../lib/models/SoundYAxisMode'
    import CompressionalWave from './icons/CompressionalWave.svelte';
    import ShearWave from './icons/ShearWave.svelte';
    import Tooltip from './Tooltip.svelte';
    import type { Metadata } from "../lib/models/Result";
    import TooltipMultiline from "./TooltipMultiline.svelte";
    
    export let calculationMode: CalculationMode | undefined = undefined
    export let distanceMode: DistanceMode | undefined = undefined
    export let plot: Promise<object>
    export let metadata: Metadata | null = null

    let plotDiv: any
    let originalXRange: [Datum, Datum] = [0, 0]
    let originalYRange: [Datum, Datum] = [0, 0]
    
    let panModeButton = {
        label: undefined,
        color: "#4d4d4d",
        icon: "pan_tool_alt",
        action:  () => {
            Plotly.relayout(plotDiv, {
                dragmode: 'zoom'
            })

            // Force update for Svelte
            plotDiv = plotDiv

            // Re-enable zoom buttons in pan mode
            zoomOutButton.disabled = true
            zoomInButton.disabled = true
        },
        disabled: false
    }

    let zoomModeButton = {
        label: undefined,
        color: "#4d4d4d",
        icon: "search",
        action:  () => {
            Plotly.relayout(plotDiv, {
                dragmode: 'pan'
            })

            // Force update for Svelte
            plotDiv = plotDiv

            // Disable zoom buttons in zoom mode, unexpected behavior outside of bounds
            zoomOutButton.disabled = false
            zoomInButton.disabled = false
        },
        disabled: false
    }

    let zoomOutButton = {
        label: undefined,
        color: "#4d4d4d",
        icon: "zoom_out",
        action:  () => {
            zoom(2)
        },
        disabled: true
    }

    let zoomInButton = {
        label: undefined,
        color: "#4d4d4d",
        icon: "zoom_in",
        action:  () => {
            zoom(0.5)
        },
        disabled: true
    }

    let zoomResetButton = {
        label: undefined,
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
        if (plot === undefined) return

        plot.then((v: any) => {
            if (v.childNodes.length === 0) return
            plotDiv = v
            originalXRange = v.layout.xaxis.range
            originalYRange = v.layout.yaxis.range
        })
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
    {#if metadata !== null}
    <div class="flex flex-col px-0.5 items-center" style="color:#4d4d4d; font-size: 12px; cursor: pointer">
        <TooltipMultiline labels={[
            "Calibration level: " + metadata.max_output, 
            "True angle: " + metadata.probe.true_angle
        ]}>
            <div class="flex flex-col" style="font-family:'Material Icons'; font-size:12px; color:#4d4d4d">
                info
            </div>
        </TooltipMultiline>
    </div>
    {/if}
    {#if calculationMode !== undefined && distanceMode !== undefined}
        {#if distanceMode === DistanceMode.Shear}
        <div class="flex flex-col w-full mx-0.5">
            <button style="color:#4d4d4d; font-size: 12px" on:click={() => { distanceMode = DistanceMode.Compressional}} disabled={calculationMode === CalculationMode.Time}>
                <Tooltip label="Calculating distance using shear wave" disabled={calculationMode === CalculationMode.Time}>
                    <ShearWave opacity={calculationMode === CalculationMode.Time ? 0.5 : 1.0}/>
                </Tooltip>
            </button>
        </div>
        {:else if distanceMode === DistanceMode.Compressional}
        <div class="flex flex-col w-full mx-0.5">
            <button style="color:#4d4d4d; font-size: 12px" on:click={() => { distanceMode = DistanceMode.Shear}} disabled={calculationMode === CalculationMode.Time}>
                <Tooltip label="Calculating distance using compressional wave" disabled={calculationMode === CalculationMode.Time}>
                    <CompressionalWave opacity={calculationMode === CalculationMode.Time ? 0.5 : 1.0}/>
                </Tooltip>
            </button>
        </div>
        {/if}
        {#if calculationMode === CalculationMode.Distance}
        <div class="flex flex-col w-full mx-0.5">
            <button style="color:#4d4d4d; font-size: 14px; font-family: Fira Mono; font-weight: 500" on:click={() => { calculationMode = CalculationMode.Time}}>
                mm
            </button>
        </div>
        {:else if calculationMode === CalculationMode.Time}
        <div class="flex flex-col w-full mx-0.5">
            <button style="color:#4d4d4d; font-size: 14px; font-family: Fira Mono; font-weight: 500" on:click={() => { calculationMode = CalculationMode.Distance}}>
                μs
            </button>
        </div>
        {/if}
    {/if}
    {#if plotDiv?._fullLayout?.dragmode == "zoom"}
    <div class="flex flex-col w-full mx-0.5">
        <Button data={zoomModeButton}/>
    </div>
    {:else}
    <div class="flex flex-col w-full mx-0.5">
        <Button data={panModeButton}/>
    </div>
    {/if}
    <div class="flex flex-col w-full mx-0.5">
        <Button data={zoomOutButton}/>
    </div>
    <div class="flex flex-col w-full mx-0.5">
        <Button data={zoomInButton}/>
    </div>
    <div class="flex flex-col w-full mx-0.5">
        <Button data={zoomResetButton}/>
    </div>
</div>

<style>

</style>