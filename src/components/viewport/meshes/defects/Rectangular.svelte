<script lang="ts">
    import { T } from '@threlte/core'
    import { MeshLineGeometry, MeshLineMaterial } from '@threlte/extras'
    import { Vector2, Vector3 } from 'three';
    import { DEG2RAD } from 'three/src/math/MathUtils.js';

    export let defectPos: Vector2;
    export let defectDepth: number;
    export let defectLength: number;
    export let defectHeight: number;
    export let defectTilt: number;
</script>

<T.Mesh position={[defectPos.x, (((defectDepth + 1) / 2) * 2) - defectDepth, defectPos.y]} rotation={[0, 0, defectTilt * DEG2RAD]}>
    <T.PlaneGeometry args={[defectLength, defectHeight]} />
    <T.MeshBasicMaterial color="#b22929" side={2}/>
</T.Mesh>