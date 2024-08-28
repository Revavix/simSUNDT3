<script lang="ts">
    import { open } from "@tauri-apps/api/dialog";
    import { DOCUMENT_DIR, SIMSUNDT_SIMULATION_FOLDER } from "../../lib/models/PresetPaths";
    import type { Button as IButton } from "../../lib/models/Button";
    import Button from "../Button.svelte";
    import { copyFile, createDir } from "@tauri-apps/api/fs";
    import { ProjectSingleton } from "../../lib/data/ProjectSingleton";
    import { invoke } from "@tauri-apps/api/tauri";
    import { onMount } from "svelte";

    export let parentModalIsOpen: boolean
    export let parentCancelButton: IButton
    export let parentSubmitButton: IButton

    let projectSingleton: ProjectSingleton = ProjectSingleton.GetInstance()
    let metadataPath: string
    let cpath: string
    let apath: string
    let name: string = "Import-" + crypto.randomUUID()
    let tempContent: Array<any> = []
    let tempColumns: number | null = null
    let tempSamples: number | null = null
    let metadataHasError: boolean = false
    let metadataErrorText: string = ""
    let topviewHasError: boolean = false
    let topviewErrorText: string = ""
    let pointviewHasError: boolean = false
    let pointviewErrorText: string = ""

    const handleOpenMetadata = () => {
        open({
            multiple: false,
            filters: [{
                name: 'Text file',
                extensions: ['txt']
            }],
            defaultPath: DOCUMENT_DIR
        }).then((chosenPath) => {
            if (chosenPath === null || Array.isArray(chosenPath)) return
            metadataPath = chosenPath

            handleMetadataChange()
        }).catch((err) => {
            return
        })
    }

    const handleOpenCData = () => {
        open({
            multiple: false,
            filters: [{
                name: 'Dat file',
                extensions: ['dat']
            }],
            defaultPath: DOCUMENT_DIR
        }).then((v) => {
            if (v === null || Array.isArray(v)) return
            cpath = v

            handleTopviewDataChange()
        }).catch((err) => {
            return
        })
    }

    const handleOpenAData = () => {
        open({
            multiple: false,
            filters: [{
                name: 'Dat file',
                extensions: ['dat']
            }],
            defaultPath: DOCUMENT_DIR
        }).then((v) => {
            if (v === null || Array.isArray(v)) return
            apath = v

            handlePointDataChange()
        }).catch((err) => {
            return
        })
    }

    const handleMetadataChange = () => {
        if (metadataPath == "") {
            metadataHasError = false
            return
        }

        invoke('commands_results_parse_metadata', { path: metadataPath }).then((v: any) => {
            metadataHasError = false
        }).catch((e) => {
            metadataHasError = true
            metadataErrorText = e
        })
    }

    const handleTopviewDataChange = () => {
        if (cpath == "") {
            topviewHasError = false
            return
        }

        invoke('commands_results_parse_top_view', { path: cpath }).then((v: any) => {
            topviewHasError = false
            tempSamples = v.samples
            tempColumns = v.columns
            tempContent = v.content
        }).catch((e) => {
            topviewHasError = true
            topviewErrorText = e
        })
    }

    const handlePointDataChange = () => {
        if (apath.length === 0) {
            pointviewHasError = false
            pointviewErrorText = ""
            return
        }

        if (tempSamples == null || tempColumns == null || tempContent.length == 0) {
            pointviewHasError = true
            pointviewErrorText = "Must specify a metadata file and C scan before file can be validated"
            return
        }

        invoke('commands_results_parse_point_view', { path: apath, index: 0, samples: tempSamples }).then((v) => {
            pointviewHasError = false
        }).catch((e) => {
            pointviewHasError = true
            pointviewErrorText = e
        })
    }

    const getBorderStyle = (hasError: boolean, path: string) => {
        if (hasError === undefined || path === undefined) return

        if (hasError && path.length === 0) {
            return 'border-transparent focus:border-amber-500'
        } else if (hasError && path.length > 0) {
            return 'border-red-500'
        } else if (!hasError && path.length > 0) {
            return 'border-green-500'
        }
    }

    parentSubmitButton.action = () => {
        createDir(SIMSUNDT_SIMULATION_FOLDER + "\\" + name, { recursive: true })
        .then(() => {
            return copyFile(metadataPath, SIMSUNDT_SIMULATION_FOLDER + "\\" + name + "\\utIndefa.txt")
        })
        .then(() => {
            return copyFile(cpath, SIMSUNDT_SIMULATION_FOLDER + "\\" + name + "\\utIndefa-C.dat")
        })
        .then(() => {
            return copyFile(apath, SIMSUNDT_SIMULATION_FOLDER + "\\" + name + "\\utIndefa-A.dat")
        })
        .then(() => {
            projectSingleton.PushPostprocessorData({
                name: name,
                timestamp: new Date(),
                runs: [{ path: SIMSUNDT_SIMULATION_FOLDER + "\\" +  name }]
            })
            parentCancelButton.action()
        }).catch((e) => {

        }).finally(() => {
            parentModalIsOpen = false
        })
    }

    onMount(() => {
        parentSubmitButton.disabled = true
    })

    $: {
        if ((metadataHasError || topviewHasError || pointviewHasError) || (metadataPath === "" || cpath === "" || apath === "")) {
            parentSubmitButton.disabled = true
        } else {
            parentSubmitButton.disabled = false
        }
    }
