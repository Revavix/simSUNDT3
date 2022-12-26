<script lang="ts">
    import { Button } from '../lib/buttonDef'
    import ButtonComponent from './Button.svelte';
    import type { OutputLogItem } from '../lib/outputLogDef'

    export let contents: Array<object>
    let minimized: boolean = false

    function updateMinState() {
        console.log(minimized)

        if (minimized == true) {
            minimized = false
        } else {
            minimized = true
        } 
    }
</script>

<div class="flex flex-col bg-stone-300 class:h-40={minimized === true} rounded-lg shadow-lg" style="z-index: 4;">
    <div class="flex px-2 pt-1" style="color:#4d4d4d">
        <div class="flex flex-col">
            Output ({contents.length})
        </div>
        <div class="flex flex-col ml-auto">
            <ButtonComponent btn={new Button("", "#4d4d4d", "content_copy", null)}/>
        </div>
        <div class="flex flex-col ml-2">
            {#if minimized}
            <ButtonComponent btn={new Button("", "#4d4d4d", "expand_less", updateMinState)}/>
            {:else}
            <ButtonComponent btn={new Button("", "#4d4d4d", "expand_more", updateMinState)}/>
            {/if}
        </div>
    </div>
    {#if minimized == false}
    <!--<div class="bg-gradient-to-r from-yellow-600 ... h-0.5"></div>-->
    <div class="max-h-32 border border-stone-400 rounded-md m-2 h-32 min-h-full" style="padding-left: 0px; overflow: auto">
        {#each contents as item}
            <div class="flex">
                <div class="flex flex-col item-icon" style="color:{item['color']}">
                    {item['icon']}
                </div>
                <div class="flex flex-row item-text pl-1 ">
                    <div class="flex flex-col font-bold whitespace-nowrap">
                        [{new Date().toLocaleString()}]:
                    </div>
                    <div class="flex flex-col item-text pl-2">
                        {item['message']}
                    </div>
                </div>
            </div>
        {/each}
    </div>
    {/if}
</div>

<style>
    .item-icon
    {
        font-family:'Material Icons'; 
        font-size:16px;
    }
    .item-text
    {
        font-size: 14px;
        color:#4d4d4d
    }
    div::-webkit-scrollbar {
        display: none;
    }
</style>