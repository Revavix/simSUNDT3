<script lang="ts">
    export let data

    function exec()
    {
        data.action()
    }

    function hoverColor() {
        if (data.hasOwnproperty("hoverColor")) {
            return "#d6d3d1"
        } else {
            return "#000000"
        }
    }

    let brightnessClass: string = ''

    $: data.disabled, data.disabled ? brightnessClass = 'lower-opacity' : brightnessClass = ''

</script>

<button class="flex flex-row w-full hover:{hoverColor} hover:rounded-sm {brightnessClass}" on:click={exec} disabled={data.disabled}>
    <div class="flex flex-col" style="font-family:'Material Icons'; font-size:{data.size}px; color:{data.color}">
        {data.icon}
    </div>
    {#if data.label != ""}
    <div class="flex flex-col pl-2" style="font-size:11px; color:#4d4d4d;">
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