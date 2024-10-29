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
    import { Initializer, InitializerMode, Runner } from "../lib/models/Kernel";
    import { LoggingSingleton } from "../lib/data/LoggingSingleton";
    import { LoggingLevel } from "../lib/models/Logging";
    import { BaseDirectory } from "@tauri-apps/api/path";
    import { mkdir, writeTextFile } from "@tauri-apps/plugin-fs";
    import { ProjectSingleton } from "../lib/data/ProjectSingleton";
    import { Validator } from "../lib/validation/Validator";
    import { onMount } from "svelte";
    import type { IValidator } from "../lib/models/validation/Validator";
    import { Serialize } from "../lib/tree/Utils";
    import type TreeNode from "../lib/models/tree/TreeNode";
    import PresetProbesModal from "../components/modals/PresetProbesModal.svelte";
    import type { IEnforcer } from "../lib/models/validation/Enforcer";
    import { Enforcer } from "../lib/validation/Enforcer";
    import Quickbar from "../components/panels/3d/Quickbar.svelte";

    export let kernelRunner: Runner
 
    let projectSingleton: ProjectSingleton = ProjectSingleton.GetInstance()
    let loggingSingleton: LoggingSingleton = LoggingSingleton.GetInstance()
    let kernelInitializer: Initializer | null = null
    let kernelValidator: IValidator | null = null
    let kernelEnforcer: IEnforcer | null = null

    let parametricEnabled = false
    let treeMinimized = false
    let showConfigureModal = false
    let showParametricSettingsModal = false
    let showPresetProbesModal = false
    let namingSchemeMethod = 1
    let namingSchemeName = ""
    let namingSchemeValid: boolean = true

    onMount(() => {
        kernelInitializer = new KernelInitializerV6()
        kernelValidator = new Validator()
        kernelEnforcer = new Enforcer()
    })

    // Simulate section buttons
    async function runSimulation() {
        if (kernelInitializer === null) {
                loggingSingleton.Log(LoggingLevel.WARNING, "Kernel initializer is null, cannot run simulation.")
                return
            }

            // Clean up old runs
            await mkdir("simSUNDT/Simulations", { baseDir: BaseDirectory.Document, recursive: true})

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
    }

    async function stopSimulation() {
        kernelRunner.Stop()
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
</script>

<div id="preprocessor-tab" class="flex flex-col w-full h-full">
    <div class="flex flex-row shadow-lg rounded-lg px-2 mt-2 bg-base-100 w-full h-24" style="z-index: 4; overflow-x: auto; overflow-y: hidden;">
        <div class="flex flex-col w-26 pt-1 -space-y-1">
            <div class="flex flex-col mb-auto">
                {#if $kernelProgress?.find((v) => !v?.finished) === undefined || $kernelProgress === undefined}
                <button class="btn btn-xs btn-primary font-normal justify-start rounded-full" on:click={runSimulation}>
                    <div class="flex flex-col text-green-300" style="font-family:'Material Icons'; font-size:16px">
                        play_arrow
                    </div>
                    <span>Simulate</span>
                </button>
                {:else}
                <button class="btn btn-xs btn-primary font-normal justify-start rounded-full" on:click={stopSimulation}>
                    <div class="flex flex-col text-red-600" style="font-family:'Material Icons'; font-size:16px">
                        stop
                    </div>
                    <span>Stop</span>
                </button>
                {/if}
                <button class="btn btn-xs btn-primary font-normal mt-0.5 justify-start rounded-full" on:click={() => showConfigureModal == false ? showConfigureModal = true : showConfigureModal = false}>
                    <div class="flex flex-col text-secondary" style="font-family:'Material Icons'; font-size:16px">
                        settings
                    </div>
                    <span>Configure</span>
                </button>
            </div>
            <div class="flex flex-row w-full justify-center mt-auto pt-2">
                <div class="flex flex-row select-none text-base-content" style="font-size:10px;">
                Simulate
                </div>
            </div>
        </div>
        <div class="flex flex-col line-vert my-2 mx-2"/>
        <div class="flex flex-col w-24 pt-1 -space-y-1">
            <select bind:value={projectSingleton.Accuracy} class="select select-secondary select-xs w-full max-w-xs disabled:opacity-75 rounded-lg" required on:change={() => projectSingleton.ForceRefresh()}> 
                <option value=5>Highest</option>
                <option value=4>High</option>
                <option value=3>Medium</option>
                <option value=2>Low</option>
                <option value=1>Lowest</option>
            </select>
            <div class="flex flex-row w-full justify-center mt-auto pt-12">
                <div class="flex flex-row select-none text-base-content" style="font-size:10px;">
                Accuracy
                </div>
            </div>
        </div>
        <div class="flex flex-col line-vert my-2 mx-2"/>
        <div class="flex flex-col w-24 pt-1 -space-y-1 items-center">
            <div class="flex flex-col mb-auto">
                <div class="flex flex-row items-center">
                    <input bind:checked={parametricEnabled} type="checkbox" class="checkbox checkbox-xs checkbox-primary ml-2">
                    <div class="px-2 text-base-content" style="font-size:12px;">Enabled</div>
                </div>
                <div class="flex flex-row mt-0.5">
                    <button class="btn btn-xs btn-primary font-normal rounded-full" on:click={() => showParametricSettingsModal = !showParametricSettingsModal}>
                        <div class="flex flex-col text-secondary" style="font-family:'Material Icons'; font-size:16px">
                            tune
                        </div>
                        <span>Settings</span>
                    </button>
                </div>
            </div>
            <div class="flex flex-row w-full justify-center mt-auto">
                <div class="flex flex-row select-none text-base-content" style="font-size:10px;">
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
                        <input bind:checked={projectSingleton.Misc.viewport.showAxes} type="checkbox" class="checkbox checkbox-xs checkbox-primary" on:change={() => projectSingleton.ForceRefresh()}>
                        <div class="px-2 text-base-content" style="font-size:12px;">Axes</div>
                    </div>
                </div>
                <!-- Checkbox to show origin -->
                <div class="flex flex-col">
                    <div class="flex flex-row items-center">
                        <input bind:checked={projectSingleton.Misc.viewport.showOrigin} type="checkbox" class="checkbox checkbox-xs checkbox-primary" on:change={() => projectSingleton.ForceRefresh()}>
                        <div class="px-2 text-base-content" style="font-size:12px;">Origin</div>
                    </div>
                </div>
            </div>
            <!-- Checkbox to show grid -->
            <div class="flex flex-row w-full">
                <div class="flex flex-row items-center">
                    <input bind:checked={projectSingleton.Misc.viewport.showGrid} type="checkbox" class="checkbox checkbox-xs checkbox-primary" on:change={() => projectSingleton.ForceRefresh()}>
                    <div class="px-2 text-base-content" style="font-size:12px;">Grid</div>
                </div>
            </div>
            <!-- 3D View Footer -->
            <div class="flex flex-row w-full justify-center pt-7">
                <div class="flex flex-row select-none text-base-content" style="font-size:10px">
                3D View
                </div>
            </div>
        </div>
        <div class="flex flex-col line-vert my-2 mx-2"/>
        <!-- Presets -->
        <div class="flex flex-col w-24 pt-1 h-full -space-y-1">
            <button class="btn btn-xs btn-primary font-normal justify-start mb-1.5 rounded-full" on:click={() => {}} disabled={true}>
                <div class="flex flex-col text-secondary" style="font-family:'Material Icons'; font-size:16px">
                    inventory_2
                </div>
                <span>Materials</span>
            </button>
            <button class="btn btn-xs btn-primary font-normal justify-start rounded-full" on:click={() => showPresetProbesModal = !showPresetProbesModal}>
                <div class="flex flex-col text-secondary" style="font-family:'Material Icons'; font-size:16px">
                    settings_remote
                </div>
                <span>Probes</span>
            </button>
            <div class="flex flex-row w-full justify-center pt-[22px]">
                <div class="flex flex-row select-none text-base-content" style="font-size:10px;">
                Presets
                </div>
            </div>
        </div>
    </div>
    <div class="flex flex-row">
        <!-- Tree view -->
        <div 
            class="flex flex-col tree-view w-10/12 sm:w-9/12 md:w-6/12 xl:w-4/12 2xl:w-3/12 2xl:max-w-lg shadow-lg rounded-lg px-2 mt-2 bg-base-100 min-w-96 min-w-sm mb-4 opacity-90 hover:opacity-100" 
            style="z-index: 4; overflow: auto;"
        >
                <div class="flex flex-row">
                    <div class="flex flex-col">
                        <p class="pt-1 text-base-content">Parameterisation {parametricEnabled == true ? "(Parametric)" : "(Non-parametric)"}</p>
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
                    <TreeComponent node={projectSingleton.Tree} bind:kernelValidator={kernelValidator} bind:kernelEnforcer={kernelEnforcer} bind:parametricEnabled={parametricEnabled}></TreeComponent>
                    {/if}
                </div>
                {/if}
        </div>
        <!-- Quickbar -->
        <Quickbar class="ml-auto h-min quickbar"/>
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
                <div class="relative rounded-lg shadow bg-base-100">
                    <div class="flex items-start justify-between p-3 rounded-t">
                        <div class="flex flex-col items-start">
                            <h3 class="flex flex-row text-md font-semibold text-base-content">
                                Configuration
                            </h3>
                            <h1 class="flex flex-row text-xs text-base-content">
                                Simulation options
                            </h1>
                        </div>
                        <div class="bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                            <Button data={closeConfigureModalButton}/>
                        </div>
                    </div>
                    <div class="px-3 mt-2 space-y-2">
                        <div>
                            <label for="runner_path" class="block mb-2 text-sm font-medium text-base-content">Kernel version</label>
                            <select class="select select-secondary bg-secondary text-neutral select-xs w-full max-w-xs focus:outline-none rounded-lg" bind:value={projectSingleton.BinaryPath} on:change={() => projectSingleton.ForceRefresh()}>
                                <option value="binaries/v6/UTDef6">UTDefect - Version 6</option>
                                <option value="binaries/light/UTDefectLight">UTDefect - Light</option>
                            </select>
                        </div>
                    </div>
                    <div class="px-3 py-2 space-y-2">
                        <div class="flex flex-col">
                            <div class="flex flex-col">
                                <div class="flex flex-row mb-1 text-sm font-medium text-base-content cursor-default">Run naming scheme</div>
                                <div class="flex flex-col w-full" id="naming_scheme_group">
                                    <div class="flex flex-row w-full items-center">
                                        <input id="algo_naming" type="radio" bind:group={namingSchemeMethod} name="naming_scheme" class="radio radio-sm" value={1}>
                                        <label for="algo_naming" class="ml-2 text-sm font-medium text-base-content">Algorithmic naming</label>
                                    </div>
                                    <div class="flex flex-row w-full items-center pt-0.5">
                                        <input id="custom_naming" type="radio" bind:group={namingSchemeMethod} name="naming_scheme" class="radio radio-sm" value={2}>
                                        <label for="custom_naming" class="ml-2 text-sm font-medium text-base-content">Specified naming</label>
                                    </div>
                                    <div class="flex flex-row w-full items-center mt-1">
                                        <input bind:value={namingSchemeName} 
                                            on:input={() => {namingSchemeValid = /^[a-zA-Z0-9_\-]+$/.test(namingSchemeName) || namingSchemeName == ""}}
                                            disabled={namingSchemeMethod == 2 ? false : true} 
                                            type="text" 
                                            id="custom_run_name_textbox" 
                                            class="input input-sm bg-secondary focus:outline-none text-neutral {namingSchemeValid ? '' : 'border-2 border-error'}" 
                                            required>
                                    </div>
                                    {#if !namingSchemeValid}
                                    <div class="flex flex-row -mb-4">
                                        <p class="text-xs text-error">Invalid name specified, only A-Z, 0-9 and underscores are allowed</p>
                                    </div>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-row px-3 pt-6 pb-3">
                        <button class="btn btn-primary btn-sm font-normal rounded-lg" on:click={() => {showConfigureModal = !showConfigureModal}}>
                            <div class="flex flex-col text-secondary" style="font-family:'Material Icons'; font-size:16px">
                                cancel
                            </div>
                            <span class="flex flex-col text-base-content">Cancel</span>
                        </button>
                        <button class="btn btn-primary btn-sm font-normal rounded-lg ml-auto" on:click={() => {showConfigureModal = !showConfigureModal}}>
                            <div class="flex flex-col text-secondary" style="font-family:'Material Icons'; font-size:16px">
                                save
                            </div>
                            <span class="flex flex-col text-base-content">Save</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <!-- Modals -->
    <ParametricSettings bind:isModalOpen={showParametricSettingsModal}/>
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
    max-height: calc(100vh - 425px);
  }
  .quickbar {
    max-height: calc(100vh - 410px);
  }
  .line-vert {
    border-left: 1px solid #7f7f7f;
  }
</style>
