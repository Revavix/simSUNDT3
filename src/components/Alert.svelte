<script lang="ts">
    import { onMount } from "svelte";

    export let text: string
    export let color: string
    export let icon: string
    export let duration: number | null = null
    let timeLeft: number | null = duration

    onMount(() => {
        if (duration) {
            const interval = setInterval(() => {
                if (timeLeft === null) {
                    clearInterval(interval)
                    return
                }

                timeLeft = timeLeft - 0.1
                if (timeLeft <= 0) {
                    clearInterval(interval)
                }
            }, 100)
        }
    })
</script>

<div class="flex flex-col">
    <div class="flex flex-row bg-stone-600 border-t-4 rounded-sm items-center" style="border-color:{color}">
        <div class="flex flex-col pl-2" style="font-family:'Material Icons'; font-size:24px; color:{color}">
            {icon}
        </div>
        <div class="flex flex-col px-2 my-2">
            <p>{text}</p>
        </div>
        {#if duration}
        <!-- Countdown circle -->
        <div class="flex flex-col ml-auto mr-2">
            <div class="flex flex-col rounded-full bg-stone-400 w-6 h-6 items-center justify-center">
                <p class="text-xs">
                    {timeLeft?.toFixed(0)}
                </p>
            </div>
        </div>
        {/if}
    </div>
</div>

<style>

</style>