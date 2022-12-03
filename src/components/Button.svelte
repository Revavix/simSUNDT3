<script lang="ts">
    import { Button } from "../lib/buttonDef";
    export let btn

    function exec()
    {
        btn.action()
    }
</script>

<button class="flex flex-row w-full hover:bg-gray-300 hover:rounded-sm" on:click={exec}>
    <div class="flex flex-col" style="font-family:'Material Icons'; font-size:16px; color:#55b13c">
        {btn.icon}
    </div>
    <div class="flex flex-col pl-2" style="font-size:11px; color:#4d4d4d;">
        {btn.label}
    </div>
</button>

<style>

</style>