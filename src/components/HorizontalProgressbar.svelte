<script lang="ts">
    import { spring } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing'

    export let progress: number = 0;
    export let maxValue: number = 100;
    let progressColor = 'bg-yellow-600'

    let progressSpring = spring(0, {
        stiffness: 0.1,
        damping: 0.5
    });

    function updateProgress() {
        if ((progress/maxValue) <= 1 && progress != 0) {
            progressSpring.set(progress/maxValue)
        } else {
            console.log("[HorizontalProgressbar] The progress value exceeds maxValue, forcing = 1")
        }

        if (progress/maxValue == 1) {
            console.log("Progress is " + progress + " and maxprogress is " + maxValue)
            progressColor = 'bg-green-600'
        }

        if (progress == 0) {
            new Promise(async () => {
                await new Promise(r => setTimeout(r, 3000)).then(() => {
                    progressColor = 'bg-yellow-600'
                    progressSpring.set(0)
                })
            });
        }
    }
    $: progress, updateProgress()
</script>

<div class="w-full bg-gray-200 rounded-full dark:bg-gray-700 shadow-lg">
    <div class="{progressColor} text-xs font-medium text-blue-100 text-center leading-none rounded-full" style="width: {$progressSpring * 100}%; transition: width 1s; min-height:15px"> 
        {#if progress/maxValue <= 1 && progress/maxValue > 0.2}
            <div class="p-0.5">
                {Math.round(progress/maxValue * 100)}%
            </div>
        {/if}
    </div>
</div>

<style>

</style>