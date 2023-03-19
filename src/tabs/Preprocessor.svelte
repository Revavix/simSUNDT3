<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { onMount } from 'svelte';
    import { UTDefectIsoSaver } from "../lib/utDefIsoSaver";
    import TreeComponent from '../components/Tree.svelte'
    import Button from '../components/Button.svelte'
    import HorizontalProgressbarComponent from '../components/HorizontalProgressbar.svelte'
    import OutputLogComponent from '../components/OutputLog.svelte'
    import { constructParametricData, tree } from '../lib/tree.js'
    import { constructIsoSaveData } from "../lib/utDefSaverUtils";

    export let unsaved
    export let utDefRunner
    export let projectHandler
    export let utDefResultParser

    let mainLogContents = []
    let parametricEnabled = false
    let treeMinimized = false
    let showConfigureModal = false
    let utDefRunnerIsRunning = false

    utDefRunner.statusMessage.subscribe(value => {
        if (value.hasOwnProperty("message") && value.hasOwnProperty("icon") && value.hasOwnProperty("color")) {
            mainLogContents.push(value)

            // Force update variable to trigger svelte reactivity...
            mainLogContents = mainLogContents
        }
    })

    utDefRunner.running.subscribe(value => {
        utDefRunnerIsRunning = value
    })

    // Simulate section buttons
    let runButton = {
        label: "Run",
        color: "#55b13c",
        icon: "play_arrow",
        action: async () => {
            // Clean up old runs
            const homeDir = await window.electronAPI.getHomeDir()
            await window.electronAPI.rmDir(homeDir + "/Documents/simSUNDT/tmp")

            // Prep default Isometric data in the saver
            const saver = new UTDefectIsoSaver()
            saver.data = constructIsoSaveData(projectHandler.currentProject.data.preprocessor.tree, 
                        projectHandler.currentProject.data.preprocessor.misc)

            if (parametricEnabled) {
                // Save the base run (i.e. when all parameters are default)
                await window.electronAPI.mkdir(homeDir + "/Documents/simSUNDT/tmp_1")
                await saver.Save(homeDir + "/Documents/simSUNDT/tmp_1/utdefdat")

                let runs = constructParametricData(projectHandler.currentProject.data.preprocessor.tree, 
                    projectHandler.currentProject.data.preprocessor.misc)

                console.log(runs)
                

            } else {
                try {
                    // Make a single /tmp folder in the simSUNDT folder to store temp data as well as the binary file
                    await window.electronAPI.mkdir(homeDir + "/Documents/simSUNDT/tmp")

                    const saved = await saver.Save(homeDir + "/Documents/simSUNDT/tmp/utdefdat")

                    if (!saved) {
                        return
                    }

                    const run = await utDefRunner.Run(projectHandler.currentProject.data.preprocessor.misc.binaryPath)

                    if (!run) {
                        return
                    }
                    
                    projectHandler.currentProject.data.postprocessor = await utDefResultParser.Extract(homeDir + "/Documents/simSUNDT/tmp")
                    unsaved = true
                } catch (err) {
                    mainLogContents.push({icon: "warning", message: "Saver failed, verify that a valid project file has been loaded, or create a new project to resolve the issue", color: "#4d4d4d"})
                    mainLogContents = mainLogContents
                    return
                }
            }
        },
        disabled: false
    }

    let stopButton = {
        label: "Stop",
        color: "#ba3822",
        icon: "stop",
        action: async () => {
            utDefRunner.Stop()
        },
        disabled: false
    }

    let configureButton = {
        label: "Configure",
        color: "#807a7a",
        icon: "settings",
        action: async () => {
            showConfigureModal == false ? showConfigureModal = true : showConfigureModal = false
        },
        disabled: false
    }

    // Tree buttons
    let treeMinButton = {
        label: "",
        color: "#4d4d4d",
        icon: "expand_more",
        action:  () => {treeMinimized = false},
        disabled: false
    }

    let treeMaxButton = {
        label: "",
        color: "#4d4d4d",
        icon: "expand_less",
        action:  () => {treeMinimized = true},
        disabled: false
    }

    // Configure modal buttons
    let closeConfigureModalButton = {
        label: "",
        color: "#807a7a",
        icon: "close",
        action:  () => {showConfigureModal = false},
        disabled: false
    }

    // Progress Bar vars and store subscribes
    let progress: number = 0
    let maxProgress: number = 100

    utDefRunner.runProgress.subscribe(value => {
        progress = value
    })

    utDefRunner.maxRunProgress.subscribe(value => {
        maxProgress = value
    })

    // Get default path (OS dependant) to UTDefect
    let defaultPath: string
    
    async function UpdateDefaultBinaryPath() {
        defaultPath = await window.electronAPI.getDefaultBinaryPath()
    }

    function handleTreeMessage(ev) {
        if (ev.detail.type == "Save") {
            unsaved = true
        }
    }

    onMount(async () => {
        const homeDir = await window.electronAPI.getHomeDir()

        //let test = new UTDefResultParser()
        //test.Parse(homeDir + "/Documents/simSUNDT/tmp")
    })

    UpdateDefaultBinaryPath()

    // Variable watchers
    $: projectHandler.currentProject.data.preprocessor.misc.binaryPath, projectHandler.currentProject.data.preprocessor.misc.binaryPath === '' ? runButton.disabled = true : runButton.disabled = false 
