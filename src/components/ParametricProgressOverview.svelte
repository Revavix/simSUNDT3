<script lang="ts">
    import { kernelProgress } from '../lib/data/Stores';
    import type { Progress } from '../lib/models/Kernel';

    let minimized: boolean

    let runs = [
        {
            progress: 0,
            finished: false
        },
        {
            progress: 0,
            finished: false
        },
        {
            progress: 0,
            finished: false
        },
        {
            progress: 0,
            finished: false
        },
        {
            progress: 0,
            finished: false
        },
        {
            progress: 0,
            finished: false
        },
        {
            progress: 0,
            finished: false
        },
        {
            progress: 0,
            finished: false
        }
    ]

    kernelProgress.subscribe(v => {
        if (v === undefined) return
        
        runs = v
    })

    const getProgress = (p: Progress): number => {
        if (p !== undefined) {
            return p.progress
        }

        return 0
    }
</script>

<div class="flex flex-col bg-base-100 h-60 class:h-40={minimized === true} rounded-lg shadow-lg" style="z-index: 4;">
    <div class="flex px-2 pt-1 text-base-content">
        <div class="flex flex-col">
            Progress (Parametric)
        </div>
    </div>
    <div class="grid grid-cols-4 max-h-48 rounded-md m-2 h-48" style="padding-left: 0px; overflow: auto"> 
        {#each runs as r, i}
        <div class="flex flex-col items-center">
            <div class="flex flex-row text-base-content"> 
                Run {i+1}
            </div>
            <div class="flex flex-col flex-nowrap justify-end w-4 h-12 bg-gray-200 rounded-md overflow-hidden dark:bg-gray-700">
                {#if getProgress(r) === 1}
                <div class="bg-green-400 overflow-hidden" role="progressbar" style="height: {Math.round(getProgress(r) * 100)}%"></div>
                {:else}
                <div class="bg-orange-300 overflow-hidden" role="progressbar" style="height: {Math.round(getProgress(r) * 100)}%"></div>
                {/if}
            </div>
            <div class="flex flex-row text-base-content"> 
                {(getProgress(r) * 100).toFixed(1)}
            </div>
        </div>
        {/each}
    </div>
</div>