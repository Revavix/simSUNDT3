<script lang="ts">
    // Base font for project
    import "@fontsource/inter";
    import "@fontsource/inter/700.css"

    // Svelte Imports
    import { ProjectSingleton } from "./lib/data/ProjectSingleton";
    import { slide } from "svelte/transition";
    import File from './tabs/File.svelte'
    import Help from './tabs/Help.svelte'
    import Preprocessor from './tabs/Preprocessor.svelte'
    import Results from './tabs/Results.svelte'
    import { onMount } from 'svelte';
    import Viewport from './components/Viewport.svelte'
    import Button from "./components/Button.svelte"
    import Alert from "./components/Alert.svelte";
    import { KernelRunner as UTDefectV3Runner } from "./lib/kernel/utdefect/KernelRunner";
    import SimsundtIcon from "./components/icons/SimsundtIcon.svelte";
    import { Canvas } from "@threlte/core";

    // Tauri Interactions
    import { platform } from '@tauri-apps/api/os';
    import { appWindow } from "@tauri-apps/api/window"
    import { save } from '@tauri-apps/api/dialog';
    import { exists, createDir, BaseDirectory } from '@tauri-apps/api/fs';
    import type { Runner } from "./lib/models/Kernel";
    import { activeTab, theme } from "./lib/data/Stores";
    import Tooltip from "./components/Tooltip.svelte";
    import { getVersion } from "@tauri-apps/api/app";
    import { open } from "@tauri-apps/api/shell";
    import Modal from "./components/Modal.svelte";
    import { SIMSUNDT_PROJECT_FOLDER } from "./lib/models/PresetPaths";
    
    let tabs = [
        {
            name: "File",
            disabled: () => {
                return false
            }
        }, 
        {
            name: "Preprocessor",
            disabled: () => {
                return ProjectSingleton.GetInstance().IsValid() == false
            }
        }, 
        {
            name: "Results",
            disabled: () => {
                return ProjectSingleton.GetInstance().IsValid() == false
            }
        }, 
        {
            name: "Help",
            disabled: () => {
                return false
            }
        }, 
    ]
    let unsaved = true
    let activeAlerts: any[] = []

    let loadedProjectName: string = ""
    let kernelRunner: Runner = new UTDefectV3Runner(4)

    let exitModalOpen = false

    let version = '3'
    let remoteVersion = '3'
    let remoteConnectionError = false

    let maximized = false

    onMount(async () => {
        // Ensure simSUNDT folder structure is present on App startup
        const folderExists = await exists('simSUNDT', { dir: BaseDirectory.Document })

        if (!folderExists) {
            await createDir('Projects', { dir: BaseDirectory.Document, recursive: true})
        }

        // Update version to released version
        version = await getVersion()
        await getRemoteVersion().then((v) => {
            remoteVersion = v
        }).catch((err) => {
            remoteConnectionError = true
        })
    })

    const minimizeButton = {
        color: "#d6d3d1",
        icon: "minimize",
        action: () => { appWindow.minimize() },
        disabled: false
    }

    const maximizeButton = {
        color: "#d6d3d1",
        icon: "crop_square",
        action: async () => { 
            appWindow.maximize() 
            maximized = await appWindow.isMaximized()
        },
        disabled: false
    }

    const unmaximizeButton = {
        color: "#d6d3d1",
        icon: "close_fullscreen",
        action: async () => { 
            appWindow.unmaximize()
            maximized = await appWindow.isMaximized()
        },
        disabled: false
    }

    const closeButton = {
        color: "#d6d3d1",
        icon: "close",
        action: () => { 
            if (unsaved) { 
                exitModalOpen = true 
            } else { 
                appWindow.close() 
            } 
        },
        disabled: false
    }

    const getRemoteVersion = async () => {
        let response = await fetch('https://api.github.com/repos/Revavix/simSUNDT3/releases/latest')
        let data = await response.json()

        return data.tag_name
    }

    ProjectSingleton.GetInstance().Subscribe((v) => {
        loadedProjectName = v.name
        // Refresh hack to force re-render
        tabs = [...tabs]
        
        if (ProjectSingleton.GetInstance().IsChanged()) {
            unsaved = true
        } else {
            unsaved = false
        }
    })
</script>

<svelte:window on:contextmenu={(e) => e.preventDefault()} />

