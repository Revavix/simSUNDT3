<script lang="ts">
    import APlot from '../components/plotting/APlot.svelte';
    import CPlot from '../components/plotting/CPlot.svelte';
    import BPlot from '../components/plotting/BPlot.svelte';
    import DPlot from '../components/plotting/DPlot.svelte';
    import { onMount } from 'svelte';
    import { activePlot, activeTab, loadedMetadata } from '../lib/data/Stores';
    import { ProjectSingleton } from '../lib/data/ProjectSingleton';
    import { Command } from '@tauri-apps/plugin-shell'
    import { invoke } from '@tauri-apps/api/core'
    import { Interpolation, Rectification, type Metadata } from '../lib/models/Result';
    import { Grayscale, Magma, Parula, Rainbow, UltraVision } from '../lib/plotting/Colorscales';
    import { LoggingSingleton } from '../lib/data/LoggingSingleton';
    import { LoggingLevel } from '../lib/models/Logging';
    import { readTextFile } from '@tauri-apps/plugin-fs';
    import { Deserialize } from '../lib/tree/Utils';
    import { get } from 'svelte/store';
    import { cScanLoadedData } from '../lib/data/stores/Data';
    import { aScanCursor, bScanCursor, cScanCursor, dScanCursor } from '../lib/data/stores/Cursors';
    
    export let projectSingleton: ProjectSingleton = ProjectSingleton.GetInstance()

    let interpolation: Interpolation = Interpolation.OFF
    let rectification: Rectification = Rectification.UNRECTIFIED
    let selectedTest: number = 0
    let selectedTestSubIndex: number = 0
    let largeDataSet: boolean = false
    let selectedColorscale = UltraVision

    onMount(() => {
        selectedTest = projectSingleton.Postprocessor.length - 1
        handleSubtestChange()
    })

    const handleSubtestChange = () => {
        if (projectSingleton.Postprocessor.length == 0) {
            return
        }

        invoke('commands_results_parse_metadata', { path: projectSingleton.Postprocessor[selectedTest].runs[selectedTestSubIndex].path + "\\utIndefa.txt" }).then((v: any) => {
            let metadata = v as Metadata
            metadata.path = projectSingleton.Postprocessor[selectedTest].runs[selectedTestSubIndex].path
            loadedMetadata.set(metadata)

            // Check if large dataset
            let columns = (Math.abs(metadata.coordinates.x.end) + Math.abs(metadata.coordinates.x.start)) / metadata.coordinates.x.increment
            let rows = (Math.abs(metadata.coordinates.y.end) + Math.abs(metadata.coordinates.y.start)) / metadata.coordinates.y.increment
            largeDataSet = columns * rows > 6400 ? true : false
        }).catch((e) => {
            console.error(e)
            // TODO: Add error feedback
        })
    }

    const handleInspect = () => {
        const folder = projectSingleton.Postprocessor[selectedTest].runs[selectedTestSubIndex].path
        let cmd = Command.create("notepad", folder + "/utIndefa")
        cmd.spawn()
    }

    const handleImportToPreprocessor = () => {
        // Import to preprocessor using the .sscache file stored in the run folder, throw an error if the file is not found
        readTextFile(projectSingleton.Postprocessor[selectedTest].runs[selectedTestSubIndex].path + "\\tree.sscache").then((v) => {
            let treeInput = JSON.parse(v)
            projectSingleton.ImportTree(Deserialize(treeInput))
            LoggingSingleton.GetInstance().Log(LoggingLevel.INFO, "Imported to preprocessor from .sscache file, using the run " + 
                projectSingleton.Postprocessor[selectedTest].name + 
                " ran on " + 
                new Date(projectSingleton.Postprocessor[selectedTest].timestamp).toLocaleDateString() + 
                ", at " +
                new Date(projectSingleton.Postprocessor[selectedTest].timestamp).toLocaleTimeString() +
                " as the base tree."
            )
        }).catch((e) => {
            LoggingSingleton.GetInstance().Log(LoggingLevel.WARNING, "Failed to import to preprocessor, .sscache file not found, error (" + e + ")")
        }).finally(() => {
            // Change page to preprocessor
            activeTab.set("Preprocessor")
        })
    }

    
    let onKeyDown = (ev: any) => {
        // Return if keys are not 37-40
        if (ev.keyCode < 37 || ev.keyCode > 40) return

        if ($activePlot === 'A') {
            const movements: Record<number, { index: number }> = {
                39: { index: $aScanCursor.xIndex + 1 },
                37: { index: $aScanCursor.xIndex - 1 }
            }

            if (movements[ev.keyCode].index >= 0 || movements[ev.keyCode].index <= $cScanLoadedData.samples) {
                aScanCursor.set({ xIndex: movements[ev.keyCode].index })
                bScanCursor.update(cursor => { return { x: cursor?.x, yIndex: movements[ev.keyCode].index } })
                dScanCursor.update(cursor => { return { x: cursor?.x, yIndex: movements[ev.keyCode].index } })
            }
        } else if ($activePlot === 'B') {
            const movements: Record<number, { col: number, index: number }> = {
                40: { col: $cScanLoadedData.currentCol, index: $aScanCursor.xIndex + 1 },
                39: { col: $cScanLoadedData.currentCol + Math.sign($loadedMetadata.coordinates.x.increment), index: $aScanCursor.xIndex },
                38: { col: $cScanLoadedData.currentCol, index: $aScanCursor.xIndex - 1 },
                37: { col: $cScanLoadedData.currentCol - Math.sign($loadedMetadata.coordinates.x.increment), index: $aScanCursor.xIndex }
            }

            let found = $cScanLoadedData.content.find((cd) => {
                let x = $loadedMetadata.coordinates.x.start + (cd.x * $loadedMetadata.coordinates.x.increment)
                let xd = $loadedMetadata.coordinates.x.start + (movements[ev.keyCode].col * $loadedMetadata.coordinates.x.increment)
                return x === xd
            })

            if ((movements[ev.keyCode].index >= 0 || movements[ev.keyCode].index <= $cScanLoadedData.samples) && found) {
                cScanLoadedData.update(data => {
                    data.currentCol = movements[ev.keyCode].col
                    return data
                })
                cScanCursor.update(cursor => {
                    cursor.x = $loadedMetadata.coordinates.x.start + (movements[ev.keyCode].col * $loadedMetadata.coordinates.x.increment)
                    return cursor
                })
                dScanCursor.update(cursor => { return { 
                    x: cursor.x, 
                    yIndex: movements[ev.keyCode].index % $cScanLoadedData.samples 
                }})
                bScanCursor.set({ 
                    x: $loadedMetadata.coordinates.x.start + (movements[ev.keyCode].col * $loadedMetadata.coordinates.x.increment), 
                    yIndex: movements[ev.keyCode].index % $cScanLoadedData.samples
                })
                aScanCursor.set({ 
                    xIndex: movements[ev.keyCode].index % $cScanLoadedData.samples
                })
            }
        } else if ($activePlot === 'C') {
            const movements: Record<number, { col: number, row: number }> = {
                40: { col: $cScanLoadedData.currentCol, row: $cScanLoadedData.currentRow - Math.sign($loadedMetadata.coordinates.y.increment) },
                39: { col: $cScanLoadedData.currentCol + Math.sign($loadedMetadata.coordinates.x.increment), row: $cScanLoadedData.currentRow },
                38: { col: $cScanLoadedData.currentCol, row: $cScanLoadedData.currentRow + Math.sign($loadedMetadata.coordinates.y.increment) },
                37: { col: $cScanLoadedData.currentCol - Math.sign($loadedMetadata.coordinates.x.increment), row: $cScanLoadedData.currentRow }
            }

            // Convert column to x and row to y and sample the data at the new position to check if it is valid, and if so update the cursor
            let found = $cScanLoadedData.content.find((cd) => {
                let x = $loadedMetadata.coordinates.x.start + (cd.x * $loadedMetadata.coordinates.x.increment)
                let y = $loadedMetadata.coordinates.y.start + (cd.y * $loadedMetadata.coordinates.y.increment)
                let xd = $loadedMetadata.coordinates.x.start + (movements[ev.keyCode].col * $loadedMetadata.coordinates.x.increment)
                let yd = $loadedMetadata.coordinates.y.start + (movements[ev.keyCode].row * $loadedMetadata.coordinates.y.increment)
                return x === xd && y === yd 
            })

            if (found !== undefined) {
                cScanLoadedData.update(data => {
                    data.currentCol = movements[ev.keyCode].col
                    data.currentRow = movements[ev.keyCode].row
                    return data
                })
                cScanCursor.update(cursor => {
                    cursor.x = $loadedMetadata.coordinates.x.start + (movements[ev.keyCode].col * $loadedMetadata.coordinates.x.increment)
                    cursor.y = $loadedMetadata.coordinates.y.start + (movements[ev.keyCode].row * $loadedMetadata.coordinates.y.increment)
                    return cursor
                })
                aScanCursor.update(cursor => {
                    cursor.xIndex = cursor.xIndex
                    return cursor
                })
                bScanCursor.update(cursor => {
                    cursor.x = $loadedMetadata.coordinates.x.start + (movements[ev.keyCode].col * $loadedMetadata.coordinates.x.increment)
                    return cursor
                })
                dScanCursor.update(cursor => {
                    cursor.x = $loadedMetadata.coordinates.y.start + (movements[ev.keyCode].row * $loadedMetadata.coordinates.y.increment)
                    return cursor
                })
            }
        } else if ($activePlot === 'D') {
            const movements: Record<number, { row: number, index: number }> = {
                40: { row: $cScanLoadedData.currentRow, index: $aScanCursor.xIndex + 1 },
                39: { row: $cScanLoadedData.currentRow + Math.sign($loadedMetadata.coordinates.y.increment), index: $aScanCursor.xIndex },
                38: { row: $cScanLoadedData.currentRow, index: $aScanCursor.xIndex - 1 },
                37: { row: $cScanLoadedData.currentRow - Math.sign($loadedMetadata.coordinates.y.increment), index: $aScanCursor.xIndex }
            }

            let found = $cScanLoadedData.content.find((cd) => {
                let y = $loadedMetadata.coordinates.y.start + (cd.y * $loadedMetadata.coordinates.y.increment)
                let yd = $loadedMetadata.coordinates.y.start + (movements[ev.keyCode].row * $loadedMetadata.coordinates.y.increment)
                return y === yd 
            })

            if ((movements[ev.keyCode].index >= 0 || movements[ev.keyCode].index <= $cScanLoadedData.samples) && found) {
                cScanLoadedData.update(data => {
                    data.currentRow = movements[ev.keyCode].row
                    return data
                })
                cScanCursor.update(cursor => { return { 
                    x: cursor?.x, 
                    y: $loadedMetadata.coordinates.y.start + (movements[ev.keyCode].row * $loadedMetadata.coordinates.y.increment) 
                }})
                bScanCursor.update(cursor => { return { 
                    x: cursor?.x, 
                    yIndex: movements[ev.keyCode].index % $cScanLoadedData.samples
                }})
                dScanCursor.set({ 
                    x: $loadedMetadata.coordinates.y.start + (movements[ev.keyCode].row * $loadedMetadata.coordinates.y.increment), 
                    yIndex: movements[ev.keyCode].index % $cScanLoadedData.samples
                })
                aScanCursor.set({ 
                    xIndex: movements[ev.keyCode].index % $cScanLoadedData.samples 
                })
            }
        }
    }
