<script lang="ts">
    import { onMount } from "svelte";
    import Modal from "../Modal.svelte";
    import { PresetsSingleton } from "../../lib/data/PresetsSingleton";
    import type { Preset } from "../../lib/models/Preset";
    import { ProjectSingleton } from "../../lib/data/ProjectSingleton";
    import type { TreeInput } from "../../lib/models/tree/TreeInput";
    import { open } from '@tauri-apps/plugin-shell';

    export let isOpen: boolean = false
    let width: number
    let height: number
    let selectedPreset: Preset | null = null

    const applyProbeAction = () => {
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

    onMount(() => {
        width = window.innerWidth
        height = window.innerHeight

        // Refresh the presets singleton every time we open this modal
        PresetsSingleton.GetInstance().Refresh().then(() => {
            selectedPreset = PresetsSingleton.GetInstance().Presets[0]
        })
    })
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
<Modal bind:isOpen={isOpen} label="Presets (Probes)" description={"Override current project settings with preset probes"} width={width < 1340 ? 6 : 4 } height={height < 900 ? 6 : 4}>
    <!-- Dropdown selection -->
    <div class="flex flex-row w-full">
        <div class="flex flex-col mx-3 pb-3 w-full">
            <label for="import_type" class="block text-sm font-medium text-base-content">Presets</label>
            <select id="import_type" class="select select-sm bg-secondary focus:outline-none rounded-xl text-neutral" bind:value={selectedPreset}>
                {#each PresetsSingleton.GetInstance().Presets as preset}
                    <option value={preset}>{preset.name}</option>
                {/each}
            </select>
        </div>
    </div>

    <!-- Details panel -->
    <div class="flex flex-row w-full">
        <div class="flex flex-col mx-3 pb-3 w-6/12">
            <p class="block text-sm font-medium text-base-content">Details</p>
            <p class="text-xs text-base-content">
                Manufacturer is <span class="font-semibold">{selectedPreset?.manufacturer}</span><br>
                Frequency is <span class="font-semibold">{selectedPreset?.frequency}</span> MHz<br>
                Bandwidth is <span class="font-semibold">{selectedPreset?.pb}%</span> of center frequency<br>
                Beam angle is <span class="font-semibold">{selectedPreset?.angle}</span>°<br>
                Dimensions are <span class="font-semibold">{selectedPreset?.dimensions.x}x{selectedPreset?.dimensions.y}</span> mm
            </p>
        </div>
        <div class="flex flex-col mr-3 pt-3 pb-3 w-6/12">
            <div class="flex flex-row rounded px-2 py-0.5 self-end">
                <button class="btn btn-xs text-xs rounded-full btn-primary font-normal" 
                    disabled={selectedPreset == null || selectedPreset.manufacturerHref == null}
                    on:click={() => {
                        if (selectedPreset == null || selectedPreset.manufacturerHref == null) return
                        open(selectedPreset?.manufacturerHref);
                    }}>Manufacturer Website
                </button>
            </div>
            <div class="flex flex-row rounded px-2 py-0.5 self-end">
                <button class="btn btn-xs text-xs rounded-full btn-primary font-normal" 
                    disabled={selectedPreset == null || selectedPreset.datasheetHref == null}
                    on:click={() => {
                        if (selectedPreset == null || selectedPreset.datasheetHref == null) return
                        open(selectedPreset?.datasheetHref);
                    }}>Datasheet
                </button>
            </div>
        </div>
    </div>

    <!-- Cancel/create -->
    <div class="flex flex-row w-full p-3">
        <div class="flex flex-col rounded px-2 py-1 mr-auto">
            <button class="btn btn-xs text-xs rounded-full btn-primary font-normal" on:click={() => isOpen = false}>Cancel</button>
        </div>
        <div class="flex flex-col rounded px-2 py-1">
            <button class="btn btn-xs text-xs rounded-full btn-primary font-normal" on:click={applyProbeAction}>Apply</button>
        </div>
    </div>
</Modal>