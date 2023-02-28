<script lang="ts">
    import { densityAndSignalData, interpolationMode } from '../lib/stores'
    import APlot from '../components/APlot.svelte';
    import CPlot from '../components/CPlot.svelte';
    import BPlot from '../components/BPlot.svelte';
    import DPlot from '../components/DPlot.svelte';
    import { onMount } from 'svelte';
    import Spinner from '../components/Spinner.svelte';
    
    export let projectHandler
    export let utDefResultParser

    let interpolationOn = false
    let interpolationLevel = 1
    let status = "Loading"
    let rectification

    onMount(() => {
        utDefResultParser.Parse(projectHandler.currentProject.data.postprocessor).then(v => {

            if (Object.keys(v).length != 0) {
                densityAndSignalData.set(v)
                status = "Ok"
            } else {
                densityAndSignalData.update(n => n)
                status = "Invalid"
            }
        })
    })

    function changeInterpolation() {
        if (interpolationLevel == 1 && interpolationOn) {
            interpolationMode.set(['fast'])
        } else if (interpolationLevel == 2 && interpolationOn) {
            interpolationMode.set(['best'])
        } else {
            interpolationMode.set([false])
        }
    }
</script>

<div id="postprocessor-tab">
    <div class="flex flex-row shadow-lg rounded-lg px-2 mt-2 bg-stone-300 w-full h-24" style="z-index: 99; position: relative">
        <div class="flex flex-col w-24 pt-1 -space-y-1">
            <div class="flex flex-row w-full items-center">
                <div class="flex flex-col mx-1" style="font-size:10px; color:#4d4d4d;">
                    <input id="default-checkbox" type="checkbox" bind:checked={interpolationOn} class="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" on:change={changeInterpolation}>
                </div>
                <div class="flex flex-col mx-1" style="font-size:10px; color:#4d4d4d;">
                    Interpolate
                </div>
            </div>
            <div class="flex flex-row w-full items-center">
                <div class="flex flex-col w-1/12 ml-1 mr-4" style="font-size:10px; color:#4d4d4d;">
                    Fast
                </div>
                <div class="flex flex-col w-10/12">
                    <input name="interpSlider" type="range" bind:value={interpolationLevel} min="1" max="2" class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" on:change={changeInterpolation}>
                </div>
                <div class="flex flex-col w-1/12 mx-1" style="font-size:10px; color:#4d4d4d;">
                    Best
                </div>
            </div>
            <div class="flex flex-row w-full justify-center mt-auto pt-7">
                <div class="flex flex-row select-none" style="font-size:10px; color:#4d4d4d;">
                Data
                </div>
            </div>
        </div>
        <div class="flex flex-col line-vert my-2 mx-4"/>
        <div class="flex flex-col w-24 pt-1 -space-y-1">
            <select bind:value={rectification} class="flex flex-row mb-auto mt-1 rounded bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-md">
                <option value=1>Unrectified</option>
                <option value=2>Fullwave</option>
                <option value=3>Halfwave+</option>
                <option value=4>Halfwave-</option>
            </select>
            <div class="flex flex-row w-full justify-center mt-auto">
                <div class="flex flex-row select-none mt-auto" style="font-size:10px; color:#4d4d4d;">
                Rectification
                </div>
            </div>
        </div>
    </div>
    <!-- Interaction Panel -->

    <div class="w-full grid grid-cols-2 gap-2 mt-2" style="z-index: 99; height: calc(100vh - 206px);">
        <div class="rounded-md bg-stone-300 flex-col" style="z-index: 99;">
            {#if status == "Loading"}
            <Spinner/>
            {:else if status == "Invalid"}
            <div class="flex flex-col w-full h-full items-center justify-center">
                <div class="flex flex-row" style="font-family:'Material Icons'; font-size:128px; color:#4d4d4d;">
                    dangerous
                </div>
            </div>
            {:else if status == "Ok"}
            <CPlot/>
            {/if}
        </div>
        <div class="rounded-md bg-stone-300" style="z-index: 99;">
            {#if status == "Loading"}
            <Spinner/>
            {:else if status == "Invalid"}
            <div class="flex flex-col w-full h-full items-center justify-center">
                <div class="flex flex-row" style="font-family:'Material Icons'; font-size:128px; color:#4d4d4d;">
                    dangerous
                </div>
            </div>
            {:else if status == "Ok"}
            <APlot bind:rectification={rectification}/>
            {/if}
        </div>
        <div class="rounded-md bg-stone-300 flex-col" style="z-index: 99; max-height: calc(50vh - 101px);">
            {#if status == "Loading"}
            <Spinner/>
            {:else if status == "Invalid"}
            <div class="flex flex-col w-full h-full items-center justify-center">
                <div class="flex flex-row" style="font-family:'Material Icons'; font-size:128px; color:#4d4d4d;">
                    dangerous
                </div>
            </div>
            {:else if status == "Ok"}
            <BPlot/>
            {/if}
        </div>
        <div class="rounded-md bg-stone-300" style="z-index: 99;">
            {#if status == "Loading"}
            <Spinner/>
            {:else if status == "Invalid"}
            <div class="flex flex-col w-full h-full items-center justify-center">
                <div class="flex flex-row" style="font-family:'Material Icons'; font-size:128px; color:#4d4d4d;">
                    dangerous
                </div>
            </div>
            {:else if status == "Ok"}
            <DPlot/>
            {/if}
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