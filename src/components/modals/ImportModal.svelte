<script lang="ts">
    import { ImportVariant, ImportType } from "../../lib/models/Import";
    import Button from "../Button.svelte";
    import Modal from "../Modal.svelte";
    import SimsundtTwoResults from '../importing/SimsundtTwoResults.svelte';

    export let isOpen: boolean
    let width: number 
    let height: number
    let importVariant: ImportVariant = 0
    let importType: ImportType = 0
    let submit: () => {}
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
<Modal bind:isOpen={isOpen} label="Import" description={"Import projects, results or preprocessor data"} width={width < 1340 ? 6 : 4 } height={height < 900 ? 6 : 4}>
    <div class="flex flex-row w-full">
        <div class="flex flex-col ml-3 pb-3 w-8/12">
            <label for="import_version" class="block text-sm font-medium text-gray-900 dark:text-white" style="color:#4d4d4d;">Software origin</label>
            <select id="import_version" class="bg-gray-50 border-2 border-transparent text-gray-900 text-sm rounded-md focus:border-amber-500 focus:outline-none focus:ring-0 disabled:opacity-75" bind:value={importVariant}>
                <option value={ImportVariant.SIMSUNDT_V2}>SimSUNDT - Version 2</option>
            </select>
        </div>
        <div class="flex flex-col pl-3 mr-3 pb-3 w-4/12">
            <label for="import_type" class="block text-sm font-medium text-gray-900 dark:text-white" style="color:#4d4d4d;">Type</label>
            <select id="import_type" class="bg-gray-50 border-2 border-transparent text-gray-900 text-sm rounded-md focus:border-amber-500 focus:outline-none focus:ring-0 disabled:opacity-75" bind:value={importType}>
                <option value={ImportType.RESULTS}>Result</option>
            </select>
        </div>
    </div>
    {#if importVariant === ImportVariant.SIMSUNDT_V2 && importType === ImportType.RESULTS}
    <SimsundtTwoResults bind:submit={submit}/>
    {/if}
    <div class="flex flex-row w-full p-3">
        <div class="flex flex-col rounded px-2 py-1 hover:bg-stone-50 mr-auto">
            <Button data={{ color: "#ba3822", icon: "close", label: "Cancel", labelSize: 14, action: () => {isOpen = false} }}/>
        </div>
        <div class="flex flex-col rounded px-2 py-1 hover:bg-stone-50 ml-auto">
            <Button data={{ color: "#55b13c", icon: "input", label: "Submit", labelSize: 14, action: submit }}/>
        </div>
    </div>
</Modal>