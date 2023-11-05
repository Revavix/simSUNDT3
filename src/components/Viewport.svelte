<script lang="ts">
    import { T, useThrelte } from '@threlte/core'
    import { CSM, Grid, OrbitControls, Sky, interactivity } from '@threlte/extras'
    import { Color, Mesh, PlaneGeometry, Vector2, Vector3 } from 'three';
    import { DEG2RAD } from 'three/src/math/MathUtils.js';

    interactivity()

    let mesh: Mesh = new Mesh()

    const { renderer, invalidate } = useThrelte()

    $: {
        renderer.toneMappingExposure = 1.5
        
    }
</script>

<CSM
    enabled
    args={{
        lightDirection: new Vector3(1, -1, 1).normalize()
    }}
    lightIntensity={0.1}
    >
    <T.PerspectiveCamera
    makeDefault
    position={[5, 5, 5]}
    >
        <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI * 0.5}/>
    </T.PerspectiveCamera>
    <Sky 
        turbidity={20}
        rayleigh={0.57}
        azimuth={180}
        elevation={-5}
        mieCoefficient={0.038}
        mieDirectionalG={0}
    />
    <T.AmbientLight intensity={1} />
    <T.SpotLight position={[0, mesh.position.y + 3, 0]} scale={[5, 5, 5]} power={50} intensity={50} target={mesh}/>

        
    <Grid position.y={-0.5}/>
    <T.Mesh receiveShadow rotation.x={DEG2RAD * -90} position.y={-0.6}>
        <T.PlaneGeometry args={[1000, 1000, 100, 100]}/>
        <T.MeshStandardMaterial color={new Color(Color.NAMES.dimgray)} roughness={0.9} metalness={0.2}/>
    </T.Mesh>

    <T.Mesh receiveShadow castShadow bind:mesh on:click={() => {
            console.log('clicked')
        }}>
        <T.BoxGeometry args={[2, 1, 2, 100, 100]}/>
        <T.MeshStandardMaterial color="gray" roughness={0.1} metalness={0.5}/>
    </T.Mesh>
</CSM>

<style>

</style>