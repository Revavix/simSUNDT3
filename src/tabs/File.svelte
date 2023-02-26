<script lang="ts">
    import { slide } from 'svelte/transition';
    import { onMount } from "svelte";;
    import { fileCache } from '../lib/stores';
    import { fetchCache } from '../lib/utils';
    import Button from '../components/Button.svelte';
    import Alert from '../components/Alert.svelte'

    export let projectHandler
    export let currentTab
    export let unsaved
    export let activeAlerts

    let cache = []

    onMount(async () => {
        // Get project list from cache
        await new Promise(r => setTimeout(r, 200));

        await fetchCache()
    })

    async function addNewAlert(text, color, icon, timeout) {
        activeAlerts.push({t: text, c: color, i: icon})

        setTimeout(() => {
            let idx = -1

            for (let i = 0; i < activeAlerts.length; i++) {
                if (activeAlerts[i].t == text && activeAlerts[i].c == color && activeAlerts[i].i == icon) {
                    idx = i
                    break
                } 
            }

            if (idx > -1) {
                activeAlerts.splice(idx, 1)
                activeAlerts = activeAlerts
            }
        }, timeout)
        
        activeAlerts = activeAlerts
    }

    async function openExportModal() {
        alert("Not implemented yet")
    }

    async function openImportModal() {
        alert("Not implemented yet")
    }

    async function requestLoadByName(project) {
        const loaded = await projectHandler.Load(project.path)

        if (loaded.status == "OK") {
            currentTab = "Preprocessor"
            unsaved = false
        } else {
            addNewAlert("Invalid project loaded, please try another project.", "#ef4444", "warning", 3000)
        }
    }

    async function requestLoadModal() {
        const fileToLoad = await window.electronAPI.openFileModal(projectHandler.projectHomeDir, [
            {
                name: "Project",
                extensions: [".ssproj"]
            },
            { 
                name: 'All Files', 
                extensions: ['*'] 
            }
        ])

        if (fileToLoad == "") {
            return
        }

        const loaded = await projectHandler.Load(fileToLoad)

        if (loaded.status == "OK") {
            currentTab = "Preprocessor"
            unsaved = false
        } else {
            addNewAlert("Invalid project loaded, please try another project.", "#ef4444", "warning", 3000)
        }
    }

    async function requestSave() {
        const saved = await projectHandler.Save()

        if (saved.status == "OK") {
            addNewAlert("Project saved successfully", "#65a30d", "done", 1200)
            unsaved = false
            await fetchCache()
        } else if (saved.status == "ERROR") {
            requestSaveAsModal()
        }
    }

    async function requestSaveAsModal() {
        console.log(projectHandler.projectHomeDir + "/" + projectHandler.currentProject.name + ".ssproj")

        const savePath = await window.electronAPI.openSaveModal(projectHandler.projectHomeDir + "/" + projectHandler.currentProject.name + ".ssproj", [
            {
                name: "Project",
                extensions: [".ssproj"]
            }
        ])

        if (savePath == "") {
            return
        }

        // Extract the name of the project
        let fixedPath = savePath.replace("/\\/gm", "/")
        let newName = fixedPath.substring(fixedPath.lastIndexOf("/") + 1, fixedPath.lastIndexOf("."))
        projectHandler.currentProject.name = newName

        // Save using the original path from electronAPI
        projectHandler.currentProjectPath = savePath
        const saved = await projectHandler.Save()

        if (saved.status == "OK") {
            addNewAlert("Project saved successfully", "#65a30d", "done", 6000)
            unsaved = false
            await fetchCache()
        } else if (saved.status == "ERROR") {
            addNewAlert("Something went wrong when attempting to save, please try again.", "#ef4444", "warning", 6000)
        }
    }

    async function createNewProject() {
        const loaded = await projectHandler.New()

        if (loaded.status == "OK") {
            currentTab = "Preprocessor"
            unsaved = true
        } else {
            addNewAlert("Something went wrong when attempting to create new project, please try again.", "#ef4444", "warning", 6000)
        }
    }

    fileCache.subscribe(v => {
        cache = v
    })
