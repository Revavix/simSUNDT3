<script lang="ts">
    import { T, useThrelte } from '@threlte/core'
    import { OrbitControls } from '@threlte/extras'
    import { onDestroy, onMount } from 'svelte'
    import { cameraPosition, cameraRotation } from '../../lib/data/Stores';
    import { toArray } from 'lodash';

    export let renderer: any

    const { invalidate } = useThrelte()

    onMount(() => {
        console.log('Mounted')
    })

    onDestroy(() => {
        console.log('Destroyed')
    })
</script>

<T.PerspectiveCamera
    let:ref
    makeDefault
    position={$cameraPosition}
>
    <OrbitControls args={[ref, renderer.domElement]} minPolarAngle={0} maxPolarAngle={Math.PI * 0.5} on:change={(v) => {
        cameraPosition.set(ref.position.toArray())
        cameraRotation.set(ref.rotation)
        invalidate()
    }}/>
</T.PerspectiveCamera>