<script lang="ts">
    import { slide } from "svelte/transition";

    export let icon: string | undefined = undefined
    export let ribbonClass: string | undefined = undefined
    export let isOpen: boolean = false
</script>

<!-- ExpandLeftButton {isOpen ? 'rounded-none' : ''} -->
<button class="flex flex-row w-full h-full" on:click={() => isOpen = !isOpen}>
    <div class="flex flex-col w-6 bg-primary py-2 {ribbonClass || ''} text-base-content" style="font-family:'Material Icons'; font-size:24px;">
        {#if isOpen}
            chevron_right
        {/if}
        {#if !isOpen}
            chevron_left
        {/if}
    </div>
    <div class="flex flex-col w-full py-2 text-base-content" style="font-family:'Material Icons'; font-size:36px;">
        {icon}
    </div>
    {#if isOpen}
    <div class="flex flex-col bg-base-100 rounded-tl rounded-bl rounded-br" style="z-index: 50; position: fixed; transform: translateX(-100%)" transition:slide={{duration: 200, axis: 'x'}}>
        <slot/>
    </div>
    {/if}
</button>