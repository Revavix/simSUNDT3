<script lang="ts">
    export let btn

    function exec()
    {
        btn.action()
    }
</script>

<button class="flex flex-row w-full hover:bg-gray-300 hover:rounded-sm" on:click={exec}>
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

</style>