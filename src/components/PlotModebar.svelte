<script lang="ts">
    import "@fontsource/fira-mono/500.css";
    import Plotly, { type Datum } from 'plotly.js-dist-min'
    import Button from '../components/Button.svelte'
    import { CalculationLength, CalculationMode, DistanceMode, DistancePath } from '../lib/models/SoundYAxisMode'
    import type { Metadata } from "../lib/models/Result";
    import TooltipMultiline from "./TooltipMultiline.svelte";
    import { onDestroy } from "svelte";
    import { loadedMetadata } from "../lib/data/Stores";
    
    export let calculationMode: CalculationMode | undefined = undefined
    export let calculationLength: CalculationLength | undefined = undefined
    export let distanceMode: DistanceMode | undefined = undefined
    export let pathMode: DistancePath | undefined = undefined
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

    let unsubscribe = loadedMetadata.subscribe((value) => {
        metadata = value

        if (metadata?.probe?.true_angle === null) {
            pathMode = DistancePath.Soundpath
        }
    })

    onDestroy(() => {
       unsubscribe()
    })
</script>

<div class="flex flex-row w-full items-center">
    {#if calculationMode !== undefined || distanceMode !== undefined}
    <details class="dropdown dropdown-end">
        <summary class="btn btn-xs text-xs rounded-full w-20 btn-primary">
            <div class="flex flex-col font-normal">
                Wave
            </div>
            <div class="flex flex-col font-normal" style="font-family:'Material Icons'; font-size:20px;">
                arrow_drop_down
            </div>
        </summary>
        <ul class="menu dropdown-content bg-secondary rounded-box w-72 p-2 mt-1 shadow z-[99]">
            <li>
                <div class="form-control flex">
                    <label class="label cursor-pointer flex flex-row w-full text-xs">
                        <span class="mr-auto text-neutral">Calculate distance</span>
                        <input type="checkbox" class="toggle toggle-primary self-center rounded-full" checked={calculationMode === CalculationMode.Distance} 
                            on:change={(event) => calculationMode = event.currentTarget.checked ? CalculationMode.Distance : CalculationMode.Time}
                        />
                    </label>
                </div>
            </li>
            <li>
                <div class="form-control flex">
                    <label class="label flex flex-row w-full text-xs">
                        <span class="mr-auto text-neutral">Full length</span>
                        <input type="checkbox" class="toggle toggle-primary self-center rounded-full" checked={calculationLength === CalculationLength.Full} 
                            on:change={(event) => calculationLength = event.currentTarget.checked ? CalculationLength.Full : CalculationLength.Half}
                        />
                    </label>
                </div>
            </li>
            <li>
                <div class="form-control flex">
                    <label class="label {calculationMode !== CalculationMode.Distance ? 'cursor-not-allowed' : 'cursor-pointer'} flex flex-row w-full text-xs">
                        <span class="mr-auto {calculationMode !== CalculationMode.Distance ? 'opacity-70' : 'opacity-100'} text-neutral">Use shear waves</span>
                        {#if (distanceMode === DistanceMode.Shear && metadata?.probe.wave_properties?.type_of_probe === 3) ||
                            (distanceMode === DistanceMode.Compressional && metadata?.probe.wave_properties?.type_of_probe !== 3)}
                        <div class="tooltip tooltip-warning" data-tip="Inaccurate data may be produced since simulation uses {
                            metadata?.probe.wave_properties?.type_of_probe === 3 ? 
                            'longitudinal' : 
                            'shear'} waves">
                            <div class="flex flex-col text-warning text-xl mx-2 {calculationMode !== CalculationMode.Distance ? 'opacity-70' : 'opacity-100'}" style="font-family:'Material Icons';">
                                warning
                            </div>
                        </div>
                        {/if}
                        <input type="checkbox" class="toggle toggle-primary self-center rounded-full" checked={distanceMode === DistanceMode.Shear} 
                            disabled={calculationMode !== CalculationMode.Distance}
                            on:change={(event) => distanceMode = event.currentTarget.checked ? DistanceMode.Shear : DistanceMode.Compressional}
                        />
                    </label>
                </div>
            </li>
            <li>
                <div class="form-control flex">
                    <label class="label {calculationMode !== CalculationMode.Distance ? 'cursor-not-allowed' : 'cursor-pointer'} flex flex-row w-full text-xs">
                        <span class="mr-auto {calculationMode !== CalculationMode.Distance ? 'opacity-70' : 'opacity-100'} text-neutral">Measure true depth</span>
                        {#if metadata?.probe?.true_angle === null}
                        <div class="tooltip tooltip-warning" data-tip="True angle is invalid due to missing or invalid calibration.">
                            <div class="flex flex-col text-warning text-xl mx-2 {calculationMode !== CalculationMode.Distance ? 'opacity-70' : 'opacity-100'}" style="font-family:'Material Icons';">
                                warning
                            </div>
                        </div>
                        {/if}
                        <input type="checkbox" class="toggle toggle-primary self-center rounded-full" checked={pathMode === DistancePath.True} 
                            disabled={calculationMode !== CalculationMode.Distance || metadata?.probe?.true_angle === null}
                            on:change={(event) => pathMode = event.currentTarget.checked ? DistancePath.True : DistancePath.Soundpath}
                        />
                    </label>
                </div>
            </li>
          </ul>
    </details>
    {/if}
    <!--
    {#if metadata !== null}
    <div class="flex flex-col px-0.5 items-center" style="color:#4d4d4d; font-size: 12px; cursor: pointer">
        <TooltipMultiline labels={[
            "Calibration level: " + Math.round(metadata.max_output * 100) / 100, 
            "True angle: " + metadata.probe.true_angle
        ]}>
            <div class="flex flex-col" style="font-family:'Material Icons'; font-size:12px; color:#4d4d4d">
                info
            </div>
        </TooltipMultiline>
    </div>
    {/if}
    -->
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