</script>

<svelte:window on:keydown|preventDefault={onKeyDown}/>
<div id="postprocessor-tab">
    <div class="flex flex-row shadow-lg rounded-lg px-2 mt-2 bg-base-100 w-full h-24" style="z-index: 50; position: relative">
        <div class="flex flex-col w-60 pt-2">
            <div class="flex flex-row w-full items-center">
                <div class="flex flex-col w-full">
                    <select bind:value={selectedTest} on:change={handleSubtestChange} class="select select-secondary select-xs w-full max-w-xs focus:outline-none rounded-lg">
                        {#each projectSingleton.Postprocessor as data, i}
                            <option value="{i}">{data.name} ({data.timestamp?.toLocaleString()})</option>
                        {/each}
                    </select>
                </div>
                <div class="flex flex-col w-5/12 ml-1">
                    <select bind:value={selectedTestSubIndex} on:change={handleSubtestChange} class="select select-secondary select-xs w-full max-w-xs focus:outline-none rounded-lg">
                        {#if projectSingleton.Postprocessor.length > 0}
                            {#each projectSingleton.Postprocessor[selectedTest].runs as data, i}
                                <option value="{i}">{i}</option>
                            {/each}
                        {/if}
                    </select>
                </div>
                <div class="flex flex-col pl-1">
                    <button type="button" class="btn btn-primary btn-xs font-normal rounded-full" style="font-size:10px" on:click={handleInspect}>Inspect</button>
                </div>
            </div>
            <div class="flex flex-row w-full items-center pt-1">
                <div class="flex flex-col w-full">
                    <button type="button" class="btn btn-primary btn-xs font-normal rounded-full" style="font-size:10px" on:click={handleImportToPreprocessor}>Import to preprocessor</button>
                </div>
            </div>
            <div class="flex flex-row w-full justify-center h-full">
                <div class="flex flex-row select-none mt-auto text-base-content" style="font-size:10px;">
                Data
                </div>
            </div>
        </div>
        <div class="flex flex-col line-vert my-2 mx-4"/>
        <div class="flex flex-col w-40 pt-2 -space-y-1">
            <div class="flex flex-col w-full">
                <select bind:value={rectification} class="select select-secondary select-xs w-full max-w-xs focus:outline-none rounded-lg">
                    <option value={Rectification.UNRECTIFIED}>Unrectified</option>
                    <option value={Rectification.FULLWAVE}>Fullwave</option>
                    <option value={Rectification.HALFWAVE_POS}>Halfwave Positive</option>
                    <option value={Rectification.HALFWAVE_NEG}>Halfwave Negative</option>
                </select>
                <select bind:value={interpolation} class="select select-secondary select-xs w-full max-w-xs focus:outline-none mt-0.5 rounded-lg">
                    <option value={Interpolation.OFF}>No interpolation</option>
                    <option value={Interpolation.FAST}>Fast interpolation</option>
                    <option value={Interpolation.BEST}>Best interpolation</option>
                </select>
            </div>
            <div class="flex flex-col w-full h-full justify-end">
                <div class="flex flex-row select-none justify-center text-base-content" style="font-size:10px;">
                    <div class="flex flex-row">
                    Post-processing
                    </div>
                    {#if largeDataSet}
                    <div class="flex flex-row pl-1" style="font-family:'Material Icons'; font-size:12px; color:#ef4444;">
                        warning
                    </div>
                    {/if}
                </div>
            </div>
        </div>
        <div class="flex flex-col line-vert my-2 mx-4"/>
        <div class="flex flex-col w-28 pt-2 -space-y-1">
            <!-- Colorscale select -->
            <div class="flex flex-col w-full">
                <select bind:value={selectedColorscale} class="select select-secondary select-xs w-full max-w-xs focus:outline-none rounded-lg">
                    <option value={UltraVision}>Ultravision</option>
                    <option value={Grayscale}>Grayscale</option>
                    <option value={Rainbow}>Rainbow</option>
                    <option value={Magma}>Magma</option>
                    <option value={Parula}>Parula</option>
                </select>
            </div>
            <!-- Colorscale footer -->
            <div class="flex flex-col w-full h-full justify-end">
                <div class="flex flex-row select-none justify-center text-base-content" style="font-size:10px;">
                    <div class="flex flex-row">
                    Colorscale
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Interaction Panel -->

    <div class="w-full grid grid-cols-2 gap-2 mt-2" style="z-index: 50; height: calc(100vh - 190px);">
        <div class="rounded-md bg-base-100 flex-col" style="z-index: 50;">
            <CPlot bind:interpolation={interpolation} 
                bind:colorscale={selectedColorscale}
                />
        </div>
        <div class="rounded-md bg-base-100 flex-col px-2" style="z-index: 50;">
            <APlot bind:rectification={rectification}/>
        </div>
        <div class="rounded-md bg-base-100 flex-col px-2 pb-2" style="z-index: 50;">
            <BPlot bind:rectification={rectification} 
                bind:interpolation={interpolation} 
                bind:colorscale={selectedColorscale}
            />
        </div>
        <div class="rounded-md bg-base-100 px-2" style="z-index: 50;">
            <DPlot bind:rectification={rectification} 
                bind:interpolation={interpolation} 
                bind:colorscale={selectedColorscale}
            />
        </div>
    </div>
</div>

<style>
  .line-vert {
    border-left: 1px solid #7f7f7f;
  }
</style>