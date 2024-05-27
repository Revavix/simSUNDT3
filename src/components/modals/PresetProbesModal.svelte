<script lang="ts">
    import { onMount } from "svelte";
    import type { Button as IButton } from "../../lib/models/Button";
    import Button from "../Button.svelte";
    import Modal from "../Modal.svelte";
    import { PresetsSingleton } from "../../lib/data/PresetsSingleton";
    import type { Preset } from "../../lib/models/Preset";
    import { ProjectSingleton } from "../../lib/data/ProjectSingleton";
    import type { TreeInput } from "../../lib/models/tree/TreeInput";
    import { open } from '@tauri-apps/api/shell';

    export let isOpen: boolean = false
    let width: number
    let height: number
    let selectedPreset: Preset | null = null

    let visitwebsiteButton: IButton = {
        color: "#55b13c", 
        icon: "open_in_new", 
        label: "Manufacturer website", 
        labelSize: 14, 
        action: () => {
            if (selectedPreset == null || selectedPreset.manufacturerHref == null) return
            open(selectedPreset?.manufacturerHref);
        },
        disabled: true
    }

    let avgDgsDiagramButton: IButton = {
        color: "#55b13c", 
        icon: "show_chart", 
        label: "AVG/DGS diagram", 
        labelSize: 14, 
        action: () => {
            if (selectedPreset == null || selectedPreset.datasheetHref == null) return
            open(selectedPreset?.datasheetHref);
        },
        disabled: true
    }

    let cancelButton: IButton = {
        color: "#ba3822", 
        icon: "close", 
        label: "Cancel", 
        labelSize: 14, 
        action: () => {
            isOpen = false
        }
    }

    let applyButton: IButton = {
        color: "#55b13c", 
        icon: "input", 
        label: "Apply", 
        labelSize: 14, 
        action: () => {
            if (selectedPreset == null) return

            // Update the projectSingleton tree with the selected preset information
            let freq = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Transmitter:Spectrum:Frequency") as TreeInput
            let bw = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Transmitter:Spectrum:Bandwidth") as TreeInput
            let angle = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Transmitter:BeamAngles:Angle") as TreeInput
            let dimX = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Transmitter:ShapeandElements:X:Length") as TreeInput
            let dimY = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Transmitter:ShapeandElements:Y:Length") as TreeInput

            freq.value = selectedPreset.frequency
            bw.value = (selectedPreset.pb / 100) * selectedPreset.frequency
            angle.value = selectedPreset.angle
            dimX.value = selectedPreset.dimensions.x
            dimY.value = selectedPreset.dimensions.y

            ProjectSingleton.GetInstance().ForceRefresh()

            isOpen = false
        }
    }

    onMount(() => {
        width = window.innerWidth
        height = window.innerHeight

        // Refresh the presets singleton every time we open this modal
        PresetsSingleton.GetInstance().Refresh().then(() => {
            selectedPreset = PresetsSingleton.GetInstance().Presets[0]
        })
    })

    // Variable watcher of selectedPreset, if it changes, update some properties of buttons in the details panel, like disabled state
    $: {
        visitwebsiteButton.disabled = selectedPreset == null || selectedPreset.manufacturerHref == null
        avgDgsDiagramButton.disabled = selectedPreset == null || selectedPreset.datasheetHref == null
    }
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
<Modal bind:isOpen={isOpen} label="Presets (Probes)" description={"Override current project settings with preset probes"} width={width < 1340 ? 6 : 4 } height={height < 900 ? 6 : 4}>
    <!-- Dropdown selection -->
    <div class="flex flex-row w-full">
        <div class="flex flex-col mx-3 pb-3 w-full">
            <label for="import_type" class="block text-sm font-medium text-gray-900 dark:text-white" style="color:#4d4d4d;">Presets</label>
            <select id="import_type" class="bg-gray-50 border-2 border-transparent text-gray-900 text-sm rounded-md focus:border-amber-500 focus:outline-none focus:ring-0 disabled:opacity-75" bind:value={selectedPreset}>
                {#each PresetsSingleton.GetInstance().Presets as preset}
                    <option value={preset}>{preset.name}</option>
                {/each}
            </select>
        </div>
    </div>

    <!-- Details panel -->
    <div class="flex flex-row w-full">
        <div class="flex flex-col mx-3 pb-3 w-6/12">
            <p class="block text-sm font-medium text-gray-900 dark:text-white" style="color:#4d4d4d;">Details</p>
            <p class="text-xs text-gray-900">
                Manufacturer is <span class="font-semibold">{selectedPreset?.manufacturer}</span><br>
                Frequency is <span class="font-semibold">{selectedPreset?.frequency}</span> MHz<br>
                Bandwidth is <span class="font-semibold">{selectedPreset?.pb}%</span> of center frequency<br>
                Beam angle is <span class="font-semibold">{selectedPreset?.angle}</span>°<br>
                Dimensions are <span class="font-semibold">{selectedPreset?.dimensions.x}x{selectedPreset?.dimensions.y}</span> mm
            </p>
        </div>
        <div class="flex flex-col mr-3 pt-3 pb-3 w-6/12">
            <div class="flex flex-row rounded px-2 py-0.5 hover:bg-stone-50 self-end">
                <Button data={visitwebsiteButton}/>
            </div>
            <div class="flex flex-row rounded px-2 py-0.5 hover:bg-stone-50 self-end">
                <Button data={avgDgsDiagramButton}/>
            </div>
        </div>
    </div>

    <!-- Cancel/create -->
    <div class="flex flex-row w-full p-3">
        <div class="flex flex-col rounded px-2 py-1 hover:bg-stone-50 mr-auto">
            <Button data={cancelButton}/>
        </div>
        <div class="flex flex-col rounded px-2 py-1 hover:bg-stone-50">
            <Button data={applyButton}/>
        </div>
    </div>
</Modal>