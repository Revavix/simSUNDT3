<script lang="ts">
    import { Tab } from "../lib/tabDef"
    export let tabs

    function changeIdx(index)
    {
        tabs.activeIdx = index
        console.log(tabs.activeIdx)
    }
</script>

<ul class="flex flex-wrap">
    {#each tabs.members as tab, i}
        <li class="mr-2">
            {#if i == tabs.activeIdx}
                <button class="inline-block text-gray-400 rounded-t-lg border-b-2 border-blue-600 active" on:click={() => changeIdx(i)}>{tab.label}</button>
            {:else}
                <button class="inline-block rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" on:click={() => changeIdx(i)}>{tab.label}</button>
            {/if}
        </li>
    {/each}
</ul>

<style>

</style>