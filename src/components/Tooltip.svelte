<script lang="ts">
    export let label: string = "This is a tooltip (use 'label' to replace this)"
    export let disabled: boolean = false
    let visible: boolean
    let parent: HTMLDivElement
</script>

<div class="flex flex-col w-full items-center {$$restProps.class || ''}" on:pointerenter={() => visible = true} on:pointerleave={() => visible = false} bind:this={parent}>
    {#if visible && !disabled}
    <svg width="24" height="24" style="position: absolute;" viewBox="0 0 500 500" class="mt-3.5">
        <polygon points="250,60 100,400 400,400" fill="#ED9E14" />
    </svg>
    <div style="position: absolute; top: {parent.offsetTop}; z-index: 999; white-space: pre-wrap" class="bg-amber-500 rounded px-2 py-1 mt-8">
        {label}
    </div>
    {/if}
    <slot/>
</div>