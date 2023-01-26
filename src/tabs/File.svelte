<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { onMount } from "svelte";
    import { Button } from "../lib/buttonDef";
    import ButtonComponent from '../components/Button.svelte';

    export let properties

    let dispatch = createEventDispatcher()
    let projects = []
    let showNewModal = false
    let newProjectName = ""
    let newProjectPath = ""

    onMount(() => {
        // Get project list from API
        window.electronAPI.projectListLatest().then((v) => {
            projects = v
        })
        
        dispatch('message', {
            origin: "Generic",
            type: "HideViewport"
        })
    })

    async function requestLoadByName(project) {
        console.log(project.path)

        const loaded = window.electronAPI.projectLoadByPath(project.path)

        loaded.then((v) => {
            dispatch('message', {
                origin: "File",
                type: "ProjectUpdate",
                projectName: v["data"]["name"]
            })
        })

        loaded.catch((v) => {
            // TODO: Display error message
        })
    }

    async function requestLoadModal() {
        const loaded = window.electronAPI.projectLoadByModal()

        loaded.then((v) => {
            dispatch('message', {
                origin: "File",
                type: "ProjectUpdate",
                projectName: v["data"]["name"]
            })
        })

        loaded.catch((v) => {
            // TODO: Display error message
        })
    }

    async function closeNewModal() {
        showNewModal = false
        newProjectName = ""
        newProjectPath = ""
    }

    async function openNewModal() {
        showNewModal = true
    }

    async function openExportModal() {
        alert("Not implemented yet")
    }

    async function requestNewChooseLocation() {
        const chosen = window.electronAPI.projectNewChooseLocation()

        chosen.then((v) => {
            if (v != "") {
                newProjectPath = v
            }
        })
    }

    async function requestNewCreate(overwrite) {
        const loaded = window.electronAPI.projectNewCreate(newProjectName, newProjectPath, overwrite)

        loaded.then((v) => {
            console.log(v)

            dispatch('message', {
                origin: "File",
                type: "ProjectUpdate",
                projectName: v["data"]["name"]
            })
        })
    }
</script>

