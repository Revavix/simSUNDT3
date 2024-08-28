<script lang="ts">
    import { DEG2RAD } from "three/src/math/MathUtils.js";
    import { ProjectSingleton } from "../../../lib/data/ProjectSingleton";
    import { TreeDropdown } from "../../../lib/models/tree/TreeDropdown";
    import type { TreeInput } from "../../../lib/models/tree/TreeInput";
    import ExpandLeftButton from "../../buttons/ExpandLeftButton.svelte";
    import type { TreeCheckbox } from "../../../lib/models/tree/TreeCheckbox";
    import { onDestroy } from "svelte";

    let size: { width: number, length: number } = { width: 0, length: 0 };
    let defectType: string | undefined = undefined;
    let defectTilt: number | undefined = undefined;
    let defectHeight: number | undefined = undefined;
    let backwallEnabled: boolean = false;

    let unsubscribe = ProjectSingleton.GetInstance().Subscribe(() => {
        let variantValue = (ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Specification:Variant") as TreeDropdown)?.value;
        let variantOptions = (ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Specification:Variant") as TreeDropdown)?.options;

        // Get defect type from options
        defectType = variantOptions?.find(option => option.value == variantValue)?.text;
        defectTilt = (ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Specification:Angles:TiltCrack") as TreeInput)?.value;
        defectHeight = (ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Specification:Measurement:Height") as TreeInput)?.value;

        backwallEnabled = (ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Surfaces:Backwall:Enabled") as TreeCheckbox)?.value;
        size = {
            width: Math.abs((ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:XEnd") as TreeInput)?.value -
                (ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:XStart") as TreeInput)?.value),
            length: Math.abs((ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:YEnd") as TreeInput)?.value -
                (ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:YStart") as TreeInput)?.value),
        }
    })

    onDestroy(() => {
        unsubscribe();
    })
</script>

<div class="flex flex-col bg-base-100 {$$restProps.class || ''} mt-2 rounded" style="z-index: 50;">
    <!-- Quickbar slot: scene information expand menu -->
    <ExpandLeftButton 
        icon="analytics"
    >
        <p class="flex flex-row w-80 text-base-content text-md mt-2 mx-2">
            Scene information
        </p>
        <div class="flex flex-row w-80 text-base-content my-1 mx-2 border-t border-stone-600 rounded-lg"/>
        <p class="flex flex-row w-80 text-base-content text-sm mx-2">
            Subject
        </p>
        <div class="flex flex-row w-80 text-base-content text-sm mx-2">
            <div class="flex flex-col text-center" style="font-size:14px; color:#ff0000">
                X
            </div>
            <sub class="flex flex-col self-end mb-2">size</sub>
            <p class="flex flex-row w-80 text-base-content text-sm ml-2">
                {size.width} mm
            </p>
        </div>
        <div class="flex flex-row w-80 text-base-content text-sm mx-2">
            <div class="flex flex-col text-center whitespace-nowrap" style="font-size:14px; color:#0000ff">
                Y
            </div>
            <sub class="flex flex-col self-end mb-2">size</sub>
            <p class="flex flex-row w-80 text-base-content text-sm ml-2">
                {size.length} mm
            </p>
        </div>
        <div class="flex flex-row w-80 text-base-content my-1 mx-2 border-t border-stone-600 rounded-lg"/>
        <p class="flex flex-row w-80 text-base-content text-sm mx-2">
            Defect
        </p>
        <p class="flex flex-row w-80 text-base-content text-sm mx-2">
            {defectType}
        </p>
        {#if defectType === "Surface Breaking Strip-like Crack"}
        <div class="flex flex-row w-80 text-base-content text-sm mx-2">
            <div class="flex flex-col" style="font-family:'Material Icons'; font-size:24px; color:#ff0000">
                horizontal_rule
            </div>
            {#if defectTilt !== undefined && defectHeight !== undefined}
            <p class="flex flex-row w-80 text-base-content text-sm mx-2">
                {Math.round(Math.sin(defectTilt * DEG2RAD) * defectHeight * 100) / 100} mm
            </p>
            {/if}
        </div>
        <div class="flex flex-row w-80 text-base-content text-sm mx-2">
            <div class="flex flex-col" style="font-family:'Material Icons'; font-size:24px; color:#429645; transform: rotate(-90deg)">
                horizontal_rule
            </div>
            {#if defectTilt !== undefined && defectHeight !== undefined}
            <p class="flex flex-row w-80 text-base-content text-sm mx-2">
                {Math.round(Math.cos(defectTilt * DEG2RAD) * defectHeight * 100) / 100} mm
            </p>
            {/if}
        </div>
        {/if}
        <p class="flex flex-row w-80 text-base-content text-sm mx-2">
            Backwall is {backwallEnabled ? "enabled" : "disabled"}
        </p>
    </ExpandLeftButton>
</div>