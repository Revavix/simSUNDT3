<script>
    import { utDefParametricProgress } from '../lib/stores';

    let minimized

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
        }
    ]

    utDefParametricProgress.subscribe(v => {
        runs = v
    })

    /*
{
    folder: m,
    date: date.toLocaleDateString("en-US"),
    time: date.toLocaleTimeString("en-US"),
    processId: null,
    finished: false
}
*/
</script>

<div class="flex flex-col bg-stone-300 class:h-40={minimized === true} rounded-lg shadow-lg" style="z-index: 4;">
    <div class="flex px-2 pt-1" style="color:#4d4d4d">
        <div class="flex flex-col">
            Progress (Parametric)
        </div>
    </div>
    <div class="grid grid-cols-4 max-h-32 rounded-md m-2 h-36" style="padding-left: 0px; overflow: auto"> 
        {#each runs as r, i}
        <div class="flex flex-col items-center">
            <div class="flex flex-row" style="font-size:12px; color:#4d4d4d;"> 
                Run {i+1}
            </div>
            <div class="flex flex-col flex-nowrap justify-end w-4 h-12 bg-gray-200 rounded-md overflow-hidden dark:bg-gray-700">
                {#if r.progress == 1}
                <div class="bg-green-400 overflow-hidden" role="progressbar" style="height: {Math.round(r.progress * 100)}%"></div>
                {:else}
                <div class="bg-orange-300 overflow-hidden" role="progressbar" style="height: {Math.round(r.progress * 100)}%"></div>
                {/if}
            </div>
            <div class="flex flex-row" style="font-size:10px; color:#4d4d4d;"> 
                {(r.progress * 100).toFixed(1)}
            </div>
        </div>
        {/each}
    </div>
</div>

<style>
  ::-webkit-scrollbar {
    width: 14px;
    height: 14px;
  }
  ::-webkit-scrollbar-track {
      background: rgb(168, 162, 158);
      border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: #4d4d4d;
    border-radius: 10px;
  }
</style>