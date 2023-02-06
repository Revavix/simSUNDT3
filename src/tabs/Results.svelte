<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { onMount } from 'svelte';
    import DensityPlot from '../components/DensityPlot.svelte';
    import LinePlot from '../components/LinePlot.svelte';
    import PlotModebar from '../components/PlotModebar.svelte';
    
    let dispatch = createEventDispatcher()

    onMount(() => {
        dispatch('message', {
            origin: "Generic",
            type: "UnhideViewport"
        })
    })

    let interpolationLevel = 0

    // Avoid modifying these, they are used by the PlotModebar, and defined in the respective plot components
    let aScanPlot
    let bScanPlot
    let cScanPlot
    let dScanPlot

    let data = [
        [0, 0, 1],
        [0, 1, 4],
        [1, 1, 4],
        [1, 0, 6]
    ]

    let ascanData = [
        [0, 1],
        [1, 1.5],
        [2, -3]
    ]
</script>

<div id="postprocessor-tab">
    <div class="flex flex-row shadow-lg rounded-lg px-2 mt-2 bg-stone-300 w-full h-24" style="z-index: 99; position: relative">
        <div class="flex flex-col w-24 pt-1 -space-y-1">
            <div class="flex flex-row w-full items-center">
                <div class="flex flex-col mx-1" style="font-size:10px; color:#4d4d4d;">
                    <input id="default-checkbox" type="checkbox" value="" class="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                </div>
                <div class="flex flex-col mx-1" style="font-size:10px; color:#4d4d4d;">
                    Interpolate
                </div>
            </div>
            <div class="flex flex-row w-full items-center">
                <div class="flex flex-col w-1/12 mx-1" style="font-size:10px; color:#4d4d4d;">
                    1
                </div>
                <div class="flex flex-col w-10/12">
                    <input name="interpSlider" type="range" bind:value={interpolationLevel} min="1" max="5" class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer">
                </div>
                <div class="flex flex-col w-1/12 mx-1" style="font-size:10px; color:#4d4d4d;">
                    5
                </div>
            </div>
            <div class="flex flex-row w-full justify-center mt-auto pt-7">
                <div class="flex flex-row select-none" style="font-size:10px; color:#4d4d4d;">
                Data
                </div>
            </div>
        </div>
        <div class="flex flex-col line-vert my-2 mx-2"/>
        <div class="flex flex-col w-24 pt-1 -space-y-1">
            <div class="flex flex-row w-full justify-center mt-auto">
                <div class="flex flex-row select-none" style="font-size:10px; color:#4d4d4d;">
                Rectification
                </div>
            </div>
        </div>
    </div>
    <!-- Interaction Panel -->

    <div class="w-full grid grid-cols-2 gap-2 mt-2" style="z-index: 99; height: calc(100vh - 202px);">
        <div class="rounded-md bg-stone-300 flex-col" style="z-index: 99; max-height: calc(50vh - 101px);">
            <div class="flex flex-row">
                <div class="flex flex-col">
                    <p class="pt-1 px-2" style="color:#4d4d4d">C-Scan</p>
                </div>
                <div class="flex flex-col ml-auto mr-2">
                    <PlotModebar bind:plot={cScanPlot}/>
                </div>
            </div>
            <div class="flex flex-row h-full" style="max-height: calc(100% - 28px);">
                <DensityPlot bind:plot={cScanPlot} bind:rawData={data} />
            </div>
        </div>
        <div class="rounded-md bg-stone-300" style="z-index: 99;">
            <div class="flex flex-row">
                <div class="flex flex-col">
                    <p class="pt-1 px-2" style="color:#4d4d4d">A-Scan</p>
                </div>
                <div class="flex flex-col ml-auto mr-2">
                    <PlotModebar bind:plot={aScanPlot}/>
                </div>
            </div>
            <div class="flex flex-row h-full" style="max-height: calc(100% - 28px);">
                <LinePlot bind:plot={aScanPlot} bind:rawData={ascanData}/>
            </div>
        </div>
        <div class="rounded-md bg-stone-300 flex-col" style="z-index: 99; max-height: calc(50vh - 101px);">
            <div class="flex flex-row">
                <div class="flex flex-col">
                    <p class="pt-1 px-2" style="color:#4d4d4d">B-Scan</p>
                </div>
                <div class="flex flex-col ml-auto mr-2">
                    <PlotModebar bind:plot={bScanPlot}/>
                </div>
            </div>
            <div class="flex flex-row h-full" style="max-height: calc(100% - 28px);">
                <DensityPlot bind:plot={bScanPlot}/>
            </div>
        </div>
        <div class="rounded-md bg-stone-300" style="z-index: 99;">
            <div class="flex flex-row">
                <div class="flex flex-col">
                    <p class="pt-1 px-2" style="color:#4d4d4d">D-Scan</p>
                </div>
                <div class="flex flex-col ml-auto mr-2">
                    <PlotModebar bind:plot={dScanPlot}/>
                </div>
            </div>
            <div class="flex flex-row h-full" style="max-height: calc(100% - 28px);">
                <DensityPlot bind:plot={dScanPlot}/>
            </div>
        </div>
    </div>
</div>

<style>
  .absolute-under {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      height: 100%;
      width: 100%;
      overflow: hidden;
      z-index: 1;
  }
  .line-vert {
    border-left: 1px solid #7f7f7f;
  }
</style>