<script lang="ts">
    import { onDestroy } from "svelte";
    import { loadedMetadata } from "../../lib/data/Stores";
    import type { Metadata } from "../../lib/models/Result";
    import { CalculationLength, CalculationMode, DistanceMode, DistancePath } from "../../lib/models/SoundYAxisMode";

    let metadata: Metadata | null = null
    export let calculationMode: CalculationMode | undefined = undefined
    export let calculationLength: CalculationLength | undefined = undefined
    export let distanceMode: DistanceMode | undefined = undefined
    export let pathMode: DistancePath | undefined = undefined

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