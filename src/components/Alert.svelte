<script>
    export let text
</script>

<div class="flex flex-col">
    <div class="flex flex-row bg-stone-600 border-t-4 border-red-500 rounded-sm items-center">
        <div class="flex flex-col pl-2" style="font-family:'Material Icons'; font-size:24px; color:#ef4444">
            warning
        </div>
        <div class="flex flex-col px-2 my-2">
            <p>{text}</p>
        </div>
    </div>
</div>

<style>

</style>