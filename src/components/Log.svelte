<script lang="ts">
    import { onDestroy, onMount, tick } from 'svelte';
    import { LoggingSingleton } from '../lib/data/LoggingSingleton';
    import type { LoggingEntry } from '../lib/models/Logging';
    import Button from './Button.svelte';
    import type IValidationError from '../lib/models/validation/ValidationError';
    import { ProjectSingleton } from '../lib/data/ProjectSingleton';
    import type { Project } from '../lib/models/Project';
    import { TreeInput } from '../lib/models/tree/TreeInput';
    import type { IValidator } from '../lib/models/validation/Validator';

    export let kernelValidator: IValidator | null = null

    let projectSingleton: ProjectSingleton = ProjectSingleton.GetInstance()
    let loggingSingleton: LoggingSingleton = LoggingSingleton.GetInstance()
    let minimized: boolean = false
    let logs: Array<LoggingEntry> = []
    let log: HTMLDivElement
    let errors: Array<IValidationError> = []
    let activePage: "output" | "errors" = "output"

    function updateMinState() {
        if (minimized == true) {
            minimized = false
        } else {
            minimized = true
        } 
    }

    let copyButton = {
        label: "",
        color: "#4d4d4d",
        icon: "content_copy",
        action: () => {},
        disabled: false
    }

    let minButton = {
        label: "",
        color: "#4d4d4d",
        icon: "expand_less",
        action: updateMinState,
        disabled: false
    }

    let maxButton = {
        label: "",
        color: "#4d4d4d",
        icon: "expand_more",
        action: updateMinState,
        disabled: false
    }

    onMount(() => {
        setTimeout(() => {
            projectSingleton.ForceRefresh()
        }, 50)
    })

    let unsubscribeProject = projectSingleton.Subscribe(async (v: Project) => {
        if (kernelValidator === null) return
        errors = []

        function recurseChildren(parentName: string, children: any[]) {
            for (let child of children) {
                let result = kernelValidator?.Validate((parentName + ":" + child.name).replace(/\W/g, ""), child.value)

                if (result?.isValid === false) {
                    errors.push({
                        type: "ERROR",
                        message: "[" + (parentName + ":" + child.name).replace(/:/g, " -> ") + "] " + result.message
                    })
                }

                if (child.children) {
                    recurseChildren((parentName === "" ? parentName : parentName + ":") + child.name, child.children);
                }
            }
        }
        
        recurseChildren("", v.data.preprocessor.tree?.children || []);
    })

    let unsubscribeLogging = loggingSingleton.Subscribe(async (v: LoggingEntry[]) => {
        logs = v
        await tick()
        scrollToBottom(log)
    });

    onDestroy(() => {
        unsubscribeProject()
        unsubscribeLogging()
    })

    const scrollToBottom = async (node: any) => {
        node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
    };
</script>

<div class="flex flex-col bg-stone-300 rounded-lg shadow-lg" style="z-index: 4;">
    <div class="flex flex-row px-2 pt-1 items-center">
        <button class="flex flex-col bg-stone-600 rounded-lg text-xs py-0.5 px-2 {activePage === "output" ? 'opacity-100' : 'opacity-70'}" on:click={() => {activePage = "output"}}>
            Output ({logs.length})
        </button>
        <button class="flex flex-col bg-stone-600 rounded-lg text-xs py-0.5 px-2 ml-1 {activePage === "errors" ? 'opacity-100' : 'opacity-70'}" on:click={() => {activePage = "errors"}}>
            Errors ({errors.length})
        </button>
        <div class="flex flex-col ml-auto">
            <Button data={copyButton}/>
        </div>
        <div class="flex flex-col ml-2">
            {#if minimized}
            <Button data={minButton}/>
            {:else}
            <Button data={maxButton}/>
            {/if}
        </div>
    </div>
    {#if minimized == false}
    <!--<div class="bg-gradient-to-r from-yellow-600 ... h-0.5"></div>-->
        {#if activePage == "output"}
            <div bind:this={log} class="max-h-48 border border-stone-400 rounded-md m-2 h-48" style="padding-left: 0px; overflow: auto">
                {#each logs as item}
                    <div class="inline-block px-1">
                        <div class="inline item-icon align-middle " style="color:{item.color}">
                            {item.icon}
                        </div>
                        <div class="inline item-text pl-1 font-bold whitespace-nowrap">
                            [{new Date().toLocaleString()}]:
                        </div>
                        <div class="inline item-text">
                            {item.message}
                        </div>
                    </div>
                {/each}
            </div>
        {:else if activePage == "errors"}
        <div class="max-h-48 border border-stone-400 rounded-md m-2 h-48" style="padding-left: 0px; overflow: auto">
            {#each errors as item}
                <div class="inline-block px-1">
                    <div class="inline item-icon align-middle " style="color:{item.type === "ERROR" ? "red" : "orange"}">
                        {item.type === "ERROR" ? "error" : "warning"}
                    </div>
                    <div class="inline item-text">
                        {item.message}
                    </div>
                </div>
            {/each}
        </div>
        {/if}
    {/if}
</div>

<style>
    .item-icon
    {
        font-family:'Material Icons'; 
        font-size:16px;
    }
    .item-text
    {
        font-size: 14px;
        color:#4d4d4d
    }
    ::-webkit-scrollbar {
        width: 14px;
        height: 14px;
    }
  ::-webkit-scrollbar-track {
        background: rgb(168, 162, 158);
        border-radius: 10px;
    }
  ::-webkit-scrollbar-thumb {
        background: #4d4d4d;
        border-radius: 10px;
    }
</style>