<div>
    <div class="flex flex-col w-full h-full mt-12">
        <div class="flex flex-row w-full justify-center space-x-2">
            <div class="flex flex-col w-48">
                <a href="#" class="block max-w-sm p-6 bg-stone-300 border border-gray-500 rounded-lg shadow-md hover:bg-gray-100 text-center" on:click={(e) => openNewModal()}>
                    <div class="flex flex-col icon-simsundt-file">
                        add
                    </div>
                    <h5 class="text-xl font-bold tracking-tight text-simsundt-gray mt-5">New</h5>
                    <p class="font-normal text-simsundt-gray">Create a new simulation project</p>
                </a>
            </div>
            <div class="flex flex-col w-48">
                <a href="#" class="block max-w-sm p-6 bg-stone-300 border border-gray-500 rounded-lg shadow-md hover:bg-gray-100 text-center" on:click={(e) => requestLoadModal()}>
                    <div class="flex flex-col icon-simsundt-file">
                        refresh
                    </div>
                    <h5 class="text-xl font-bold tracking-tight text-simsundt-gray mt-5">Load</h5>
                    <p class="font-normal text-simsundt-gray">Load an existing simulation project</p>
                </a>
            </div>
            <div class="flex flex-col w-48">
                <a href="#" class="block max-w-sm p-6 bg-stone-300 border border-gray-500 rounded-lg shadow-md hover:bg-gray-100 text-center" on:click={(e) => openExportModal()}>
                    <div class="flex flex-col icon-simsundt-file">
                        upload
                    </div>
                    <h5 class="text-xl font-bold tracking-tight text-simsundt-gray mt-5">Export</h5>
                    <p class="font-normal text-simsundt-gray">Export the project in another format</p>
                </a>
            </div>
        </div>
        <div class="flex flex-row w-9/12 md:w-7/12 lg:w-6/12 mx-auto mt-4">
            <div class="flex flex-col w-full">
                <div class="flex flex-row">
                    Latest projects
                </div>
                <div class="flex flex-row border-2 rounded-lg w-full"/>
                {#each projects as p}
                <div class="flex flex-row rounded-md shadow-md w-full bg-stone-300 py-2 my-1 hover:bg-gray-100"> 
                    <a href="#" class="flex flex-row w-full" on:click={(e) => requestLoadByName(p)}>
                        <div class="flex flex-col ml-2">
                            <p class="font-lg text-simsundt-gray">{p.name}</p>
                        </div>
                        <div class="flex flex-col ml-auto mr-2">
                            <p class="font-lg text-simsundt-gray">{p.lastSaved}</p>
                        </div>
                    </a>
                </div>
                {/each}
            </div>
        </div>
    </div>

    {#if showNewModal}
    <div class="absolute-bg bg-stone-600 opacity-75"/>
    <div class="absolute-above-center w-6/12 h-6/12">
        <div class="relative w-full h-full md:h-auto">
            <div class="relative rounded-lg shadow bg-stone-200">
                <div class="flex items-start justify-between p-3 rounded-t">
                    <h3 class="text-md font-semibold text-gray-600">
                        New project
                    </h3>
                    <div class="bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                        <ButtonComponent btn={new Button("", "#807a7a", "close", () => {closeNewModal()})}></ButtonComponent>
                    </div>
                </div>
                <div class="p-3 flex flex-col w-full">
                    <div class="flex flex-row w-full">
                        <p class="block mb-2 text-sm font-medium text-gray-900">Project name</p>
                    </div>
                    <div class="flex flex-row w-full">
                        <div class="flex flex-col w-11/12">
                            <input type="text" bind:value={newProjectName} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="New project" required>
                        </div>
                    </div>
                    <div class="flex flex-row w-full mt-2">
                        <p class="block mb-2 text-sm font-medium text-gray-900">Path</p>
                    </div>
                    <div class="flex flex-row w-full">
                        <div class="flex flex-col w-11/12">
                            <input type="text" bind:value={newProjectPath} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="/Users/<user>/Documents/simSUNDT/Projects/" required>
                        </div>
                        <button class="flex flex-col w-1/12 justify-center mx-2 rounded-lg px-2 hover:bg-gray-400" on:click={requestNewChooseLocation}>
                            <div class="flex flex-row w-full">
                                <div class="flex flex-col" style="font-family:'Material Icons'; font-size:24px; color:#4d4d4d">
                                    folder_open
                                </div>
                            </div>
                        </button>
                    </div>
                    {#if newProjectPath != "" && newProjectName != ""}
                    <div class="flex flex-row w-full text-emerald-500 text-sm mt-2">
                        Project will be created as {newProjectPath + "/" + newProjectName + ".ssproj"}
                    </div>
                    {/if}
                    <div class="flex flex-row w-full mt-4">
                        <button class="flex flex-col justify-center rounded-lg p-2 hover:bg-gray-400" on:click={() => {closeNewModal()}}>
                            <div class="flex flex-row">
                                <div class="flex flex-col" style="font-family:'Material Icons'; font-size:32px; color:#4d4d4d">
                                    cancel
                                </div>
                                <div class="flex flex-col text-simsundt-gray font-bold mx-2">
                                    Cancel
                                </div>
                            </div>
                        </button>
                        <button class="flex flex-col justify-center rounded-lg p-2 hover:bg-gray-400 ml-auto" on:click={() => {requestNewCreate(false)}}>
                            <div class="flex flex-row">
                                <div class="flex flex-col text-simsundt-gray font-bold mx-2">
                                    Create
                                </div>
                                <div class="flex flex-col" style="font-family:'Material Icons'; font-size:32px; color:#4d4d4d">
                                    add_circle
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
    {/if}
</div>

<style>
    .icon-simsundt-file {
        font-family:'Material Icons'; 
        font-size:48px; 
        color:#4d4d4d
    }
    .text-simsundt-gray {
        color:#4d4d4d;
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
</style>