</script>

<div class="flex flex-row w-full pb-1">
    <div class="flex flex-col w-full mx-3">
        <label for="s2results_metadata_file" class="block text-sm font-medium text-gray-900 dark:text-white" style="color:#4d4d4d;">Metadata file (utIndefa.txt)</label>
        <div class="flex flex-row w-full items-center justify-center">
            <div class="flex flex-col w-full">
                <input bind:value={metadataPath} id="s2results_metadata_file" class="w-full bg-gray-50 border-2 {getBorderStyle(metadataHasError, metadataPath)}
                    text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-0 disabled:opacity-75" on:input={handleMetadataChange}/>
            </div>
            <div class="flex flex-col pl-3">
                <Button data={{ color: "#4d4d4d", icon: "folder_open", action: handleOpenMetadata }}/>
            </div>
        </div>
        {#if metadataHasError} 
        <p class="text-xs" style="color:#ef4444;">{metadataErrorText}</p>
        {/if}
    </div>
</div>
<div class="flex flex-row w-full pb-1">
    <div class="flex flex-col w-full mx-3">
        <label for="s2results_cscan_file" class="block text-sm font-medium text-gray-900 dark:text-white" style="color:#4d4d4d;">C data file (utIndefa-C.dat)</label>
        <div class="flex flex-row w-full items-center justify-center">
            <div class="flex flex-col w-full">
                <input bind:value={cpath} id="s2results_cscan_file" class="w-full bg-gray-50 border-2 {getBorderStyle(topviewHasError, cpath)}
                text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-0 disabled:opacity-75" on:input={handleTopviewDataChange}/>
            </div>
            <div class="flex flex-col pl-3">
                <Button data={{ color: "#4d4d4d", icon: "folder_open", action: handleOpenCData }}/>
            </div>
        </div>
        {#if topviewHasError} 
        <p class="text-xs" style="color:#ef4444;">{topviewErrorText}</p>
        {/if}
    </div>
</div>
<div class="flex flex-row w-full pb-3">
    <div class="flex flex-col w-full mx-3">
        <label for="s2results_ascan_file" class="block text-sm font-medium text-gray-900 dark:text-white" style="color:#4d4d4d;">A data file (utIndefa-A.dat)</label>
        <div class="flex flex-row w-full items-center justify-center">
            <div class="flex flex-col w-full">
                <input bind:value={apath} id="s2results_ascan_file" class="w-full bg-gray-50 border-2 {getBorderStyle(pointviewHasError, apath)}
                text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-0 disabled:opacity-75" on:input={handlePointDataChange}/>
            </div>
            <div class="flex flex-col pl-3">
                <Button data={{ color: "#4d4d4d", icon: "folder_open", action: handleOpenAData }}/>
            </div>
        </div>
        {#if pointviewHasError} 
        <p class="text-xs" style="color:#ef4444;">{pointviewErrorText}</p>
        {/if}
    </div>
</div>
<div class="flex flex-row w-full pb-3">
    <div class="flex flex-col w-full mx-3">
        <label for="s2results_import_name" class="block text-sm font-medium text-gray-900 dark:text-white" style="color:#4d4d4d;">Import name</label>
        <input bind:value={name} id="s2results_import_name" class="w-full bg-gray-50 border-2 border-transparent text-gray-900 text-sm rounded-lg focus:border-amber-500 focus:outline-none focus:ring-0 disabled:opacity-75"/>
    </div>
</div>