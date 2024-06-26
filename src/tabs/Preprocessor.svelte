<script lang="ts">
    import { KernelSaver as KernelSaverUTDef6 } from "../lib/kernel/utdefect/KernelSaver";
    import TreeComponent from '../components/Tree.svelte'
    import Button from '../components/Button.svelte'
    import Log from '../components/Log.svelte'
    import { KernelInitializer as KernelInitializerV6 } from "../lib/kernel/utdefect/KernelInitializer"
    import ParametricProgressOverview from "../components/ParametricProgressOverview.svelte";
    import ParametricSettings from "../components/ParametricSettings.svelte";
    import NonParametricProgressOverview from "../components/NonParametricProgressOverview.svelte";
    import { kernelProgress } from "../lib/data/Stores";
    import { Initializer, InitializerMode, Runner, type InitializerExecutionResult, type Progress } from "../lib/models/Kernel";
    import { LoggingSingleton } from "../lib/data/LoggingSingleton";
    import { LoggingLevel } from "../lib/models/Logging";
    import { BaseDirectory } from "@tauri-apps/api/path";
    import { createDir, writeTextFile } from "@tauri-apps/api/fs";
    import { ProjectSingleton } from "../lib/data/ProjectSingleton";
    import { Validator } from "../lib/validation/Validator";
    import { onMount } from "svelte";
    import type { IValidator } from "../lib/models/validation/Validator";
    import { Serialize } from "../lib/tree/Utils";
    import type TreeNode from "../lib/models/tree/TreeNode";
    import PresetProbesModal from "../components/modals/PresetProbesModal.svelte";
    import { bind } from "lodash";

    export let unsaved
    export let kernelRunner: Runner
 
    let projectSingleton: ProjectSingleton = ProjectSingleton.GetInstance()
    let loggingSingleton: LoggingSingleton = LoggingSingleton.GetInstance()
    let kernelInitializer: Initializer | null = null
    let kernelValidator: IValidator | null = null

    let parametricEnabled = false
    let treeMinimized = false
    let showConfigureModal = false
    let showParametricSettingsModal = false
    let showPresetProbesModal = false
    let namingSchemeMethod = 1
    let namingSchemeName = ""

    onMount(() => {
        kernelInitializer = new KernelInitializerV6()
        kernelValidator = new Validator()
    })

    // Simulate section buttons
    let runButton = {
        label: "Run",
        color: "#55b13c",
        icon: "play_arrow",
        action: async () => {
            if (kernelInitializer === null) {
                loggingSingleton.Log(LoggingLevel.WARNING, "Kernel initializer is null, cannot run simulation.")
                return
            }

            // Clean up old runs
            await createDir("simSUNDT/Simulations", { dir: BaseDirectory.Document, recursive: true})

            // Prep default Isometric data in the saver
            const saver = new KernelSaverUTDef6()
            saver.rootNode = projectSingleton.Tree

            // Run name
            const name = namingSchemeMethod == 1 ? crypto.randomUUID() : namingSchemeName

            // Configure the runner and clear it
            kernelRunner.processes = projectSingleton.ProcessCount
            kernelRunner.runs = []

            // Configure the initializer
            kernelInitializer.sidecarName = projectSingleton.BinaryPath
            kernelInitializer.mode = parametricEnabled ? InitializerMode.PARAMETRIC : InitializerMode.NON_PARAMETRIC
            kernelInitializer.runner = kernelRunner
            kernelInitializer.saver = saver
            kernelInitializer.Execute(name).then((v) => {
                if (typeof v === 'string') {
                    loggingSingleton.Log(LoggingLevel.WARNING, "Simulation completed, but an unexpected value was returned, the value '" + v + "'")
                    return
                }
                
                let groupedResult: any = {
                    name: name,
                    timestamp: v?.timestamp,
                    runs: []
                }

                v?.runs?.forEach(element => {
                    groupedResult.runs.push({
                        path: element.path
                    })

                    // Write a preprocessor.sscache file to each of the runs folders
                    writeTextFile(element.path + "/tree.sscache", JSON.stringify(Serialize(projectSingleton.Tree ?? {} as TreeNode))).catch((e) => {
                        loggingSingleton.Log(LoggingLevel.WARNING, "Failed to write preprocessor.sscache file to " + element.path + " importing back information from the run may not be possible.")
                    })
                });

                projectSingleton.PushPostprocessorData(groupedResult)

                if (projectSingleton.Path !== null) {
                    projectSingleton.Save(projectSingleton.Path).then((v: any) => {
                        loggingSingleton.Log(LoggingLevel.INFO, "Runner completed successfully & project auto-saved\
                            post run completion.")
                    }).catch((e) => {
                        loggingSingleton.Log(LoggingLevel.INFO, "Runner completed successfully but failed to auto-\
                            save, please save manually to ensure results are not lost.")
                    })
                } else {
                    loggingSingleton.Log(LoggingLevel.WARNING, "Runner completed, but project was not auto-saved since the project has not been manually saved yet.\
                         Please save manually to ensure results are not lost.")
                }
            }).catch(v => {
                loggingSingleton.Log(LoggingLevel.WARNING, v)
            })
        },
        disabled: false
    }

    let stopButton = {
        label: "Stop",
        color: "#ba3822",
        icon: "stop",
        action: async () => {
            kernelRunner.Stop()
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

    let parametricSettingsButton = {
        label: "Settings",
        color: "#807a7a",
        icon: "tune",
        action: async () => {
            showParametricSettingsModal = true
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

    // Preset buttons
    let materialPresetButton = {
        label: "Materials",
        color: "#4d4d4d",
        icon: "inventory_2",
        action: async () => {
            
        },
        disabled: true
    }
    let probePresetButton = {
        label: "Probes",
        color: "#4d4d4d",
        icon: "settings_remote",
        action: () => {
            showPresetProbesModal = true
        },
        disabled: false
    }
</script>

<div id="preprocessor-tab" class="flex flex-col w-full h-full">
    <div class="flex flex-row shadow-lg rounded-lg px-2 mt-2 bg-stone-300 w-full h-24" style="z-index: 4; overflow-x: auto; overflow-y: hidden;">
        <div class="flex flex-col w-20 pt-1 -space-y-1">
            <div class="flex flex-col mb-auto">
                {#if $kernelProgress?.find((v) => !v?.finished) === undefined || $kernelProgress === undefined}
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
            <select bind:value={projectSingleton.Accuracy} class="pl-1 mb-auto bg-gray-50 border-2 border-transparent text-gray-900 text-xs rounded-md focus:border-amber-500 focus:outline-none focus:ring-0 disabled:opacity-75" required on:change={() => unsaved = true}> 
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
            <div class="flex flex-col mb-auto">
                <div class="flex flex-row items-center">
                    <input bind:checked={parametricEnabled} type="checkbox" class="w-3 h-3 text-amber-500 bg-gray-100 border-2 border-transparent rounded focus:border-amber-500 focus:outline-none focus:ring-0">
                    <div class="px-2" style="font-size:12px; color:#4d4d4d;">Enabled</div>
                </div>
                <div class="flex flex-row">
                    <Button data={parametricSettingsButton}/>
                </div>
            </div>
            <div class="flex flex-row w-full justify-center mt-auto">
                <div class="flex flex-row select-none" style="font-size:10px; color:#4d4d4d;">
                Parametric
                </div>
            </div>
        </div>
        <div class="flex flex-col line-vert my-2 mx-2"/>
        <!-- 3D settings -->
        <div class="flex flex-col w-40 pt-1 h-full -space-y-1">
            <div class="flex flex-row w-full">
                <!-- Checkbox to show axes -->
                <div class="flex flex-col">
                    <div class="flex flex-row items-center">
                        <input bind:checked={projectSingleton.Misc.viewport.showAxes} type="checkbox" class="w-3 h-3 text-amber-500 bg-gray-100 border-2 border-transparent rounded focus:border-amber-500 focus:outline-none focus:ring-0" on:change={() => projectSingleton.ForceRefresh()}>
                        <div class="px-2" style="font-size:12px; color:#4d4d4d;">Axes</div>
                    </div>
                </div>
                <!-- Checkbox to show origin -->
                <div class="flex flex-col">
                    <div class="flex flex-row items-center">
                        <input bind:checked={projectSingleton.Misc.viewport.showOrigin} type="checkbox" class="w-3 h-3 text-amber-500 bg-gray-100 border-2 border-transparent rounded focus:border-amber-500 focus:outline-none focus:ring-0" on:change={() => projectSingleton.ForceRefresh()}>
                        <div class="px-2" style="font-size:12px; color:#4d4d4d;">Origin</div>
                    </div>
                </div>
            </div>
            <!-- Checkbox to show grid -->
            <div class="flex flex-row w-full">
                <div class="flex flex-row items-center">
                    <input bind:checked={projectSingleton.Misc.viewport.showGrid} type="checkbox" class="w-3 h-3 text-amber-500 bg-gray-100 border-2 border-transparent rounded focus:border-amber-500 focus:outline-none focus:ring-0" on:change={() => projectSingleton.ForceRefresh()}>
                    <div class="px-2" style="font-size:12px; color:#4d4d4d;">Grid</div>
                </div>
            </div>
            <!-- 3D View Footer -->
            <div class="flex flex-row w-full justify-center pt-7">
                <div class="flex flex-row select-none" style="font-size:10px; color:#4d4d4d;">
                3D View
                </div>
            </div>
        </div>
        <div class="flex flex-col line-vert my-2 mx-2"/>
        <!-- Presets -->
        <div class="flex flex-col w-20 pt-1 h-full -space-y-1">
            <div class="flex flex-col mb-auto">
                <Button data={materialPresetButton}></Button>
            </div>
            <div class="flex flex-col mb-auto">
                <Button data={probePresetButton}></Button>
            </div>
            <div class="flex flex-row w-full justify-center pt-7">
                <div class="flex flex-row select-none" style="font-size:10px; color:#4d4d4d;">
                Presets
                </div>
            </div>
        </div>
    </div>
    <div class="flex flex-col tree-view">
        <div class="flex flex-col shadow-lg rounded-lg px-2 mt-2 bg-stone-300 min-w-96 min-w-sm w-full sm:w-9/12 md:w-6/12 xl:w-4/12 2xl:w-3/12 2xl:max-w-lg mb-4 opacity-90 hover:opacity-100" style="z-index: 4; position:relative; overflow: auto;">
            <div class="flex flex-row">
                <div class="flex flex-col">
                    <p class="pt-1" style="color:#4d4d4d">Parameterisation {parametricEnabled == true ? "(Parametric)" : "(Non-parametric)"}</p>
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
                {#if projectSingleton.Tree !== null}
                <TreeComponent node={projectSingleton.Tree} bind:kernelValidator={kernelValidator} bind:parametricEnabled={parametricEnabled}></TreeComponent>
                {/if}
            </div>
            {/if}
        </div>
    </div>
    <div class="absolute-bottom-above pb-4 px-4 w-full opacity-90 hover:opacity-100">
        <div class="flex flex-row w-full items-end">
            <div class="flex flex-col w-1/2 pr-1">
                <Log bind:kernelValidator={kernelValidator}/>
            </div>
            <div class="flex flex-col w-1/2 pl-1">
                {#if parametricEnabled}
                <ParametricProgressOverview/>
                {:else}
                <NonParametricProgressOverview/>
                {/if}
            </div>
        </div>
    </div>

    {#if showConfigureModal}
    <div class="absolute-bg bg-stone-600 opacity-75"/>
        <div class="absolute-above-center w-6/12 h-6/12">
            <div class="relative w-full h-full md:h-auto">
                <div class="relative rounded-lg shadow bg-stone-200">
                    <div class="flex items-start justify-between p-3 rounded-t">
                        <div class="flex flex-col items-start">
                            <h3 class="flex flex-row text-md font-semibold text-gray-600">
                                Configuration
                            </h3>
                            <h1 class="flex flex-row text-xs text-gray-600">
                                Simulation options
                            </h1>
                        </div>
                        <div class="bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                            <Button data={closeConfigureModalButton}/>
                        </div>
                    </div>
                    <div class="px-3 mt-2 space-y-2">
                        <div>
                            <label for="runner_path" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style="color:#4d4d4d;">Kernel version</label>
                            <select class="bg-gray-50 text-gray-900 text-sm rounded-lg p-2 w-full focus:outline-none focus:ring-0" bind:value={projectSingleton.BinaryPath}>
                                <option value="binaries/v6/UTDef6">UTDefect - Version 6</option>
                                <option value="binaries/light/UTDefectLight">UTDefect - Light</option>
                            </select>
                        </div>
                    </div>
                    <div class="px-3 py-2 space-y-2">
                        <div class="flex flex-col">
                            <div class="flex flex-col">
                                <div class="flex flex-row mb-1 text-sm font-medium text-gray-900 dark:text-white" style="color:#4d4d4d;">Run naming scheme</div>
                                <div class="flex flex-col w-full" id="naming_scheme_group">
                                    <div class="flex flex-row w-full items-center">
                                        <input id="algo_naming" type="radio" bind:group={namingSchemeMethod} name="naming_scheme" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" value={1}>
                                        <label for="algo_naming" class="ml-2 text-sm font-medium text-gray-900">Algorithmic naming</label>
                                    </div>
                                    <div class="flex flex-row w-full items-center">
                                        <input id="custom_naming" type="radio" bind:group={namingSchemeMethod} name="naming_scheme" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" value={2}>
                                        <label for="custom_naming" class="ml-2 text-sm font-medium text-gray-900">Specified naming</label>
                                    </div>
                                    <div class="flex flex-row w-full items-center mt-1">
                                        <input bind:value={namingSchemeName} disabled={namingSchemeMethod == 2 ? false : true} type="text" id="custom_run_name_textbox" class="bg-stone-300 border-2 text-gray-900 text-sm rounded-lg 0 block w-full p-2.5 focus:border-amber-500 focus:outline-none focus:ring-0" placeholder="My_Custom_Run" required>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <ParametricSettings bind:isModalOpen={showParametricSettingsModal} bind:numProcesses={projectSingleton.ProcessCount}/>
    <PresetProbesModal bind:isOpen={showPresetProbesModal}/>
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
    max-height: calc(100vh - 410px);
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
  ::-webkit-scrollbar-corner { 
    background: rgba(0,0,0,0.0); 
  }
</style>
