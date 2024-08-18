<script lang="ts">
    import { T } from '@threlte/core'
    import { MeshLineGeometry, MeshLineMaterial, Text } from '@threlte/extras'
    import { Vector2, Vector3 } from 'three';
    import { ProjectSingleton } from '../../../../lib/data/ProjectSingleton';
    import type { Project } from '../../../../lib/models/Project';
    import { onDestroy } from 'svelte';
    import type TreeNode from '../../../../lib/models/tree/TreeNode';
    import type { TreeInput } from '../../../../lib/models/tree/TreeInput';
    import { DEG2RAD } from 'three/src/math/MathUtils.js';
    import { cameraPosition } from '../../../../lib/data/Stores';

    let mesh: any = {
        start: new Vector2(0, 0),
        end: new Vector2(0, 0),
    }
    let defect: any = {
        position: new Vector2(0, 0),
        height: 0,
        tilt: 0
    }
    let backwall: any = {
        depth: 0
    }
    let scene: any = {
        camera: {
            position: new Vector3(0, 0, 0)
        }
    }

    let unsubscribe = ProjectSingleton.GetInstance().Subscribe((project: Project) => { 
        let root: TreeNode | null = project.data.preprocessor.tree

        if (root == null) {
            return
        }

        mesh.start.x = (root?.FindChildByPattern("Method:Mesh:Size:XStart") as TreeInput)?.value / 10
        mesh.start.y = (root?.FindChildByPattern("Method:Mesh:Size:YStart") as TreeInput)?.value / 10
        mesh.end.x = (root?.FindChildByPattern("Method:Mesh:Size:XEnd") as TreeInput)?.value / 10
        mesh.end.y = (root?.FindChildByPattern("Method:Mesh:Size:YEnd") as TreeInput)?.value / 10
        defect.position.x = (root?.FindChildByPattern("Defect:Position:X") as TreeInput)?.value / 10
        defect.position.y = (root?.FindChildByPattern("Defect:Position:Y") as TreeInput)?.value / 10
        defect.height = (root?.FindChildByPattern("Defect:Specification:Measurement:Height") as TreeInput)?.value / 10
        defect.tilt = (root?.FindChildByPattern("Defect:Specification:Angles:TiltCrack") as TreeInput)?.value
        backwall.depth = (root?.FindChildByPattern("Defect:Surfaces:Backwall:Depth") as TreeInput)?.value / 10
    });

    let unsubscribeCamera = cameraPosition.subscribe((value) => {
        scene.camera.position = value
        scene = {...scene}
    });

    onDestroy(() => {
        unsubscribe();
        unsubscribeCamera();
    });
</script>

<T.Mesh position={[
        defect.position.x + (Math.sin(defect.tilt * DEG2RAD) * defect.height / 2), 
        0 + Math.cos(defect.tilt * DEG2RAD) * defect.height / 2, 
        mesh.start.y + (mesh.end.y - mesh.start.y) / 2
    ]} 
    rotation={[
        defect.tilt * DEG2RAD, 
        90 * DEG2RAD, 
        0,
        'YXZ'
    ]}>
    <T.PlaneGeometry args={[Math.abs(mesh.end.y - mesh.start.y), defect.height]}/>
    <T.MeshBasicMaterial color="#b22929" side={2}/>
</T.Mesh>

<!-- Helper lines-->
<T.Mesh>
    <MeshLineGeometry points={[
        new Vector3(
            defect.position.x, 
            0 + Math.cos(defect.tilt * DEG2RAD) * (defect.height - 0.025/2), 
            mesh.start.y > mesh.end.y ? mesh.start.y : mesh.end.y 
        ),
        new Vector3(
            defect.position.x + (Math.sin(defect.tilt * DEG2RAD) * (defect.height - 0.025/2)), 
            0 + Math.cos(defect.tilt * DEG2RAD) * (defect.height - 0.025/2), 
            mesh.start.y > mesh.end.y ? mesh.start.y : mesh.end.y 
        )
        ]} 
    />
    <MeshLineMaterial
    width={0.025}
    color="red"
    />
</T.Mesh>
<T.Mesh>
    <MeshLineGeometry points={[
        new Vector3(
            defect.position.x, 
            0 + Math.cos(defect.tilt * DEG2RAD) * (defect.height - 0.025/2), 
            mesh.start.y > mesh.end.y ? mesh.start.y : mesh.end.y 
        ),
        new Vector3(
            defect.position.x, 
            0, 
            mesh.start.y > mesh.end.y ? mesh.start.y : mesh.end.y 
        )
        ]} 
    />
    <MeshLineMaterial
    width={0.025}
    color="green"
    />
</T.Mesh>

<!-- Circle points -->
<T.Mesh 
    position={[
        defect.position.x + (Math.sin(defect.tilt * DEG2RAD) * (defect.height - 0.025/2)), 
        0 + Math.cos(defect.tilt * DEG2RAD) * (defect.height - 0.025/2), 
        mesh.start.y > mesh.end.y ? mesh.start.y : mesh.end.y 
    ]} 
    rotation={[-Math.PI / 2, 0, 0]}>
    <T.SphereGeometry args={[0.05/2, 32]} />
    <T.MeshBasicMaterial color="red" side={2}/>
</T.Mesh>
<T.Mesh 
    position={[
        defect.position.x, 
        0 + Math.cos(defect.tilt * DEG2RAD) * (defect.height - 0.025/2), 
        mesh.start.y > mesh.end.y ? mesh.start.y : mesh.end.y 
    ]} 
    rotation={[-Math.PI / 2, 0, 0]}>
    <T.SphereGeometry args={[0.05/2, 32]} />
    <T.MeshBasicMaterial color="black" side={2}/>
</T.Mesh>
<T.Mesh 
    position={[
        defect.position.x, 
        0, 
        mesh.start.y > mesh.end.y ? mesh.start.y : mesh.end.y 
    ]} 
    rotation={[-Math.PI / 2, 0, 0]}>
    <T.SphereGeometry args={[0.05/2, 32]} />
    <T.MeshBasicMaterial color="green" side={2}/>
</T.Mesh>