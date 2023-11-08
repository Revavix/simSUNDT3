<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { onMount } from 'svelte';
    import { ProjectSingleton } from "../lib/data/ProjectSingleton";

    export let tree
    export let data
    export let pad
    export let parametricEnabled
    
	const toggleExpansion = () => {
		tree.expanded = !tree.expanded
	}
	$: arrowDown = tree.expanded

    let ulCssPadding

    if (pad) {
        ulCssPadding = "ul-with-padding"
    } else {
        ulCssPadding = "ul-without-padding"
    }

    onMount(() => {
        if (pad == "Root") {
            data = {}
        } else if (tree.type == "Number") {
            if (!data.hasOwnProperty("value")) {
                data.value = tree.default
            }
            if (!data.hasOwnProperty("end")) {
                data.end = tree.default
            }
            if (!data.hasOwnProperty("increment")) {
                data.increment = 1
            }
        } else if (tree.type == "Dropdown") {
            if (!data.hasOwnProperty("value")) {
                data.value = tree.values[0].value
            }
        } else if (tree.type == "Checkbox") {
            if (!data.hasOwnProperty("value")) {
                data.value = false
            }
        }
    })

    function getData(key) {
        if (!data.hasOwnProperty(key)) {
            data[key] = {}
        }

        return data[key]
    }

    const handleChangedValue = () => {
        ProjectSingleton.GetInstance().TriggerTreeUpdateSubscribers()
    }
</script>

<ul class={ulCssPadding}>
	<li>
        {#if tree.type == "Root"}
            {#each Object.entries(tree.children) as [k, v]}
                <svelte:self tree={v} data={getData(k)} pad={false} bind:parametricEnabled={parametricEnabled}/>
            {/each}
		{:else if tree.type == "Expandable"}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<span class="whitespace-nowrap" style="font-size:16px;" on:click={toggleExpansion}>
				<span class="arrow whitespace-nowrap" class:arrowDown>&#x25b6</span>
				{tree.name}
			</span>
			{#if tree.expanded}
				{#each Object.entries(tree.children) as [k, v]}
					<svelte:self tree={v} data={getData(k)} pad={true} bind:parametricEnabled={parametricEnabled}/> <!-- data = {} -> data.method -->
				{/each}
			{/if}
        {:else if tree.type == "Number" && tree.parametric == true && parametricEnabled}
            <div class="flex flex-row disabled:opacity-75 w-full"> <!-- disabled={treeDisabled} -->
                <span style="font-family:'Material Icons'; font-size:20px;">tag</span>
                <span class="pl-1 whitespace-nowrap" style="font-size:16px;">{tree.name}</span>
                <input bind:value={data.value} type="number" class="pl-1 ml-auto w-16 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-75" disabled={tree.disabled} placeholder="0" required on:change={handleChangedValue}>
                <input bind:value={data.end} type="number" class="pl-1 w-16 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-75" disabled={tree.disabled} placeholder="0" required on:change={handleChangedValue}>
                <input bind:value={data.increment} type="number" class="pl-1 w-12 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-75" disabled={tree.disabled} placeholder="0" required on:change={handleChangedValue}>
            </div>
        {:else if tree.type == "Number" && (tree.parametric == false || !parametricEnabled) }
            <div class="flex flex-row disabled:opacity-75 w-full"> <!-- disabled={treeDisabled} -->
                <span style="font-family:'Material Icons'; font-size:20px;">tag</span>
                <span class="pl-1 whitespace-nowrap" style="font-size:16px;">{tree.name}</span>
                <input bind:value={data.value} type="number" class="pl-1 ml-auto w-16 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-75" disabled={tree.disabled} placeholder="0" required on:change={handleChangedValue}>
            </div>
        {:else if tree.type == "Checkbox"}
        <div class="flex flex-row">
            <span style="font-family:'Material Icons'; font-size:20px;">check_box</span>
            <span class="pl-1 whitespace-nowrap" style="font-size:16px;">{tree.name}</span>
            <input bind:checked={data.value} type="checkbox" class="pl-1 ml-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-75" disabled={tree.disabled} required on:change={handleChangedValue}>
        </div>
        {:else if tree.type == "Dropdown"}
        <div class="flex flex-row">
            <span style="font-family:'Material Icons'; font-size:20px;">list</span>
            <span class="pl-1 whitespace-nowrap" style="font-size:16px;">{tree.name}</span>
            <select bind:value={data.value} class="pl-1 ml-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-75" disabled={tree.disabled} required on:change={handleChangedValue}> 
                {#each tree.values as opt}
                <option value={opt.value}>{opt.text}</option>
                {/each}
            </select>
        </div>
		{:else}
			<span>
				<span class="no-arrow whitespace-nowrap"/>
				{tree.name}
			</span>
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