<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { onMount } from 'svelte';

    // TypeScript class definition imports
    import { Button } from '../lib/buttonDef'
    
    // TypeScript class data definition imports
    import { treeMethod, treeTransmitter, treeReceiver, treeDefect } from '../lib/treeData'
    import { UTDefectIsoTreeBinder } from '../lib/utDefectIsoTreeBinder'
    import { UTDefectIsoSaver } from '../lib/utDefectIsoSaver'
    import { UTDefectRunner } from '../lib/utDefectRunner';
    import { TreeUtil } from '../lib/treeUtil'
    import { MiscParameterisation } from '../lib/miscParameterisationDef'

    // Component imports
    import TreeComponent from '../components/Tree.svelte'
    import ButtonComponent from '../components/Button.svelte'
    import HorizontalProgressbarComponent from '../components/HorizontalProgressbar.svelte'
    import OutputLogComponent from '../components/OutputLog.svelte'

    // Used in all tab components to pass properties (supresses dev console warning)
    export let properties

    let dispatch = createEventDispatcher()

    onMount(() => {
        dispatch('message', {
            origin: "Generic",
            type: "UnhideViewport"
        })
    })

    // Set up output log
    let mainLogContents: Array<object> = new Array<object>()

    // Set up some tree settings
    let treeMinimized: boolean = false
    let showConfigureModal: boolean = false

    // Misc variables not defined in tree to be forwarded to tree binder
    let miscParameters: MiscParameterisation = new MiscParameterisation("5")

    // UTDefectIsoSaver & variable binding setup
    let utDefSaver: UTDefectIsoSaver = new UTDefectIsoSaver()
    let utDefTreeBinder: UTDefectIsoTreeBinder = new UTDefectIsoTreeBinder(utDefSaver, treeMethod, treeTransmitter, treeReceiver, treeDefect, miscParameters)
    let utDefRunner: UTDefectRunner = new UTDefectRunner("", true, false)

    // utDefRunner to log subscription
    utDefRunner.statusMessage.subscribe(value => {
        mainLogContents.push(value)

        // Force update variable to trigger svelte reactivity...
        mainLogContents = mainLogContents
    })

    // utDefRunner running status
    let utDefRunnerIsRunning: boolean = false
    utDefRunner.running.subscribe(value => {
        utDefRunnerIsRunning = value
    })

    // Simulate section buttons
    let runButton: Button = new Button("Run", "#55b13c", "play_arrow", async () => {
        utDefTreeBinder.Update()
        utDefSaver.Save()
        utDefRunner.Run()
    })
    let stopButton: Button = new Button("Stop", "#ba3822", "stop", async () => {
        utDefRunner.Stop()
    })
    let cloudRunButton: Button = new Button("Cloud", "#55b13c", "cloud_sync", () => {
        alert('test')
    })
    let configureRunButton: Button = new Button("Configure", "#807a7a", "settings", () => {
        showConfigureModal == false ? showConfigureModal = true : showConfigureModal = false
    })

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

    UpdateDefaultBinaryPath()

    // Variable watchers
    $: utDefRunner.sourceBinaryPath, utDefRunner.sourceBinaryPath === '' ? runButton.disabled = true : runButton.disabled = false
</script>

<div id="preprocessor-tab" class="flex flex-col w-full h-full">
    <div class="flex flex-row shadow-lg rounded-lg px-2 mt-2 bg-stone-300 w-full h-24" style="z-index: 4;">
        <div class="flex flex-col w-20 pt-1 -space-y-1">
            {#if !utDefRunnerIsRunning}
            <ButtonComponent btn={runButton}></ButtonComponent>
            {:else}
            <ButtonComponent btn={stopButton}></ButtonComponent>
            {/if}
            <ButtonComponent btn={cloudRunButton}></ButtonComponent>
            <ButtonComponent btn={configureRunButton}></ButtonComponent>
            <div class="flex flex-row w-full justify-center mt-auto pt-2">
                <div class="flex flex-row select-none" style="font-size:10px; color:#4d4d4d;">
                Simulate
                </div>
            </div>
        </div>
        <div class="flex flex-col line-vert my-2 mx-2"/>
        <div class="flex flex-col w-20 pt-1 -space-y-1">
            <select bind:value={miscParameters.accuracy} class="pl-1 mb-auto bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:opacity-75" required> 
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
    </div>
    <div class="flex flex-row tree-view">
        <div class="flex flex-col shadow-lg rounded-lg px-2 mt-2 bg-stone-300 w-3/12 mb-4 opacity-90 hover:opacity-100" style="z-index: 4; position:relative;">
            <div class="flex flex-row">
                <div class="flex flex-col">
                    <p class="pt-1" style="color:#4d4d4d">Parameterisation</p>
                </div>
                <div class="flex flex-col ml-auto">
                    {#if treeMinimized}
                    <ButtonComponent btn={new Button("", "#4d4d4d", "expand_more", () => {treeMinimized = false})}/>
                    {:else}
                    <ButtonComponent btn={new Button("", "#4d4d4d", "expand_less", () => {treeMinimized = true})}/>
                    {/if}
                </div>
            </div>
            {#if !treeMinimized}
            <div class="h-full rounded-md my-1 mb-2" style="overflow: auto;">
                <TreeComponent tree={treeMethod}/>
                <TreeComponent tree={treeTransmitter}/>
                <TreeComponent tree={treeReceiver}/>
                <TreeComponent tree={treeDefect}/>
            </div>
            {/if}
        </div>
    </div>
    <div class="absolute-bottom-above pb-4 px-6 w-6/12 opacity-90 hover:opacity-100">
        <OutputLogComponent bind:contents={mainLogContents}/>
        <div class="py-1"/>
        <HorizontalProgressbarComponent bind:progress={progress} bind:maxValue={maxProgress}/>
    </div>

    {#if showConfigureModal}
    <div class="absolute-bg bg-stone-600 opacity-75"/>
    <div class="absolute-above-center w-6/12 h-6/12">
        <div class="relative w-full h-full md:h-auto">
            <div class="relative rounded-lg shadow bg-stone-200">
                <div class="flex items-start justify-between p-3 rounded-t bg-gradient-to-r from-stone-300 to-stone-200">
                    <h3 class="text-md font-semibold text-gray-600">
                        Runner Configuration
                    </h3>
                    <div class="bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                        <ButtonComponent btn={new Button("", "#807a7a", "close", () => {showConfigureModal = false})}></ButtonComponent>
                    </div>
                </div>
                <div class="p-3 space-y-2">
                    <div>
                        <label for="runner_path" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style="color:#4d4d4d;">Path to UTDefect binary</label>
                        <input bind:value={utDefRunner.sourceBinaryPath} type="text" id="runner_path" class="bg-stone-300 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Eg: {defaultPath}" required>
                    </div>
                    <div>
                        <label class="inline-flex relative items-center cursor-pointer">
                            <input bind:checked={utDefRunner.stdMode} type="checkbox" value="" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span class="ml-3 text-sm font-medium" style="color:#4d4d4d;">Standard Output Mode</span>
                        </label>
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
    max-height: calc(100vh - 158px);
  }
  .line-vert {
    border-left: 1px solid #7f7f7f;
  }
  div::-webkit-scrollbar {
    display: none;
  }
</style>