</script>

<div id="preprocessor-tab" class="flex flex-col w-full h-full">
    <div class="flex flex-row shadow-lg rounded-lg px-2 mt-2 bg-stone-300 w-full h-24" style="z-index: 4; overflow-x: auto; overflow-y: hidden;">
        <div class="flex flex-col w-20 pt-1 -space-y-1">
            <div class="flex flex-col mb-auto">
                {#if !utDefRunnerIsRunning}
                <Button data={runButton}></Button>
                {:else}
                <Button data={stopButton}></Button>
                {/if}
                <Button data={configureButton}></Button>
            </div>
            <div class="flex flex-row w-full justify-center mt-auto pt-2">
                <div class="flex flex-row select-none" style="font-size:10px; color:#4d4d4d;">
                Simulate
                </div>
            </div>
        </div>
        <div class="flex flex-col line-vert my-2 mx-2"/>
        <div class="flex flex-col w-20 pt-1 -space-y-1">
            <select bind:value={projectHandler.currentProject.data.preprocessor.misc.accuracy} class="pl-1 mb-auto bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:opacity-75" required on:change={() => unsaved = true}> 
                <option value=5>Highest</option>
                <option value=4>High</option>
                <option value=3>Medium</option>
                <option value=2>Low</option>
                <option value=1>Lowest</option>
            </select>
            <div class="flex flex-row w-full justify-center mt-auto pt-4">
                <div class="flex flex-row select-none" style="font-size:10px; color:#4d4d4d;">
                Accuracy
                </div>
            </div>
        </div>
        <div class="flex flex-col line-vert my-2 mx-2"/>
        <div class="flex flex-col w-20 pt-1 -space-y-1">
            <div class="flex flex-row mb-auto items-center">
                <input bind:checked={parametricEnabled} type="checkbox" class="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                <div class="px-2" style="font-size:12px; color:#4d4d4d;">Enabled</div>
            </div>
            <div class="flex flex-row w-full justify-center mt-auto pt-2">
                <div class="flex flex-row select-none" style="font-size:10px; color:#4d4d4d;">
                Parametric
                </div>
            </div>
        </div>
    </div>
    <div class="flex flex-col tree-view">
        <div class="flex flex-col shadow-lg rounded-lg px-2 mt-2 bg-stone-300 min-w-96 min-w-sm w-full sm:w-9/12 md:w-6/12 xl:w-4/12 2xl:w-3/12 2xl:max-w-lg mb-4 opacity-90 hover:opacity-100" style="z-index: 4; position:relative; overflow: auto;">
            <div class="flex flex-row">
                <div class="flex flex-col">
                    <p class="pt-1" style="color:#4d4d4d">Parameterisation</p>
                </div>
                <div class="flex flex-col ml-auto">
                    {#if treeMinimized}
                    <Button data={treeMinButton}/>
                    {:else}
                    <Button data={treeMaxButton}/>
                    {/if}
                </div>
            </div>
            {#if !treeMinimized}
            <div class="h-full rounded-md my-1 mb-2 w-full px-2" style="overflow: auto;">
                <TreeComponent tree={tree} data={projectHandler.currentProject.data.preprocessor.tree} pad={false} bind:parametricEnabled={parametricEnabled} on:message={handleTreeMessage}></TreeComponent>
            </div>
            {/if}
        </div>
    </div>
    <!--<div class="absolute-bottom-above pb-4 px-6 w-6/12 opacity-90 hover:opacity-100">
        <OutputLogComponent bind:contents={mainLogContents}/>
        <div class="py-1"/>
        <HorizontalProgressbarComponent bind:progress={progress} bind:maxValue={maxProgress}/>
    </div>-->

    {#if showConfigureModal}
    <div class="absolute-bg bg-stone-600 opacity-75"/>
    <div class="absolute-above-center w-6/12 h-6/12">
        <div class="relative w-full h-full md:h-auto">
            <div class="relative rounded-lg shadow bg-stone-200">
                <div class="flex items-start justify-between p-3 rounded-t">
                    <h3 class="text-md font-semibold text-gray-600">
                        Configuration
                    </h3>
                    <div class="bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                        <Button data={closeConfigureModalButton}/>
                    </div>
                </div>
                <div class="p-3 space-y-2">
                    <div>
                        <label for="runner_path" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style="color:#4d4d4d;">Binary path</label>
                        <input bind:value={projectHandler.currentProject.data.preprocessor.misc.binaryPath} type="text" id="runner_path" class="bg-stone-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Eg: {defaultPath}" required on:change={() => unsaved = true}/>
                    </div>
                </div>
                <div class="p-3 space-y-2">
                    <div>
                        <label for="cloud_endpoint" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style="color:#4d4d4d;">Cloud Endpoint</label>
                        <input disabled type="text" id="cloud_endpoint" class="bg-stone-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Not implemented" required>
                    </div>
                </div>
            </div>
        </div>
    </div>
    {/if}
</div>

<style>
  .absolute-bottom-above
  {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    z-index: 4;
  }
  .absolute-above-center
  {
    position: absolute;
    top: 35%;
    bottom: 65%;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    z-index: 50;
  }
  .absolute-bg 
  {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
  }
  .tree-view
  {
    max-height: calc(100vh - 178px);
  }
  .line-vert {
    border-left: 1px solid #7f7f7f;
  }
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
