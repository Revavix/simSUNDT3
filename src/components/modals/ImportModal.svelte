<script lang="ts">
    import { ImportVariant, ImportType } from "../../lib/models/Import";
    import type { Button as IButton } from "../../lib/models/Button";
    import Button from "../Button.svelte";
    import Modal from "../Modal.svelte";
    import SimsundtTwoResults from '../importing/SimsundtTwoResults.svelte';

    export let isOpen: boolean
    let width: number 
    let height: number
    let importVariant: ImportVariant = 0
    let importType: ImportType = 0

    let cancelButton: IButton = {
        color: "#ba3822", 
        icon: "close", 
        label: "Cancel", 
        labelSize: 14, 
        action: () => {
            isOpen = false
        }
    }

    let submitButton: IButton = {
        color: "#55b13c", 
        icon: "input", 
        label: "Submit", 
        labelSize: 14, 
        action: () => {}
    }
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
<Modal bind:isOpen={isOpen} label="Import" description={"Import projects, results or preprocessor data"} width={width < 1340 ? 6 : 4 } height={height < 900 ? 6 : 4}>
    <div class="flex flex-row w-full">
        <div class="flex flex-col ml-3 pb-3 w-8/12">
            <label for="import_version" class="block text-sm font-medium text-base-color">Software origin</label>
            <select id="import_version" class="select select-sm select-secondary rounded-lg" bind:value={importVariant}>
                <option value={ImportVariant.SIMSUNDT_V2}>SimSUNDT - Version 2</option>
            </select>
        </div>
        <div class="flex flex-col pl-3 mr-3 pb-3 w-4/12">
            <label for="import_type" class="block text-sm font-medium text-base-color">Type</label>
            <select id="import_type" class="select select-sm select-secondary rounded-lg" bind:value={importType}>
                <option value={ImportType.RESULTS}>Result</option>
            </select>
        </div>
    </div>
    {#if importVariant === ImportVariant.SIMSUNDT_V2 && importType === ImportType.RESULTS}
    <SimsundtTwoResults bind:parentModalIsOpen={isOpen} bind:parentCancelButton={cancelButton} bind:parentSubmitButton={submitButton}/>
    {/if}
    <div class="flex flex-row w-full p-3">
        <div class="flex flex-col rounded px-2 py-1 mr-auto">
            <button class="btn btn-sm btn-secondary rounded-lg" on:click={cancelButton.action}>
                <div class="flex flex-col text-base-content" style="font-family: 'Material Icons'; font-size: 16px;">
                    close
                </div>
                <span class="flex flex-col text-xs">Cancel</span>
            </button>
        </div>
        <div class="flex flex-col rounded px-2 py-1 hover:bg-stone-50 ml-auto">
            <button class="btn btn-sm btn-primary rounded-lg" on:click={submitButton.action}>
                <div class="flex flex-col text-base-content" style="font-family: 'Material Icons'; font-size: 16px;">
                    input
                </div>
                <span class="flex flex-col text-xs">Submit</span>
            </button>
        </div>
    </div>
</Modal>