<script lang="ts">
    import { onDestroy, tick } from 'svelte';
    import { LoggingSingleton } from '../lib/data/LoggingSingleton';
    import type { LoggingEntry } from '../lib/models/Logging';
    import Button from './Button.svelte';

    let loggingSingleton: LoggingSingleton = LoggingSingleton.GetInstance()
    let minimized: boolean = false
    let logs: Array<LoggingEntry> = []
    let log: HTMLDivElement

    function updateMinState() {
        if (minimized == true) {
            minimized = false
        } else {
            minimized = true
        } 
    }

    let copyButton = {
        label: "",
        color: "#4d4d4d",
        icon: "content_copy",
        action: () => {},
        disabled: false
    }

    let minButton = {
        label: "",
        color: "#4d4d4d",
        icon: "expand_less",
        action: updateMinState,
        disabled: false
    }

    let maxButton = {
        label: "",
        color: "#4d4d4d",
        icon: "expand_more",
        action: updateMinState,
        disabled: false
    }

    let unsubscribe = loggingSingleton.Subscribe(async (v: LoggingEntry[]) => {
        logs = v
        await tick()
        scrollToBottom(log)
    });

    onDestroy(() => {
        unsubscribe()
    })

    const scrollToBottom = async (node: any) => {
        node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
    }; 
</script>

<div class="flex flex-col bg-stone-300 rounded-lg shadow-lg" style="z-index: 4;">
    <div class="flex px-2 pt-1" style="color:#4d4d4d">
        <div class="flex flex-col">
            Output ({logs.length})
        </div>
        <div class="flex flex-col ml-auto">
            <Button data={copyButton}/>
        </div>
        <div class="flex flex-col ml-2">
            {#if minimized}
            <Button data={minButton}/>
            {:else}
            <Button data={maxButton}/>
            {/if}
        </div>
    </div>
    {#if minimized == false}
    <!--<div class="bg-gradient-to-r from-yellow-600 ... h-0.5"></div>-->
    <div bind:this={log} class="max-h-48 border border-stone-400 rounded-md m-2 h-48" style="padding-left: 0px; overflow: auto">
        {#each logs as item}
            <div class="inline-block px-1">
                <div class="inline item-icon align-middle " style="color:{item['color']}">
                    {item['icon']}
                </div>
                <div class="inline item-text pl-1 font-bold whitespace-nowrap">
                    [{new Date().toLocaleString()}]:
                </div>
                <div class="inline item-text">
                    {item['message']}
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
    ::-webkit-scrollbar {
        width: 14px;
        height: 14px;
    }
  ::-webkit-scrollbar-track {
        background: rgb(168, 162, 158);
        border-radius: 10px;
    }
  ::-webkit-scrollbar-thumb {
        background: #4d4d4d;
        border-radius: 10px;
    }
</style>