<script lang="ts">
    import APlot from '../components/plots/APlot.svelte';
    import CPlot from '../components/plots/CPlot.svelte';
    import BPlot from '../components/plots/BPlot.svelte';
    import DPlot from '../components/plots/DPlot.svelte';
    import { onMount } from 'svelte';
    import { loadedMetadata } from '../lib/data/Stores';
    import { ProjectSingleton } from '../lib/data/ProjectSingleton';
    import { Command } from '@tauri-apps/api/shell'
    import { invoke } from '@tauri-apps/api/tauri'
    import { Interpolation, Rectification, type Metadata } from '../lib/models/Result';
    import { Grayscale, Magma, Parula, Rainbow, UltraVision } from '../lib/plotting/Colorscales';
    
    export let projectSingleton: ProjectSingleton = ProjectSingleton.GetInstance()

    let interpolation: Interpolation = Interpolation.OFF
    let rectification: Rectification = Rectification.UNRECTIFIED
    let selectedTest: number = 0
    let selectedTestSubIndex: number = 0
    let largeDataSet: boolean = false
    let selectedColorscale = UltraVision

    onMount(() => {
        selectedTest = projectSingleton.Postprocessor.length - 1
        handleSubtestChange()
    })

    const handleSubtestChange = () => {
        if (projectSingleton.Postprocessor.length == 0) {
            return
        }

        invoke('commands_results_parse_metadata', { path: projectSingleton.Postprocessor[selectedTest].runs[selectedTestSubIndex].path + "\\utIndefa.txt" }).then((v: any) => {
            let metadata = v as Metadata
            metadata.path = projectSingleton.Postprocessor[selectedTest].runs[selectedTestSubIndex].path
            loadedMetadata.set(metadata)

            // Check if large dataset
            let columns = (Math.abs(metadata.coordinates.x.end) + Math.abs(metadata.coordinates.x.start)) / metadata.coordinates.x.increment
            let rows = (Math.abs(metadata.coordinates.y.end) + Math.abs(metadata.coordinates.y.start)) / metadata.coordinates.y.increment
            largeDataSet = columns * rows > 6400 ? true : false
        }).catch((e) => {
            console.error(e)
            // TODO: Add error feedback
        })
    }

    const handleInspect = () => {
        const folder = projectSingleton.Postprocessor[selectedTest].runs[selectedTestSubIndex].path
        let cmd = new Command("notepad", folder + "/utIndefa")
        cmd.execute()
    }
</script>

<div id="postprocessor-tab">
    <div class="flex flex-row shadow-lg rounded-lg px-2 mt-2 bg-stone-300 w-full h-24" style="z-index: 99; position: relative">
        <div class="flex flex-col w-60 pt-2">
            <div class="flex flex-row w-full items-center">
                <div class="flex flex-col w-full">
                    <select bind:value={selectedTest} on:change={handleSubtestChange} class="flex flex-row mb-auto py-0.5 rounded bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-md w-full">
                        {#each projectSingleton.Postprocessor as data, i}
                            <option value="{i}">{data.name} ({data.timestamp?.toLocaleString()})</option>
                        {/each}
                    </select>
                </div>
                <div class="flex flex-col w-4/12">
                    <select bind:value={selectedTestSubIndex} on:change={handleSubtestChange} class="flex flex-row mb-auto py-0.5 rounded bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-md w-full">
                        {#if projectSingleton.Postprocessor.length > 0}
                            {#each projectSingleton.Postprocessor[selectedTest].runs as data, i}
                                <option value="{i}">{i}</option>
                            {/each}
                        {/if}
                    </select>
                </div>
                <div class="flex flex-col pl-1">
                    <button type="button" class="text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full text-sm px-2" style="font-size:10px" on:click={handleInspect}>Inspect</button>
                </div>
            </div>
            <div class="flex flex-row w-full justify-center h-full">
                <div class="flex flex-row select-none mt-auto" style="font-size:10px; color:#4d4d4d;">
                Data
                </div>
            </div>
        </div>
        <div class="flex flex-col line-vert my-2 mx-4"/>
        <div class="flex flex-col w-40 pt-2 -space-y-1">
            <div class="flex flex-col w-full">
                <select bind:value={rectification} class="flex flex-col py-0.5 mb-1 rounded bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-md">
                    <option value={Rectification.UNRECTIFIED}>Unrectified</option>
                    <option value={Rectification.FULLWAVE}>Fullwave</option>
                    <option value={Rectification.HALFWAVE_POS}>Halfwave Positive</option>
                    <option value={Rectification.HALFWAVE_NEG}>Halfwave Negative</option>
                </select>
                <select bind:value={interpolation} class="flex flex-col py-0.5 rounded bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-md">
                    <option value={Interpolation.OFF}>No interpolation</option>
                    <option value={Interpolation.FAST}>Fast interpolation</option>
                    <option value={Interpolation.BEST}>Best interpolation</option>
                </select>
            </div>
            <div class="flex flex-col w-full h-full justify-end">
                <div class="flex flex-row select-none justify-center" style="font-size:10px; color:#4d4d4d;">
                    <div class="flex flex-row">
                    Post-processing
                    </div>
                    {#if largeDataSet}
                    <div class="flex flex-row pl-1" style="font-family:'Material Icons'; font-size:12px; color:#ef4444;">
                        warning
                    </div>
                    {/if}
                </div>
            </div>
        </div>
        <div class="flex flex-col line-vert my-2 mx-4"/>
        <div class="flex flex-col w-24 pt-2 -space-y-1">
            <!-- Colorscale select -->
            <div class="flex flex-col w-full">
                <select bind:value={selectedColorscale} class="flex flex-col py-0.5 mb-1 rounded bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-md">
                    <option value={UltraVision}>Ultravision</option>
                    <option value={Grayscale}>Grayscale</option>
                    <option value={Rainbow}>Rainbow</option>
                    <option value={Magma}>Magma</option>
                    <option value={Parula}>Parula</option>
                </select>
            </div>
            <!-- Colorscale footer -->
            <div class="flex flex-col w-full h-full justify-end">
                <div class="flex flex-row select-none justify-center" style="font-size:10px; color:#4d4d4d;">
                    <div class="flex flex-row">
                    Colorscale
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Interaction Panel -->

    <div class="w-full grid grid-cols-2 gap-2 mt-2" style="z-index: 99; height: calc(100vh - 190px);">
        <div class="rounded-md bg-stone-300 flex-col" style="z-index: 99;">
            <CPlot bind:interpolation={interpolation} 
                bind:colorscale={selectedColorscale}
                />
        </div>
        <div class="rounded-md bg-stone-300 flex-col px-2" style="z-index: 99;">
            <APlot bind:rectification={rectification}/>
        </div>
        <div class="rounded-md bg-stone-300 flex-col px-2 pb-2" style="z-index: 99;">
            <BPlot bind:rectification={rectification} 
                bind:interpolation={interpolation} 
                bind:colorscale={selectedColorscale}
            />
        </div>
        <div class="rounded-md bg-stone-300 px-2" style="z-index: 99;">
            <DPlot bind:rectification={rectification} 
                bind:interpolation={interpolation} 
                bind:colorscale={selectedColorscale}
            />
        </div>
    </div>
</div>

<style>
  .line-vert {
    border-left: 1px solid #7f7f7f;
  }
</style>