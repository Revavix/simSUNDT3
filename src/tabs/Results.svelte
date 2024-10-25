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
    import { LoadingState, Rectification, type Metadata } from '../lib/models/Result';
    import { Grayscale, Magma, Parula, Rainbow, UltraVision } from '../lib/plotting/Colorscales';
    import { LoggingSingleton } from '../lib/data/LoggingSingleton';
    import { LoggingLevel } from '../lib/models/Logging';
    import { readTextFile } from '@tauri-apps/plugin-fs';
    import { Deserialize } from '../lib/tree/Utils';
    import { cScanLoadedData } from '../lib/data/Stores';
    import { aScanCursor, bScanCursor, cScanCursor, dScanCursor } from '../lib/data/stores/Cursors';
    import { remove, BaseDirectory } from '@tauri-apps/plugin-fs';
    
    export let projectSingleton: ProjectSingleton = ProjectSingleton.GetInstance()

    let loading: LoadingState = LoadingState.OK
    let interpolationOn: boolean = false
    let rectification: Rectification = Rectification.UNRECTIFIED
    let tests = projectSingleton.Postprocessor
    let selectedTest: number = 0
    let selectedTestSubIndex: number = 0
    let largeDataSet: boolean = false
    let selectedColorscale = UltraVision

    let aPlotComponent: APlot | null = null
    let bPlotComponent: BPlot | null = null
    let cPlotComponent: CPlot | null = null
    let dPlotComponent: DPlot | null = null

    onMount(() => {
        selectedTest = projectSingleton.Postprocessor.length - 1
        handleSubtestChange()
    })

    const handleSubtestChange = () => {
        loading = LoadingState.LOADING

        if (projectSingleton.Postprocessor.length == 0) {
            loadedMetadata.set(undefined)
            return
        }

        let interval = setInterval(() => {
            if (aPlotComponent?.isLoaded() && bPlotComponent?.isLoaded() && cPlotComponent?.isLoaded() && dPlotComponent?.isLoaded()) {
                invoke('commands_results_parse_metadata', { path: projectSingleton.Postprocessor[selectedTest].runs[selectedTestSubIndex].path + "\\utIndefa.txt" }).then((v: any) => {
                    let metadata = v as Metadata
                    metadata.path = projectSingleton.Postprocessor[selectedTest].runs[selectedTestSubIndex].path
                    loadedMetadata.set(metadata)

                    let columns = (Math.abs(metadata.coordinates.x.end) + Math.abs(metadata.coordinates.x.start)) / metadata.coordinates.x.increment
                    let rows = (Math.abs(metadata.coordinates.y.end) + Math.abs(metadata.coordinates.y.start)) / metadata.coordinates.y.increment
                    largeDataSet = columns * rows > 6400 ? true : false
                    loading = LoadingState.OK
                }).catch((e) => {
                    loading = LoadingState.INVALID
                    loadedMetadata.set(undefined)
                    console.error(e)

                })
                clearInterval(interval)
            }
        }, 100)
        setTimeout(() => {
            clearInterval(interval)
        }, 10000)
    }

    const handlePurgeTest = () => {
        if (projectSingleton.Postprocessor.length == 0) return

        // Remove the folder if the path exists and then remove the test from the projectSingleton postprocessor object
        remove(projectSingleton.Postprocessor[selectedTest].runs[selectedTestSubIndex].path).catch(() => {}).finally(() => {
            if (projectSingleton.Path) {
                // Remove the test from the projectSingleton and save the project
                projectSingleton.rmPostprocessorData(selectedTest)
                tests = projectSingleton.Postprocessor
                selectedTest = tests.length - 1
                projectSingleton.Save(projectSingleton.Path)

                // Trigger a subtest change to update the view
                handleSubtestChange()
            }
        })
    }

    const handleInspect = () => {
        const folder = projectSingleton.Postprocessor[selectedTest].runs[selectedTestSubIndex].path
        let cmd = Command.create("notepad", folder + "\\utIndefa.txt")
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
        console.log("Test")
        // Return if keys are not 37-40
        if (ev.keyCode < 37 || ev.keyCode > 40 || loading === LoadingState.INVALID || loading === LoadingState.LOADING || $loadedMetadata === undefined) return

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

    let convertColorscaleToCssColors = (colorscale: Array<any>) => {
        let css = ''
        colorscale.map((entry, index) => index < colorscale.length-1 ? css += entry[1] + ',' : css += entry[1])

        return css
    }
</script>

<svelte:window on:keydown|preventDefault={onKeyDown}/>
<div id="postprocessor-tab">
    <div class="flex flex-row shadow-lg rounded-lg px-2 mt-2 bg-base-100 w-full h-24" style="z-index: 50; position: relative">
        <div class="flex flex-col w-60 pt-2">
            <div class="flex flex-row w-full">
                <div class="flex flex-col w-full">
                    <select bind:value={selectedTest} on:change={handleSubtestChange} class="select select-secondary select-xs w-full max-w-xs focus:outline-none rounded-lg {loading === LoadingState.INVALID ? 'focus:border focus:border-error border border-error' : ''}">
                        {#each tests as data, i}
                            <option value="{i}">{data.name} ({data.timestamp?.toLocaleString()})</option>
                        {/each}
                    </select>
                </div>
                <div class="flex flex-col ml-1">
                    <div class="tooltip tooltip-bottom" data-tip="Remove test from project">
                        <button class="hover:bg-neutral text-secondary rounded outline outline-1 outline-secondary p-0.5" style="font-size:10px" on:click={handlePurgeTest}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
                        </button>
                    </div>
                </div>
                <div class="flex flex-col ml-1">
                    <div class="tooltip tooltip-right" data-tip="Inspect test parameters">
                        <button class="hover:bg-neutral text-secondary rounded outline outline-1 outline-secondary p-0.5" style="font-size:10px" on:click={handleInspect}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M11.25 13.5q.95 0 1.6-.65t.65-1.6t-.65-1.6t-1.6-.65t-1.6.65t-.65 1.6t.65 1.6t1.6.65m4.825 4l-2.625-2.625q-.5.325-1.062.475t-1.138.15q-1.775 0-3.012-1.237T7 11.25t1.238-3.012T11.25 7t3.013 1.238T15.5 11.25q0 .575-.162 1.138t-.488 1.062l2.65 2.65zM5 21q-.825 0-1.412-.587T3 19v-4h2v4h4v2zm10 0v-2h4v-4h2v4q0 .825-.587 1.413T19 21zM3 9V5q0-.825.588-1.412T5 3h4v2H5v4zm16 0V5h-4V3h4q.825 0 1.413.588T21 5v4z"/></svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex flex-row w-full items-center">
                <div class="flex flex-col w-16">
                    <select bind:value={selectedTestSubIndex} on:change={handleSubtestChange} class="select select-secondary select-xs w-full max-w-xs focus:outline-none rounded-lg">
                        {#if tests[selectedTest]?.runs.length > 0}
                            {#each tests[selectedTest].runs as data, i}
                                <option value="{i}">{i}</option>
                            {/each}
                        {/if}
                    </select>
                </div>
                <div class="flex flex-col -mt-4">
                    {#if loading === LoadingState.INVALID}
                    <p class="text-error text-xs">Loaded data is invalid</p>
                    {/if}
                </div>
                <div class="flex flex-col ml-auto">
                    <div class="tooltip tooltip-right" data-tip="Import selected test to preprocessor">
                        <button class="hover:bg-neutral text-secondary rounded outline outline-1 outline-secondary p-0.5" style="font-size:10px" on:click={handleImportToPreprocessor}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m14 12l-4-4v3H2v2h8v3m10 2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3h2V6h12v12H6v-3H4v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2"/></svg>
                        </button>
                    </div>
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
                <div class="flex flex-row w-full">
                    <button class="hover:bg-neutral text-secondary rounded outline outline-1 outline-secondary p-0.5 {rectification === Rectification.UNRECTIFIED ? 'bg-neutral' : ''}" on:click={() => rectification = Rectification.UNRECTIFIED}>
                        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <polyline points="22.5 12 17.42 12 17.42 22.11 11.56 22.11 11.56 12 11.56 12 11.56 1.89 5.24 1.89 5.24 12.06 1.5 12.06" stroke="currentColor" style="fill: none; stroke-miterlimit: 10; stroke-width: 2px;"/>
                        </svg>
                    </button>
                    <button class="ml-1 hover:bg-neutral text-secondary rounded outline outline-1 outline-secondary p-0.5 {rectification === Rectification.FULLWAVE ? 'bg-neutral' : ''}" on:click={() => rectification = Rectification.FULLWAVE}>
                        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <polyline points="22.48 17.02 17.5 17.05 17.5 6.95 6.5 6.91 6.5 17.09 1.52 17.09" stroke="currentColor" style="fill: none; stroke-miterlimit: 10; stroke-width: 2px;"/>
                        </svg>
                    </button>
                    <button class="ml-1 hover:bg-neutral text-secondary rounded outline outline-1 outline-secondary p-0.5 {rectification === Rectification.HALFWAVE_NEG ? 'bg-neutral' : ''}" on:click={() => rectification = Rectification.HALFWAVE_NEG}>
                        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g>
                                <line x1="12" y1="12" x2="12" y2="11" stroke="currentColor" style="fill: none; stroke-miterlimit: 10; stroke-width: 2px;"/>
                                <line x1="12" y1="9.38" x2="12" y2="3.7" stroke="currentColor" style="fill: none; stroke-dasharray: 1.62 1.62; stroke-miterlimit: 10; stroke-width: 2px;"/>
                                <polyline points="12 2.89 12 1.89 11 1.89" stroke="currentColor" style="fill: none; stroke-miterlimit: 10; stroke-width: 2px;"/>
                                <line x1="9.5" y1="1.89" x2="7.25" y2="1.89" stroke="currentColor" style="fill: none; stroke-dasharray: 1.5 1.5; stroke-miterlimit: 10; stroke-width: 2px;"/>
                                <polyline points="6.5 1.89 5.5 1.89 5.5 2.89" stroke="currentColor" style="fill: none; stroke-miterlimit: 10; stroke-width: 2px;"/>
                                <line x1="5.5" y1="4.53" x2="5.5" y2="10.25" stroke="currentColor" style="fill: none; stroke-dasharray: 1.63 1.63; stroke-miterlimit: 10; stroke-width: 2px;"/>
                                <polyline points="5.5 11.06 5.5 12.06 4.5 12.06" stroke="currentColor" style="fill: none; stroke-miterlimit: 10; stroke-width: 2px;"/>
                                <line x1="2.5" y1="12.06" x2="1.5" y2="12.06" stroke="currentColor" style="fill: none; stroke-miterlimit: 10; stroke-width: 2px;"/>
                              </g>
                              <polyline points="22.5 12 18.5 12 18.5 22.11 12 22.11 12 12" stroke="currentColor" style="fill: none; stroke-miterlimit: 10; stroke-width: 2px;"/>
                        </svg>
                    </button>
                    <button class="ml-1 hover:bg-neutral text-secondary rounded outline outline-1 outline-secondary p-0.5 {rectification === Rectification.HALFWAVE_POS ? 'bg-neutral' : ''}" on:click={() => rectification = Rectification.HALFWAVE_POS}>
                        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <polyline points="12 12 12 1.89 5.5 1.89 5.5 12.06 1.5 12.06" stroke="currentColor" style="fill: none; stroke-miterlimit: 10; stroke-width: 2px;"/>
                            <g>
                              <line x1="22.5" y1="12" x2="21.5" y2="12" stroke="currentColor" style="fill: none; stroke-miterlimit: 10; stroke-width: 2px;"/>
                              <polyline points="19.5 12 18.5 12 18.5 13" stroke="currentColor" style="fill: none; stroke-miterlimit: 10; stroke-width: 2px;"/>
                              <line x1="18.5" y1="14.62" x2="18.5" y2="20.3" stroke="currentColor" style="fill: none; stroke-dasharray: 1.62 1.62; stroke-miterlimit: 10; stroke-width: 2px;"/>
                              <polyline points="18.5 21.11 18.5 22.11 17.5 22.11" stroke="currentColor" style="fill: none; stroke-miterlimit: 10; stroke-width: 2px;"/>
                              <line x1="16" y1="22.11" x2="13.75" y2="22.11" stroke="currentColor" style="fill: none; stroke-dasharray: 1.5 1.5; stroke-miterlimit: 10; stroke-width: 2px;"/>
                              <polyline points="13 22.11 12 22.11 12 21.11" stroke="currentColor" style="fill: none; stroke-miterlimit: 10; stroke-width: 2px;"/>
                              <line x1="12" y1="19.49" x2="12" y2="13.81" stroke="currentColor" style="fill: none; stroke-dasharray: 1.62 1.62; stroke-miterlimit: 10; stroke-width: 2px;"/>
                              <line x1="12" y1="13" x2="12" y2="12" stroke="currentColor" style="fill: none; stroke-miterlimit: 10; stroke-width: 2px;"/>
                            </g>
                        </svg>
                    </button>
                    <div class="flex flex-col">
                        <div class="flex flex-row dropdown dropdown-bottom">
                            <div tabindex="0" role="button" class="hover:bg-neutral text-secondary rounded outline outline-1 outline-secondary ml-1">
                                <div class="flex flex-row">
                                    <div class="text-secondary" style="font-family:'Material Icons'; font-size:20px">
                                        palette
                                    </div>
                                    <div class="text-secondary" style="font-family:'Material Icons'; font-size:20px">
                                        arrow_drop_down
                                    </div>
                                </div>
                            </div>
                            <ul class="dropdown-content bg-base-100 rounded w-52 shadow">
                                <button class="flex flex-col w-full hover:bg-neutral rounded-t p-1" on:click={() => selectedColorscale = UltraVision}>
                                    <p class="text-secondary font-normal text-sm">Ultravision</p>
                                    <div class="w-full h-5 rounded" style="background: linear-gradient(to right, {convertColorscaleToCssColors(UltraVision)});"/>
                                </button>
                                <button class="flex flex-col w-full hover:bg-neutral rounded p-1" on:click={() => selectedColorscale = Grayscale}>
                                    <p class="text-secondary font-normal text-sm">Grayscale</p>
                                    <div class="w-full h-5 rounded" style="background: linear-gradient(to right, {convertColorscaleToCssColors(Grayscale)});"/>
                                </button>
                                <button class="flex flex-col w-full hover:bg-neutral rounded p-1" on:click={() => selectedColorscale = Rainbow}>
                                    <p class="text-secondary font-normal text-sm">Rainbow</p>
                                    <div class="w-full h-5 rounded" style="background: linear-gradient(to right, {convertColorscaleToCssColors(Rainbow)});"/>
                                </button>
                                <button class="flex flex-col w-full hover:bg-neutral rounded p-1" on:click={() => selectedColorscale = Magma}>
                                    <p class="text-secondary font-normal text-sm">Magma</p>
                                    <div class="w-full h-5 rounded" style="background: linear-gradient(to right, {convertColorscaleToCssColors(Magma)});"/>
                                </button>
                                <button class="flex flex-col w-full hover:bg-neutral rounded-b p-1" on:click={() => selectedColorscale = Parula}>
                                    <p class="text-secondary font-normal text-sm">Parula</p>
                                    <div class="w-full h-5 rounded" style="background: linear-gradient(to right, {convertColorscaleToCssColors(Parula)});"/>
                                </button>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="flex flex-row">
                    <div class="flex flex-col">
                        <p class="text-xs pt-1">Interpolation</p>
                        <input type="checkbox" bind:checked={interpolationOn} class="toggle toggle-sm toggle-secondary"/>
                    </div>
                </div>
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
    </div>
    <!-- Interaction Panel -->
    <div class="w-full grid grid-cols-2 gap-2 mt-2" style="z-index: 1; height: calc(100vh - 190px);">
        <div class="rounded-md bg-base-100 flex-col" style="z-index: 5;">
            <CPlot bind:this={cPlotComponent}
                bind:interpolationOn={interpolationOn} 
                bind:colorscale={selectedColorscale}
                />
        </div>
        <div class="rounded-md bg-base-100 flex-col px-2" style="z-index: 5;">
            <APlot bind:this={aPlotComponent} 
            bind:rectification={rectification}/>
        </div>
        <div class="rounded-md bg-base-100 flex-col px-2 pb-2" style="z-index: 5;">
            <BPlot bind:this={bPlotComponent} 
                bind:rectification={rectification} 
                bind:interpolationOn={interpolationOn} 
                bind:colorscale={selectedColorscale}
            />
        </div>
        <div class="rounded-md bg-base-100 px-2" style="z-index: 5;">
            <DPlot bind:this={dPlotComponent} 
                bind:rectification={rectification} 
                bind:interpolationOn={interpolationOn} 
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