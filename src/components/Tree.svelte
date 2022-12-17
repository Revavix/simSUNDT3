<script context="module">
    const _expansionState = {
		/* treeNodeId: expanded <boolean> */
	}
</script>

<script lang="ts">
    import { slide } from 'svelte/transition'
    import { TreeExpandable, TreeSelect, TreeSelectMember, TreeNumber, TreeBool } from '../lib/treeDef'
	export let tree
    let treeLabel = tree['label']
    let treeValue = tree['value']
	let treeDisabled = tree['disabled']

	const toggleExpansion = () => {
		tree['expanded'] = !tree['expanded']
	}
	$: arrowDown = tree['expanded']

    let ulCssPadding = "ul-with-padding";

    if (tree['paddingOff'] == true)
    {
        ulCssPadding = "ul-without-padding"
    }
</script>

<ul class={ulCssPadding}>
	<li>
		{#if tree instanceof TreeExpandable}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<span on:click={toggleExpansion}>
				<span class="arrow" class:arrowDown>&#x25b6</span>
				{treeLabel}
			</span>
			{#if tree['expanded']}
				{#each treeValue as child}
					<svelte:self tree={child} />
				{/each}
			{/if}
        {:else if tree instanceof TreeNumber}
            <div class="flex flex-row disabled:opacity-75" disabled={treeDisabled}>
                <span style="font-family:'Material Icons'; font-size:24px;">tag</span>
                <span class="pl-1">{treeLabel}</span>
                <input bind:value={tree.value} type="number" class="pl-1 ml-auto w-16 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-75" disabled={treeDisabled} placeholder="0" required>
            </div>
        {:else if tree instanceof TreeBool}
        <div class="flex flex-row">
            <span style="font-family:'Material Icons'; font-size:24px;">check_box</span>
            <span class="pl-1">{treeLabel}</span>
            <input bind:checked={tree.value} type="checkbox" class="pl-1 ml-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-75" disabled={treeDisabled} required>
        </div>
        {:else if tree instanceof TreeSelect}
        <div class="flex flex-row">
            <span style="font-family:'Material Icons'; font-size:24px;">list</span>
            <span class="pl-1">{treeLabel}</span>
            <select bind:value={tree.selectedItem} class="pl-1 ml-auto bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:opacity-75" disabled={treeDisabled} required> 
                {#each treeValue as opt}
                <option value={opt.value}>{opt.displayName}</option>
                {/each}
            </select>
        </div>
		{:else}
			<span>
				<span class="no-arrow"/>
				{treeLabel}
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