<script lang="ts">
    import { slide } from 'svelte/transition';
    import { onMount } from "svelte";;
    import { open, save } from '@tauri-apps/api/dialog';
    import { ProjectSingleton } from '../lib/data/ProjectSingleton';
    import { SIMSUNDT_PROJECT_FOLDER } from '../lib/models/PresetPaths';
    import { ProjectCacheSingleton } from '../lib/data/ProjectCacheSingleton';
    import { exists } from '@tauri-apps/api/fs';

    export let currentTab
    export let unsaved
    export let activeAlerts: any

    let projectSingleton: ProjectSingleton = ProjectSingleton.GetInstance()
    let cacheSingleton: ProjectCacheSingleton = ProjectCacheSingleton.GetInstance()

    onMount(async () => {
        // Get project list from cache
        await new Promise(r => setTimeout(r, 200));
    })

    async function addNewAlert(text: any, color: any, icon: any, timeout: any) {
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

    async function handleOpenExportModal() {
        alert("Not implemented yet")
    }

    async function handleOpenImportModal() {
        alert("Not implemented yet")
    }

    async function handleLoadByName(project: any) {
        projectSingleton.Load(project.path).then(() => {
            currentTab = "Preprocessor"
            unsaved = false
        }).catch(() => {
            addNewAlert("Invalid project loaded, please try another project.", "#ef4444", "warning", 3000)
        }).finally(() => {
            cacheSingleton.Refresh()
        })
    }

    async function handleOpenLoadModal() {
        const fileToLoad = await open({
            multiple: false,
            filters: [{
                name: 'Project',
                extensions: ['ssproj']
            }],
            defaultPath: SIMSUNDT_PROJECT_FOLDER
        })

        if (fileToLoad === "" || fileToLoad === null || Array.isArray(fileToLoad)) {
            return
        }

        projectSingleton.Load(fileToLoad).then(() => {
            currentTab = "Preprocessor"
            unsaved = false
        }).catch(() => {
            addNewAlert("Invalid project loaded, please try another project.", "#ef4444", "warning", 3000)
        }).finally(() => {
            cacheSingleton.Refresh()
        })
    }

    async function handleSave() {
        await projectSingleton.Save(projectSingleton.Path).then(() => {
            addNewAlert("Project saved successfully", "#65a30d", "done", 1200)
            unsaved = false
        }).catch(() => {
            handleOpenSaveModal()
        })
    }

    async function handleOpenSaveModal() {
        const saveResult: string | null = await save({
            filters: [{
                name: 'Project',
                extensions: ['ssproj']
            }],
            defaultPath: SIMSUNDT_PROJECT_FOLDER
        })

        if (saveResult === null) return
        
        await projectSingleton.Save(saveResult).then(() => {
            addNewAlert("Project saved successfully", "#65a30d", "done", 6000)
            unsaved = false
        }).catch(() => {
            addNewAlert("Something went wrong when attempting to save, please try again.", "#ef4444", "warning", 6000)
        })
    }

    async function createNewProject() {
        await projectSingleton.New().then(() => {
            currentTab = "Preprocessor"
            unsaved = true
        }).catch(() => {
            addNewAlert("Something went wrong when attempting to create new project, please try again.", "#ef4444", "warning", 6000)
        })
    }

    projectSingleton.SubscribeProjectUpdate((v) => {
        exists(v.path).then(() => {
            if (true) {
                cacheSingleton.Write(v)
            }
        })
    })
</script>

<div class="file absolute left-0 right-0 top-0 bottom-0"/>
<div class="absolute left-0 bottom-0 m-2" style="width: 111px; height: 57px">
    <div class="logo-1 h-full w-full"/>
</div>
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
                <a href="#" class="block p-6 bg-stone-300 border border-gray-500 rounded-lg shadow-md hover:bg-gray-100 text-center" on:click={(e) => handleOpenLoadModal()}>
                    <div class="flex flex-col icon-simsundt-file">
                        refresh
                    </div>
                    <h5 class="text-xl font-bold tracking-tight text-simsundt-gray mt-5">Load</h5>
                </a>
            </div>
            <div class="flex flex-col">
                <a href="#" class="block p-6 bg-stone-300 border border-gray-500 rounded-lg shadow-md hover:bg-gray-100 text-center" on:click={(e) => handleOpenImportModal()}>
                    <div class="flex flex-col icon-simsundt-file">
                        download
                    </div>
                    <h5 class="text-xl font-bold tracking-tight text-simsundt-gray mt-5">Import</h5>
                </a>
            </div>
            <div class="flex flex-col">
                <a href="#" class="block p-6 bg-stone-300 border border-gray-500 rounded-lg shadow-md hover:bg-gray-100 text-center" on:click={(e) => handleOpenExportModal()}>
                    <div class="flex flex-col icon-simsundt-file">
                        upload
                    </div>
                    <h5 class="text-xl font-bold tracking-tight text-simsundt-gray mt-5">Export</h5>
                </a>
            </div>
            <div class="flex flex-col">
                <a href="#" class="block p-6 bg-stone-300 border border-gray-500 rounded-lg shadow-md hover:bg-gray-100 text-center" on:click={(e) => handleSave()}>
                    <div class="flex flex-col icon-simsundt-file">
                        save
                    </div>
                    <h5 class="text-xl font-bold tracking-tight text-simsundt-gray mt-5">Save</h5>
                </a>
            </div>
            <div class="flex flex-col">
                <a href="#" class="block p-6 bg-stone-300 border border-gray-500 rounded-lg shadow-md hover:bg-gray-100 text-center" on:click={(e) => handleOpenSaveModal()}>
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
                    {#each cacheSingleton.projects as project}
                    <div class="flex flex-row rounded-md shadow-md w-full bg-stone-300 py-2 my-1 hover:bg-gray-100" transition:slide|local> 
                        <a href="#" class="flex flex-row w-full" on:click={(e) => handleLoadByName(project)}>
                            <div class="flex flex-col ml-2">
                                <p class="font-lg text-simsundt-gray">{project.name}</p>
                            </div>
                            <div class="flex flex-col ml-auto mr-2">
                                <p class="font-lg text-simsundt-gray">{project.date.toLocaleString()}</p>
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
    .logo-1 {
        background-image: url("../assets/university_west_logo_small.png");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        z-index: -1;
    }
    .file {
        background-image: url("../assets/bg_lab_probe_1.png");
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        z-index: -2;
    }
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