</script>

<div>
    <!-- Main content -->
    <div class="flex flex-col w-full h-full mt-24 items-center">
        <div class="grid grid-cols-2 md:grid-cols-3 w-9/12 md:w-8/12 lg:w-6/12 gap-1 auto-cols-max">
            <div class="flex flex-col">
                <a href="#" class="block p-6 bg-stone-300 border border-gray-500 rounded-lg shadow-md hover:bg-gray-100 text-center" on:click={(e) => createNewProject()}>
                    <div class="flex flex-col icon-simsundt-file">
                        add
                    </div>
                    <h5 class="text-xl font-bold tracking-tight text-simsundt-gray mt-5">New</h5>
                </a>
            </div>
            <div class="flex flex-col">
                <a href="#" class="block p-6 bg-stone-300 border border-gray-500 rounded-lg shadow-md hover:bg-gray-100 text-center" on:click={(e) => requestLoadModal()}>
                    <div class="flex flex-col icon-simsundt-file">
                        refresh
                    </div>
                    <h5 class="text-xl font-bold tracking-tight text-simsundt-gray mt-5">Load</h5>
                </a>
            </div>
            <div class="flex flex-col">
                <a href="#" class="block p-6 bg-stone-300 border border-gray-500 rounded-lg shadow-md hover:bg-gray-100 text-center" on:click={(e) => openImportModal()}>
                    <div class="flex flex-col icon-simsundt-file">
                        download
                    </div>
                    <h5 class="text-xl font-bold tracking-tight text-simsundt-gray mt-5">Import</h5>
                </a>
            </div>
            <div class="flex flex-col">
                <a href="#" class="block p-6 bg-stone-300 border border-gray-500 rounded-lg shadow-md hover:bg-gray-100 text-center" on:click={(e) => openExportModal()}>
                    <div class="flex flex-col icon-simsundt-file">
                        upload
                    </div>
                    <h5 class="text-xl font-bold tracking-tight text-simsundt-gray mt-5">Export</h5>
                </a>
            </div>
            <div class="flex flex-col">
                <a href="#" class="block p-6 bg-stone-300 border border-gray-500 rounded-lg shadow-md hover:bg-gray-100 text-center" on:click={(e) => requestSave()}>
                    <div class="flex flex-col icon-simsundt-file">
                        save
                    </div>
                    <h5 class="text-xl font-bold tracking-tight text-simsundt-gray mt-5">Save</h5>
                </a>
            </div>
            <div class="flex flex-col">
                <a href="#" class="block p-6 bg-stone-300 border border-gray-500 rounded-lg shadow-md hover:bg-gray-100 text-center" on:click={(e) => requestSaveAsModal()}>
                    <div class="flex flex-col icon-simsundt-file">
                        save_as
                    </div>
                    <h5 class="text-xl font-bold tracking-tight text-simsundt-gray mt-5">Save As</h5>
                </a>
            </div>
        </div>
        <div class="flex flex-row w-9/12 md:w-8/12 lg:w-6/12 mx-auto mt-4">
            <div class="flex flex-col w-full">
                <div class="flex flex-row">
                    Latest projects
                </div>
                <div class="flex flex-row border-2 rounded-lg w-full"/>
                <div class="flex flex-col w-full latest-projects pr-1 mt-1"  style="overflow: auto">
                    {#each cache as p}
                    <div class="flex flex-row rounded-md shadow-md w-full bg-stone-300 py-2 my-1 hover:bg-gray-100" transition:slide|local> 
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
    </div>
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
    .latest-projects {
        min-height: 100px;
        max-height: calc(100vh - 500px);
    }
    ::-webkit-scrollbar {
        width: 14px;
    }
    ::-webkit-scrollbar-track {
        background: #4d4d4d;
        border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb {
        background: rgb(214, 211, 209); 
        border-radius: 10px;
    }
</style>