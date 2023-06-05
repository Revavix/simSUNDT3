<script>
    import { utDefProgress } from '../lib/stores';
    import Button from './Button.svelte';

    let progress = 0
    let minimized = false

    utDefProgress.subscribe(v => {
        try {
            progress = v[0].progress;
        } catch (e) {
            
        }
    })

    function updateMinState() {
        if (minimized == true) {
            minimized = false
        } else {
            minimized = true
        } 
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
</script>

<div class="flex flex-col bg-stone-300 rounded-lg shadow-lg w-full h-full" style="z-index: 4;">
    <div class="flex px-2 pt-1" style="color:#4d4d4d">
        <div class="flex flex-col">
            Progress (Non-parametric)
        </div>
        <div class="flex flex-col ml-auto">
            {#if minimized}
            <Button data={minButton}/>
            {:else}
            <Button data={maxButton}/>
            {/if}
        </div>
    </div>
    {#if minimized == false}
    <div class="flex flex-col my-auto w-full pt-1"> 
        <div class="w-full h-4 mb-4 rounded-full px-2">
            <div class="bg-gray-400 rounded-full">
                <div class="h-4 {progress < 1 ? 'bg-orange-300' : 'bg-green-400'} rounded-full text-xs text-center" style="color:#4d4d4d; width: {progress * 100}%">
                    {#if progress > 0.1}
                    {Math.round(progress * 100)}%
                    {/if}
                </div>
            </div>
        </div>
    </div>
    {/if}
</div>

<style>
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