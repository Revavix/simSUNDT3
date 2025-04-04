<script lang="ts">
    import { open } from "@tauri-apps/plugin-dialog";
    import type { Button as IButton } from "../../lib/models/Button";
    import Button from "../Button.svelte";
    import Modal from "../Modal.svelte";
    import { onMount } from "svelte";
    import { SIMSUNDT_PROJECT_FOLDER } from "../../lib/models/PresetPaths";
    import { ProjectSingleton } from "../../lib/data/ProjectSingleton";
    import { activeTab } from "../../lib/data/Stores";
    

    export let isOpen: boolean
    let width: number 
    let height: number
    let name: string = "New project"
    let directory: string = ""
    let pathError: boolean = false

    onMount(() => {
        // Set initial directory to the user's documents folder
        directory = SIMSUNDT_PROJECT_FOLDER
    })

    let cancelButton: IButton = {
        color: "#ba3822", 
        icon: "close", 
        label: "Cancel", 
        labelSize: 14, 
        action: () => {
            isOpen = false
        }
    }

    let createButton: IButton = {
        color: "#55b13c", 
        icon: "input", 
        label: "Create", 
        labelSize: 14, 
        action: async () => {
            let pj = ProjectSingleton.GetInstance()

            // Create a new project using New in the projectSingleton
            await pj.New()

            // Save the project in the destination directory + project name
            pj.Save(directory + "\\" + name + ".ssproj").then(() => {
                isOpen = false
                activeTab.set("Preprocessor")
            }).catch((err) => {
                pathError = true
            })
        }
    }

    const handleOpenSaveLocation = () => {
        // Open dialog to select save location
        open({
            multiple: false,
            directory: true
        }).then((chosenPath) => {
            if (chosenPath === null || Array.isArray(chosenPath)) return
            directory = chosenPath
            pathError = false
        }).catch((err) => {
            return
        })
    }
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
<Modal bind:isOpen={isOpen} label="New project" description={"Creates a new project"} width={width < 1340 ? 6 : 4 } height={height < 900 ? 6 : 4}>
    <!-- Project name -->
    <div class="flex flex-row w-full">
        <div class="flex flex-col ml-3 mr-3 pb-3 w-full">
            <label for="new_project_name" class="block text-sm font-medium text-base-color">Project name</label>
            <input id="new_project_name" class="input input-secondary input-sm rounded-lg" bind:value={name}/>
        </div>
    </div>
    <!-- Save location -->
    <div class="flex flex-row w-full pb-1">
        <div class="flex flex-col w-full mx-3">
            <label for="new_project_location" class="block text-sm font-medium text-base-color">Save location</label>
            <div class="flex flex-row w-full items-center justify-center">
                <div class="flex flex-col w-full">
                    <input id="new_project_location" class="input input-secondary input-sm rounded-lg {pathError == true ? 'outline outline-red-400' : ''}"
                        bind:value={directory} on:input={() => pathError = false}/>
                </div>
                <div class="flex flex-col pl-3">
                    <button class="btn btn-sm btn-primary w-8 rounded-lg" on:click={handleOpenSaveLocation}>
                        <div class="flex flex-col text-base-content" style="font-family: 'Material Icons'; font-size: 16px;">
                            folder_open
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Cancel/create -->
    <div class="flex flex-row w-full pt-2 px-2 pb-1">
        <div class="flex flex-col rounded py-1 mr-auto">
            <button class="btn btn-sm btn-secondary rounded-lg" on:click={cancelButton.action}>
                <div class="flex flex-col text-base-content" style="font-family: 'Material Icons'; font-size: 16px;">
                    close
                </div>
                <span class="flex flex-col text-xs">Cancel</span>
            </button>
        </div>
        <div class="flex flex-col rounded ml-auto">
            <button class="btn btn-sm btn-primary rounded-lg" on:click={createButton.action}>
                <div class="flex flex-col text-base-content" style="font-family: 'Material Icons'; font-size: 16px;">
                    input
                </div>
                <span class="flex flex-col text-xs">Create</span>
            </button>
        </div>
    </div>
</Modal>