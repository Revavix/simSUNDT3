<script>
    export let text
    export let color
    export let icon
</script>

<div class="flex flex-col">
    <div class="flex flex-row bg-stone-600 border-t-4 rounded-sm items-center" style="border-color:{color}">
        <div class="flex flex-col pl-2" style="font-family:'Material Icons'; font-size:24px; color:{color}">
            {icon}
        </div>
        <div class="flex flex-col px-2 my-2">
            <p>{text}</p>
        </div>
    </div>
</div>

<style>

</style>