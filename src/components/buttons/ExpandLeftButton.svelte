<script lang="ts">
    import { slide } from "svelte/transition";

    export let icon: string | undefined = undefined
    export let ribbonClass: string | undefined = undefined
    export let isOpen: boolean = false
</script>

<!-- ExpandLeftButton {isOpen ? 'rounded-none' : ''} -->
<button class="flex flex-row w-full h-full" on:click={() => isOpen = !isOpen}>
    <div class="flex flex-col w-6 bg-gray-400 py-2 {ribbonClass || ''}" style="font-family:'Material Icons'; font-size:24px; color:#4d4d4d">
        {#if isOpen}
            chevron_right
        {/if}
        {#if !isOpen}
            chevron_left
        {/if}
    </div>
    <div class="flex flex-col w-full py-2" style="font-family:'Material Icons'; font-size:36px; color:#4d4d4d">
        {icon}
    </div>
    {#if isOpen}
    <div class="flex flex-col bg-stone-300 rounded-tl rounded-bl rounded-br" style="z-index: 50; position: fixed; transform: translateX(-100%)" transition:slide={{duration: 200, axis: 'x'}}>
        <slot/>
    </div>
    {/if}
</button>