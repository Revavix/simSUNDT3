<script lang="ts">
    import APlot from '../components/APlot.svelte';
    import CPlot from '../components/CPlot.svelte';
    import BPlot from '../components/BPlot.svelte';
    import DPlot from '../components/DPlot.svelte';
    import { onMount } from 'svelte';
    import Spinner from '../components/Spinner.svelte';
    import { interpolationMode, resultData } from '../lib/data/Stores';
    
    export let projectHandler
    export let kernelResultParser

    let interpolationOn = false
    let interpolationLevel = 1
    let status = "Invalid"
    let rectification
    let selectedTest = 0
    let selectedTestSubIndex = 0

    onMount(() => {
        updateGraphsWithSelected()
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

    async function updateGraphsWithSelected() {
        if (projectHandler.currentProject.data.postprocessor.length == 0) {
            return
        }

        status = "Loading"

        const folder = projectHandler.currentProject.data.postprocessor[selectedTest].runs[selectedTestSubIndex].path
        const extractedData = await kernelResultParser.Extract(folder)

        kernelResultParser.Parse(extractedData).then(v => {
            if (Object.keys(v).length != 0) {
                resultData.set(v)
                status = "Ok"
            } else {
                resultData.update(n => n)
                status = "Invalid"
            }
        })
    }

    const handleInspect = () => {
        const folder = projectHandler.currentProject.data.postprocessor[selectedTest].runs[selectedTestSubIndex].path
        window.electronAPI.inspect(folder + "/utIndefa")
    }
</script>

<div id="postprocessor-tab">
    <div class="flex flex-row shadow-lg rounded-lg px-2 mt-2 bg-stone-300 w-full h-26" style="z-index: 99; position: relative">
        <div class="flex flex-col w-60 pt-2">
            <div class="flex flex-row w-full items-center">
                <div class="flex flex-col w-full">
                    <select bind:value={selectedTest} on:change={updateGraphsWithSelected} class="flex flex-row mb-auto py-0.5 rounded bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-md w-full">
                        {#each projectHandler.currentProject.data.postprocessor as data, i}
                            <option value="{i}">{data.name} ({data.date} - {data.time})</option>
                        {/each}
                    </select>
                </div>
                <div class="flex flex-col w-4/12">
                    <select bind:value={selectedTestSubIndex} on:change={updateGraphsWithSelected} class="flex flex-row mb-auto py-0.5 rounded bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-md w-full">
                        {#if projectHandler.currentProject.data.postprocessor.length > 0}
                            {#each projectHandler.currentProject.data.postprocessor[selectedTest].runs as data, i}
                                <option value="{i}">{i}</option>
                            {/each}
                        {/if}
                    </select>
                </div>
                <div class="flex flex-col pl-1">
                    <button type="button" class="text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full text-sm px-2" style="font-size:10px" on:click={handleInspect}>Inspect</button>
                </div>
            </div>
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
                <div class="flex flex-col w-10/12 pb-auto">
                    <input name="interpSlider" type="range" bind:value={interpolationLevel} min="1" max="2" class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-amber-500" on:change={changeInterpolation}>
                </div>
                <div class="flex flex-col w-1/12 mx-1" style="font-size:10px; color:#4d4d4d;">
                    Best
                </div>
            </div>
            <div class="flex flex-row w-full justify-center h-full">
                <div class="flex flex-row select-none mt-auto" style="font-size:10px; color:#4d4d4d;">
                Data
                </div>
            </div>
        </div>
        <div class="flex flex-col line-vert my-2 mx-4"/>
        <div class="flex flex-col w-24 pt-2 -space-y-1">
            <select bind:value={rectification} class="flex flex-row mb-auto py-0.5 rounded bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-md">
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
            <CPlot bind:rectification={rectification}/>
            {/if}
        </div>
        <div class="rounded-md bg-stone-300 px-2" style="z-index: 99;">
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
        <div class="rounded-md bg-stone-300 flex-col px-2" style="z-index: 99; max-height: calc(50vh - 101px);">
            {#if status == "Loading"}
            <Spinner/>
            {:else if status == "Invalid"}
            <div class="flex flex-col w-full h-full items-center justify-center">
                <div class="flex flex-row" style="font-family:'Material Icons'; font-size:128px; color:#4d4d4d;">
                    dangerous
                </div>
            </div>
            {:else if status == "Ok"}
            <BPlot bind:rectification={rectification}/>
            {/if}
        </div>
        <div class="rounded-md bg-stone-300 px-2" style="z-index: 99;">
            {#if status == "Loading"}
            <Spinner/>
            {:else if status == "Invalid"}
            <div class="flex flex-col w-full h-full items-center justify-center">
                <div class="flex flex-row" style="font-family:'Material Icons'; font-size:128px; color:#4d4d4d;">
                    dangerous
                </div>
            </div>
            {:else if status == "Ok"}
            <DPlot bind:rectification={rectification}/>
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