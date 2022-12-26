<script lang="ts">
    export let btn

    function exec()
    {
        btn.action()
    }

    let brightnessClass: string = ''

    $: btn.disabled, btn.disabled ? brightnessClass = 'lower-opacity' : brightnessClass = ''

</script>

<button class="flex flex-row w-full hover:bg-gray-300 hover:rounded-sm {brightnessClass}" on:click={exec} disabled={btn.disabled}>
    <div class="flex flex-col" style="font-family:'Material Icons'; font-size:16px; color:{btn.color}">
        {btn.icon}
    </div>
    {#if btn.label != ""}
    <div class="flex flex-col pl-2" style="font-size:11px; color:#4d4d4d;">
        {btn.label}
    </div>
    {/if}
</button>

<style>
.lower-opacity 
{
    opacity: 30%;
}
</style>