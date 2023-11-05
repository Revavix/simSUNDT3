<script lang="ts">
    import type { Button } from "../lib/models/Button";

    export let data: Button

    function exec()
    {
        data.action()
    }

    let brightnessClass: string = ''

    $: data.disabled, data.disabled ? brightnessClass = 'lower-opacity' : brightnessClass = ''

</script>

<button class="flex flex-row w-full hover:{data.hoverColor} hover:rounded-sm {brightnessClass}" on:click={exec} disabled={data.disabled}>
    <div class="flex flex-col" style="font-family:'Material Icons'; font-size:{data.size}px; color:{data.color}">
        {data.icon}
    </div>
    {#if data.label !== undefined}
    <div class="flex flex-col pl-2" style="font-size:10px; color:#4d4d4d;">
        {data.label}
    </div>
    {/if}
</button>

<style>
.lower-opacity 
{
    opacity: 30%;
}
</style>