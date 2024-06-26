<script lang="ts">
    import { createEventDispatcher, onDestroy } from "svelte";
    import { onMount } from 'svelte';
    import { ProjectSingleton } from "../lib/data/ProjectSingleton";
    import TreeNode from "../lib/models/tree/TreeNode";
    import { TreeInput } from "../lib/models/tree/TreeInput";
    import { TreeDropdown } from "../lib/models/tree/TreeDropdown";
    import { TreeCheckbox } from "../lib/models/tree/TreeCheckbox";
    import type { IValidator } from "../lib/models/validation/Validator";
    import type IValidationResult from "../lib/models/validation/ValidationResult";

    export let node: TreeNode | TreeInput | TreeDropdown | TreeCheckbox
    export let parentRef: string = ""
    export let kernelValidator: IValidator | null = null
    export let parametricEnabled: boolean

    let validationResult: IValidationResult | null = { isValid: true, isDisabled: false, message: null }
    
	const toggleExpansion = () => {
        if (node.expanded === null) return
		node.expanded = !node.expanded
	}
	$: arrowDown = node?.expanded

    let ulCssPadding: any

    if (node?.padding) {
        ulCssPadding = "ul-with-padding"
    } else {
        ulCssPadding = "ul-without-padding"
    }

    const handleChangedValue = () => {
        ProjectSingleton.GetInstance().ForceRefresh()
    }

    let unsubscribe = ProjectSingleton.GetInstance().Subscribe(() => {
        // Perform validation
        if (kernelValidator && (node instanceof TreeInput || node instanceof TreeCheckbox || node instanceof TreeDropdown)) {
            validationResult = kernelValidator.Validate((parentRef + node.name).replace(/\W/g, ""), node.value)
        }
        // Trigger a re-render of node
        node = node
    })

    onMount(() => {
        // Trigger a tree refresh before checking if the validator is present
        ProjectSingleton.GetInstance().ForceRefresh()

        // Artificial delay to allow the tree to be refreshed
        setTimeout(() => {
            if (kernelValidator && (node instanceof TreeInput || node instanceof TreeCheckbox || node instanceof TreeDropdown)) {
                validationResult = kernelValidator.Validate((parentRef + node.name).replace(/\W/g, ""), node.value)
            }
        }, 50)
    })

    onDestroy(() => {
        unsubscribe()
    })
</script>

<ul class={ulCssPadding}>
	<li>
		{#if node instanceof TreeNode && 
        !(node instanceof TreeInput) && 
        !(node instanceof TreeDropdown) && 
        !(node instanceof TreeCheckbox)}
            {#if node.expanded !== null}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<span class="whitespace-nowrap" style="font-size:16px;" on:click={toggleExpansion}>
				<span class="arrow whitespace-nowrap" class:arrowDown>&#x25b6</span>
				{node.name}
			</span>
            {/if}
			{#if (node.expanded || node.expanded === null) && node.children}
				{#each Object.entries(node.children) as [k, v]}
					<svelte:self node={v} parentRef={(parentRef !== 'Root:' ? parentRef : '') + node.name + ":"} bind:kernelValidator={kernelValidator} bind:parametricEnabled={parametricEnabled}/> <!-- data = {} -> data.method -->
				{/each}
			{/if}
        {:else if node instanceof TreeInput && node.parametric == true && parametricEnabled}
            <div class="flex flex-row disabled:opacity-75 w-full"> <!-- disabled={treeDisabled} -->
                <span style="font-family:'Material Icons'; font-size:20px;">tag</span>
                <span class="pl-1 whitespace-nowrap" style="font-size:16px;">{node.name}</span>
                <input bind:value={node.value} type="number" step="any" class="pl-1 ml-auto w-16 bg-gray-50 border text-gray-900 text-sm rounded-lg disabled:opacity-75 
                {!validationResult?.isValid ? 'ring-2 ring-red-300' : ''}" disabled={validationResult?.isDisabled} placeholder="0" required on:change={handleChangedValue}>
                <input bind:value={node.end} type="number" step="any" class="pl-1 w-16 bg-gray-50 border text-gray-900 text-sm rounded-lg disabled:opacity-75 
                {!validationResult?.isValid ? 'ring-2 ring-red-300' : ''}" disabled={validationResult?.isDisabled} placeholder="0" required on:change={handleChangedValue}>
                <input bind:value={node.increment} type="number" step="any" class="pl-1 w-12 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-75" disabled={validationResult?.isDisabled} placeholder="0" required on:change={handleChangedValue}>
            </div>
        {:else if node instanceof TreeInput && (node.parametric == false || !parametricEnabled) }
            <div class="flex flex-row disabled:opacity-75 w-full"> <!-- disabled={treeDisabled} -->
                <span style="font-family:'Material Icons'; font-size:20px;">tag</span>
                <span class="pl-1 whitespace-nowrap" style="font-size:16px;">{node.name}</span>
                <input bind:value={node.value} type="number" step="any" class="pl-1 my-0.5 ml-auto w-16 bg-gray-50  text-gray-900 text-sm rounded-lg disabled:opacity-75 focus:outline-none
                {!validationResult?.isValid ? 'ring-2 ring-red-300' : ''}" 
                disabled={validationResult?.isDisabled} placeholder="0" required on:change={handleChangedValue}>
            </div>
        {:else if node instanceof TreeCheckbox}
        <div class="flex flex-row">
            <span style="font-family:'Material Icons'; font-size:20px;">check_box</span>
            <span class="pl-1 whitespace-nowrap" style="font-size:16px;">{node.name}</span>
            <input bind:checked={node.value} type="checkbox" class="pl-1 ml-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-75" disabled={validationResult?.isDisabled} required on:change={handleChangedValue}>
        </div>
        {:else if node instanceof TreeDropdown}
        <div class="flex flex-row">
            <span style="font-family:'Material Icons'; font-size:20px;">list</span>
            <span class="pl-1 whitespace-nowrap" style="font-size:16px;">{node.name}</span>
            <select bind:value={node.value} class="pl-1 ml-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-75" disabled={validationResult?.isDisabled} required on:change={handleChangedValue}> 
                {#each node.options as opt}
                <option value={opt.value}>{opt.text}</option>
                {/each}
            </select>
        </div>
		{/if}
	</li>
</ul>

<style>
    .ul-without-padding {
		margin: 0;
		list-style: none;
		user-select: none;
        color: #4d4d4d;
    }
	.ul-with-padding {
		margin: 0;
		list-style: none;
		padding-left: 1.2rem; 
		user-select: none;
        color: #4d4d4d;
	}
    .no-arrow { padding-left: 0.6rem; }
	.arrow {
		cursor: pointer;
		display: inline-block;
	}
	.arrowDown { transform: rotate(90deg); }
</style>