<main class="flex flex-col main-container rounded-xl ">
    <!-- Drag bar -->
    <div class="draggable"/>
    <!-- OS specific top bar -->
    {#await platform()}
        App is loading
    {:then os}
        {#if os === 'darwin'}
        <div class="flex flex-row text-center justify-center mt-2 text-sm">
            <p>SimSUNDT [{version}] - {loadedProjectName} {unsaved == false ? '' : '(Unsaved)'}</p>
        </div>
        {:else if os === 'win32'}
        <div data-tauri-drag-region class="flex flex-row text-xs items-center mt-2" style="z-index: 99;">
            <!-- Image -->
            <div data-tauri-drag-region class="flex flex-col w-4 mr-1">
                <SimsundtIcon/>
            </div>
            <!-- App name -->
            <div data-tauri-drag-region class="flex flex-col cursor-default select-none whitespace-nowrap w-min text-gray-300">
                SimSUNDT {version}
            </div>
            <!-- New version availability -->
            <div data-tauri-drag-region class="flex flex-col ml-1 w-4">
                {#if version !== remoteVersion && remoteConnectionError == false}
                <Button data={{
                    label: "",
                    color: "rgb(74 222 128)",
                    icon: "arrow_upward",
                    action: () => { 
                        // Open browser to latest release
                        open(`https://github.com/Revavix/simSUNDT3/releases/tag/${remoteVersion}`)
                    },
                    disabled: false
                }}/>
                {:else if remoteConnectionError == true}
                <Button data={{
                    label: "",
                    color: "#ff0000",
                    icon: "warning",
                    action: () => { 
                        // Swap to help tab
                    },
                    disabled: false
                }}/>
                {/if}
            </div>
        </div>
        <!-- Absolute positioned project title -->
        <div data-tauri-drag-region class="text-xs text-gray-300 cursor-default select-none mt-2" style="position: fixed; left: 50%; transform: translate(-50%, 0%); z-index: 98;">
            {ProjectSingleton.GetInstance().IsValid() ? loadedProjectName + (unsaved == false ? '' : ' *') : 'No active project'}
        </div>
        <!-- Absolute positioned min/max/close bar -->
        <div class="flex flex-col absolute" style="right: 0; z-index: 99;">
            <div class="flex flex-row rounded-b">
                <label class="swap swap-rotate px-1 text-gray-300 my-1">
                    <input type="checkbox" class="theme-controller" value="business" on:change={(e) => { 
                        theme.set(e.currentTarget?.checked ? 'business' : 'simsundt')
                    }} />
                    <svg
                      class="swap-off h-5 w-5 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24">
                      <path
                        d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                    </svg>
                    <svg
                      class="swap-on h-5 w-5 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24">
                      <path
                        d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                    </svg>
                </label>
                <div class="flex flex-col border-r my-1.5 mx-2 bg-neutral"/>
                <!-- Minimize  -->
                <div class="flex flex-col w-full px-1 rounded-b hover:bg-stone-400">
                    <Button data={minimizeButton}></Button>
                </div>
                <!-- Maximize -->
                {#if !maximized}
                <div class="flex flex-col w-full px-1 rounded-b hover:bg-stone-400">
                    <Button data={maximizeButton}></Button>
                </div>
                {:else}
                <div class="flex flex-col px-1 rounded-b hover:bg-stone-400">
                    <Button data={unmaximizeButton}></Button>
                </div>
                {/if}
                <!-- Close -->
                <div class="flex flex-col px-1 rounded-b hover:bg-stone-400">
                    <Button data={closeButton}></Button>
                </div>
            </div>
        </div>
        {/if}
    {/await}
    <div class="flex flex-row text-sm font-medium text-center text-gray-300 mt-1" style="z-index: 99;">
        <ul class="flex flex-row">
            {#each tabs as tab}
                <li class="mr-2">
                    {#if $activeTab == tab.name}
                        <button class="inline-block text-gray-200 rounded-t-lg border-b-2 border-yellow-600 active">{tab.name}</button>
                    {:else}
                        {#if tab.disabled() == true}
                            <Tooltip label="Project must be loaded" class="text-xs text-white">
                                <button class="inline-block rounded-t-lg border-b-2 border-transparent text-gray-400 dark:text-gray-300 opacity-75 text-sm">{tab.name}</button>
                            </Tooltip>
                        {:else}
                            <button class="inline-block text-gray-200 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" on:click={() => $activeTab = tab.name}>{tab.name}</button>
                        {/if}
                    {/if}
                </li>
            {/each}
        </ul>
    </div>
    {#if $activeTab == "File"}
        <File bind:unsaved={unsaved} bind:activeAlerts={activeAlerts}/>
    {:else if $activeTab == "Preprocessor"}
        <Preprocessor bind:kernelRunner={kernelRunner} bind:unsaved={unsaved}/>
    {:else if $activeTab == "Results"}
        <Results/>
    {:else if $activeTab == "Help"}
        <Help/>
    {/if}
    <div class="absolute-under" class:visible={$activeTab === "Preprocessor" || $activeTab === "Results"} class:invisible={$activeTab === "File" || $activeTab === "Help"}>
        <Canvas>
            <Viewport/>
        </Canvas>
    </div>

    <!-- Alert -->
    <div class="mx-auto w-6/12 mt-12 cursor-default" style="position: absolute; left: 0; right: 0; top: 0; z-index: 999;">
        {#each activeAlerts as alert}
        <div class="mt-0.5" transition:slide>
            <Alert text={alert.t} color={alert.c} icon={alert.i} duration={alert.duration}/>
        </div>
        {/each}
    </div>

    <!-- Exit verification modal -->
    <Modal bind:isOpen={exitModalOpen}
        label={"Save changes before closing?"}
        width={4}
        >
        <div class="flex flex-row p-2">
            <button class="btn btn-secondary btn-sm rounded-lg flex flex-col" on:click={() => { exitModalOpen = false }}>Cancel</button>
            <button class="btn btn-secondary btn-sm rounded-lg flex flex-col ml-auto" on:click={() => { appWindow.close() }}>No</button>
            <button class="btn btn-primary btn-sm rounded-lg flex flex-col ml-1" on:click={() => {
                let path = ProjectSingleton.GetInstance().Path

                if (path === null) {
                    save({
                        filters: [{
                            name: 'Project',
                            extensions: ['ssproj']
                        }],
                        defaultPath: SIMSUNDT_PROJECT_FOLDER
                    }).then((result) => {
                        if (result !== null) {
                            ProjectSingleton.GetInstance().Save(result).then(() => {
                                appWindow.close()
                            })
                        }
                    })
                } else {
                    ProjectSingleton.GetInstance().Save(path).then(() => {
                        appWindow.close()
                    })
                }
            }}>Yes</button>
        </div>
    </Modal> 
</main>

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
    div::-webkit-scrollbar {
        display: none;
    }
    .main-container
    {
        width: calc(100% - 32px);
        margin-right: 16px;
        margin-left: 16px;
        height: 100%;
    }
    .draggable
    {
        -webkit-app-region: drag;
        position: absolute;
        height: 32px;
        left: 0;
        width: calc(100% - 80px);
        z-index: 1;
        pointer-events: all;
    }
</style>
