<script lang="ts">
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing'

    export let progress: number = 0;
    export let maxValue: number = 100;

    let progressTween = tweened(0, {
        duration: 40,
        easing: cubicOut
    });

    $: if (progress) {
        if ((progress/maxValue) <= 1) {
            progressTween.set(progress/maxValue)
        } else {
            console.log("[HorizontalProgressbar] The progress value exceeds maxValue, forcing = 1")
        }
    }
</script>

<div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
    <div class="bg-yellow-600 text-xs font-medium text-blue-100 text-center leading-none rounded-full" style="width: {$progressTween * 100}%; transition: width 2s; min-height:15px"> 
        {#if progress/maxValue <= 1 && progress/maxValue > 0.1}
            <div class="p-0.5">
                {progress}%
            </div>
        {/if}
    </div>
</div>

<style>

</style>