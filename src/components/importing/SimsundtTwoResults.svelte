<script lang="ts">
    import { open } from "@tauri-apps/api/dialog";
    import { DOCUMENT_DIR, SIMSUNDT_SIMULATION_FOLDER } from "../../lib/models/PresetPaths";
    import Button from "../Button.svelte";
    import { copyFile, createDir } from "@tauri-apps/api/fs";
    import { ProjectSingleton } from "../../lib/data/ProjectSingleton";

    let projectSingleton: ProjectSingleton = ProjectSingleton.GetInstance()
    let metadataPath: string
    let cpath: string
    let apath: string
    let name: string = "Import-" + crypto.randomUUID()

    const handleOpenMetadata = () => {
        open({
            multiple: false,
            filters: [{
                name: 'Text file',
                extensions: ['txt']
            }],
            defaultPath: DOCUMENT_DIR
        }).then((v) => {
            if (v === null || Array.isArray(v)) return
            metadataPath = v
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
        }).catch((err) => {
            return
        })
    }

    export const submit = () => {
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
            console.log(name)
            projectSingleton.PushPostprocessorData({
                name: name,
                timestamp: new Date(),
                runs: [{ path: SIMSUNDT_SIMULATION_FOLDER + "\\" +  name }]
            })
        }).catch((e) => {

        })
    }
</script>

<div class="flex flex-row w-full pb-1">
    <div class="flex flex-col w-full mx-3">
        <label for="s2results_metadata_file" class="block text-sm font-medium text-gray-900 dark:text-white" style="color:#4d4d4d;">Metadata file (utIndefa.txt)</label>
        <div class="flex flex-row w-full items-center justify-center">
            <div class="flex flex-col w-full">
                <input bind:value={metadataPath} id="s2results_metadata_file" class="w-full bg-gray-50 border-2 border-transparent text-gray-900 text-sm rounded-lg focus:border-amber-500 focus:outline-none focus:ring-0 disabled:opacity-75"/>
            </div>
            <div class="flex flex-col pl-3">
                <Button data={{ color: "#4d4d4d", icon: "folder_open", action: handleOpenMetadata }}/>
            </div>
        </div>
    </div>
</div>
<div class="flex flex-row w-full pb-1">
    <div class="flex flex-col w-full mx-3">
        <label for="s2results_cscan_file" class="block text-sm font-medium text-gray-900 dark:text-white" style="color:#4d4d4d;">C data file (utIndefa-C.dat)</label>
        <div class="flex flex-row w-full items-center justify-center">
            <div class="flex flex-col w-full">
                <input bind:value={cpath} id="s2results_cscan_file" class="w-full bg-gray-50 border-2 border-transparent text-gray-900 text-sm rounded-lg focus:border-amber-500 focus:outline-none focus:ring-0 disabled:opacity-75"/>
            </div>
            <div class="flex flex-col pl-3">
                <Button data={{ color: "#4d4d4d", icon: "folder_open", action: handleOpenCData }}/>
            </div>
        </div>
    </div>
</div>
<div class="flex flex-row w-full pb-3">
    <div class="flex flex-col w-full mx-3">
        <label for="s2results_ascan_file" class="block text-sm font-medium text-gray-900 dark:text-white" style="color:#4d4d4d;">A data file (utIndefa-A.dat)</label>
        <div class="flex flex-row w-full items-center justify-center">
            <div class="flex flex-col w-full">
                <input bind:value={apath} id="s2results_ascan_file" class="w-full bg-gray-50 border-2 border-transparent text-gray-900 text-sm rounded-lg focus:border-amber-500 focus:outline-none focus:ring-0 disabled:opacity-75"/>
            </div>
            <div class="flex flex-col pl-3">
                <Button data={{ color: "#4d4d4d", icon: "folder_open", action: handleOpenAData }}/>
            </div>
        </div>
    </div>
</div>
<div class="flex flex-row w-full pb-3">
    <div class="flex flex-col w-full mx-3">
        <label for="s2results_import_name" class="block text-sm font-medium text-gray-900 dark:text-white" style="color:#4d4d4d;">Import name</label>
        <input bind:value={name} id="s2results_import_name" class="w-full bg-gray-50 border-2 border-transparent text-gray-900 text-sm rounded-lg focus:border-amber-500 focus:outline-none focus:ring-0 disabled:opacity-75"/>
    </div>
</div>