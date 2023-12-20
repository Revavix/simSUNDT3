import type { TreeInput } from "../../../models/tree/TreeInput";
import type TreeNode from "../../../models/tree/TreeNode";
import type { IKernelValidator } from "../../../models/Kernel";
import type { TreeCheckbox } from "../../../models/tree/TreeCheckbox";

export class KernelValidator implements IKernelValidator {
    root: TreeNode;

    constructor(node: TreeNode) {
        this.root = node;
    }

    SetBasicValidation(): void {
        /* 
        213 m/s is the speed of sound of L/S waves in Sulphur Dioxide
        12890 m/s is the speed of sound of L waves in Beryllium
        */
        (this.root.FindChildByPattern("Method:Material:MetalProperties:LongitudinalVelocity") as TreeInput).setMinMaxValidation(213, 12890);

        /*
        213 m/s is the speed of sound of S waves in Sulphur Dioxide
        8880 m/s is the speed of sound of S waves in Beryllium
        */
        (this.root.FindChildByPattern("Method:Material:MetalProperties:TransversalVelocity") as TreeInput).setMinMaxValidation(213, 8880);

        // Damping is a 0 to 1 value (percentage)
        (this.root.FindChildByPattern("Method:Material:MetalProperties:Damping") as TreeInput).setMinMaxValidation(0, 1);

        // Diamond is one of the hardest materials, with a Young modulus of 1220 GPa
        (this.root.FindChildByPattern("Method:Material:Constants:C11") as TreeInput).setMinMaxValidation(0, 1220);
        (this.root.FindChildByPattern("Method:Material:Constants:C22") as TreeInput).setMinMaxValidation(0, 1220);
        (this.root.FindChildByPattern("Method:Material:Constants:C33") as TreeInput).setMinMaxValidation(0, 1220);
        (this.root.FindChildByPattern("Method:Material:Constants:C12") as TreeInput).setMinMaxValidation(0, 1220);
        (this.root.FindChildByPattern("Method:Material:Constants:C13") as TreeInput).setMinMaxValidation(0, 1220);
        (this.root.FindChildByPattern("Method:Material:Constants:C23") as TreeInput).setMinMaxValidation(0, 1220);
        (this.root.FindChildByPattern("Method:Material:Constants:C44") as TreeInput).setMinMaxValidation(0, 1220);
        (this.root.FindChildByPattern("Method:Material:Constants:C55") as TreeInput).setMinMaxValidation(0, 1220);
        (this.root.FindChildByPattern("Method:Material:Constants:C66") as TreeInput).setMinMaxValidation(0, 1220);

        // Angle limits for anisotropic Euler Angles
        (this.root.FindChildByPattern("Method:Material:Eulers:Phi") as TreeInput).setMinMaxValidation(-90, 90);
        (this.root.FindChildByPattern("Method:Material:Eulers:Theta") as TreeInput).setMinMaxValidation(-90, 90);
        (this.root.FindChildByPattern("Method:Material:Eulers:Psi") as TreeInput).setMinMaxValidation(-90, 90);

        // Calibration depth should not exceed backwall, and should be at most 200 if no backwall is used
        if ((this.root.FindChildByPattern("Defect:Surfaces:Backwall:Enabled") as TreeCheckbox).value) {
            (this.root.FindChildByPattern("Method:Calibration:Depth") as TreeInput).setMinMaxValidation(0, (this.root.FindChildByPattern("Method:Material:Calibration:Depth") as TreeInput).value);
        } else {
            (this.root.FindChildByPattern("Method:Calibration:Depth") as TreeInput).setMinMaxValidation(0, 200);
        }

        (this.root.FindChildByPattern("Method:Calibration:Diameter") as TreeInput).setMinMaxValidation(0, 60);

        /*
        Limit total size to that of 240x240 = 57600 points
        */
        (this.root.FindChildByPattern("Method:Mesh:Size:XStart") as TreeInput).setMinMaxValidation(-120, 120);
        (this.root.FindChildByPattern("Method:Mesh:Size:XEnd") as TreeInput).setMinMaxValidation(-120, 120);
        (this.root.FindChildByPattern("Method:Mesh:Size:XIncrement") as TreeInput).setMinMaxValidation(-120, 120);
        (this.root.FindChildByPattern("Method:Mesh:Size:YStart") as TreeInput).setMinMaxValidation(-120, 120);
        (this.root.FindChildByPattern("Method:Mesh:Size:YEnd") as TreeInput).setMinMaxValidation(-120, 120);
        (this.root.FindChildByPattern("Method:Mesh:Size:YIncrement") as TreeInput).setMinMaxValidation(-120, 120);
    }
    
    SetSpecialValidation(): void {
        throw new Error("Method not implemented.");
    }
    
}