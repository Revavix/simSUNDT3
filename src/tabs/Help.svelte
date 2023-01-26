<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { onMount } from 'svelte';

    // Used in all tab components to pass properties (supresses dev console warning)
    export let properties
    
    let dispatch = createEventDispatcher()

    onMount(() => {
        dispatch('message', {
            origin: "Generic",
            type: "HideViewport"
        })
    })
</script>

<div>
    WORK IN PROGRESS
</div>

<style>

</style>