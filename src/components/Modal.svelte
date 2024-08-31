<script lang="ts">
    import Button from "./Button.svelte";

    export let label: string = "Modal"
    export let description: string | null = null
    export let isOpen: boolean = false
    export let width: 4 | 6 | 8 | 10 | 12 = 6
    export let height: 4 | 6 | 8 | 10 | 12 = 6
</script>

{#if isOpen}
<div class="main-bg-div bg-stone-600 opacity-75"/>

<div class="main-container-div w-{width}/12 h-{height}/12">
    <div class="relative w-full h-full md:h-auto">
        <div class="relative rounded-lg shadow bg-base-100">
            <div class="flex items-start justify-between p-3 rounded-t">
                <div class="flex flex-col items-start">
                    <h3 class="flex flex-row text-md font-semibold text-base-content">
                        {label}
                    </h3>
                    {#if description}
                    <h1 class="flex flex-row text-xs text-base-content">
                        {description}
                    </h1>
                    {/if}
                </div>
                <div class="bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                    <Button data={{icon: "close", color: "#807a7a", action:  () => {isOpen = false}}}/>
                </div>
            </div>
            <slot/>
        </div>
    </div>
</div>
{/if}

<style>
    .main-bg-div
    {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 50;
    }
    .main-container-div
    {
        position: absolute;
        top: 35%;
        bottom: 65%;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        z-index: 50;
    }
    h3 {
        font-size: 18px
    }
</style>