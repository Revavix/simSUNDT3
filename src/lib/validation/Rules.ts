import type IValidationResult from "../models/validation/ValidationResult";
import { ProjectSingleton } from "../data/ProjectSingleton";
import type { TreeCheckbox } from "../models/tree/TreeCheckbox";
import type { TreeInput } from "../models/tree/TreeInput";

export default {
    MethodMaterialMetalPropertiesLongitudinalVelocity: (value: string | number | boolean): IValidationResult => {
        if (value as number < 213 || value as number > 12890) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Longitudinal velocity must be between 213 and 12890 m/s"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMaterialMetalPropertiesTransversalVelocity: (value: string | number | boolean): IValidationResult => {
        if (value as number < 213 || value as number > 12890) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Transversal velocity must be between 213 and 8880 m/s"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMaterialMetalPropertiesDamping: (value: string | number | boolean): IValidationResult => {
        if (value as number < 0 || value as number > 1) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Damping is restricted from 0 to 1 (%)"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMaterialConstantsC11: (value: string | number | boolean): IValidationResult => {
        // If symmetry is set to isotropic, disable all constants
        let symmetry = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Material:Symmetry") as TreeInput

        if (symmetry.value === 2) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // Basic range check
        if (value as number < 0 || value as number > 1220) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Constants must be between 0 and 1220 GPa"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMaterialConstantsC22: (value: string | number | boolean): IValidationResult => {
        // If symmetry is set to isotropic, disable all constants
        let symmetry = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Material:Symmetry") as TreeInput

        if (symmetry.value === 2) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // If symmetry is set to transversal isotropic, disable C22
        if (symmetry.value === 4) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // Basic range check
        if (value as number < 0 || value as number > 1220) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Constants must be between 0 and 1220 GPa"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMaterialConstantsC33: (value: string | number | boolean): IValidationResult => {
        // If symmetry is set to isotropic, disable all constants
        let symmetry = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Material:Symmetry") as TreeInput

        if (symmetry.value === 2) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // Basic range check
        if (value as number < 0 || value as number > 1220) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Constants must be between 0 and 1220 GPa"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMaterialConstantsC12: (value: string | number | boolean): IValidationResult => {
        // If symmetry is set to isotropic, disable all constants
        let symmetry = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Material:Symmetry") as TreeInput

        if (symmetry.value === 2) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // Basic range check
        if (value as number < 0 || value as number > 1220) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Constants must be between 0 and 1220 GPa"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMaterialConstantsC13: (value: string | number | boolean): IValidationResult => {
        // If symmetry is set to isotropic, disable all constants
        let symmetry = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Material:Symmetry") as TreeInput

        if (symmetry.value === 2) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // Basic range check
        if (value as number < 0 || value as number > 1220) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Constants must be between 0 and 1220 GPa"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMaterialConstantsC23: (value: string | number | boolean): IValidationResult => {
        // If symmetry is set to isotropic, disable all constants
        let symmetry = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Material:Symmetry") as TreeInput

        if (symmetry.value === 2) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // If symmetry is set to transversal isotropic
        if (symmetry.value === 4) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // Basic range check
        if (value as number < 0 || value as number > 1220) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Constants must be between 0 and 1220 GPa"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMaterialConstantsC44: (value: string | number | boolean): IValidationResult => {
        // If symmetry is set to isotropic, disable all constants
        let symmetry = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Material:Symmetry") as TreeInput

        if (symmetry.value === 2) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // Basic range check
        if (value as number < 0 || value as number > 1220) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Constants must be between 0 and 1220 GPa"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMaterialConstantsC55: (value: string | number | boolean): IValidationResult => {
        // If symmetry is set to isotropic, disable all constants
        let symmetry = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Material:Symmetry") as TreeInput

        if (symmetry.value === 2) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // If symmetry is set to transversal isotropic
        if (symmetry.value === 4) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // Basic range check
        if (value as number < 0 || value as number > 1220) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Constants must be between 0 and 1220 GPa"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMaterialConstantsC66: (value: string | number | boolean): IValidationResult => {
        // If symmetry is set to isotropic, disable all constants
        let symmetry = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Material:Symmetry") as TreeInput

        if (symmetry.value === 2) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // If symmetry is set to transversal isotropic
        if (symmetry.value === 4) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // Basic range check
        if (value as number < 0 || value as number > 1220) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Constants must be between 0 and 1220 GPa"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMaterialEulersPhi: (value: string | number | boolean): IValidationResult => {
        // If symmetry is set to isotropic, disable all euler angles
        let symmetry = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Material:Symmetry") as TreeInput

        if (symmetry.value === 2) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 1220) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Angles are restricted from -90 to +90 degrees"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMaterialEulersTheta: (value: string | number | boolean): IValidationResult => {
        // If symmetry is set to isotropic, disable all euler angles
        let symmetry = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Material:Symmetry") as TreeInput

        if (symmetry.value === 2) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 1220) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Angles are restricted from -90 to +90 degrees"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMaterialEulersPsi: (value: string | number | boolean): IValidationResult => {
        // If symmetry is set to isotropic, disable all euler angles
        let symmetry = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Material:Symmetry") as TreeInput

        if (symmetry.value === 2 || symmetry.value === 4) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 1220) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Angles are restricted from -90 to +90 degrees"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodUTTechniqueProbeType: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodUTTechniqueTransmitter: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodUTTechniqueReceiver: (value: string | number | boolean): IValidationResult => {
        // If Method:UTTechnique:ProbeType is set to Tandem, TOFD, Separate, disable this input
        let probeType = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:UTTechnique:ProbeType") as TreeInput

        if (probeType.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    MethodCalibrationType: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodCalibrationDepth: (value: string | number | boolean): IValidationResult => {
        let backwallEnabled = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Surfaces:Backwall:Enabled") as TreeCheckbox
        let backwallDepth = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Surfaces:Backwall:Depth") as TreeInput
    
        if (backwallEnabled.value) {
            if (value as number < 0 || value as number > backwallDepth.value) {
                return {
                    isValid: false,
                    isDisabled: false,
                    message: "Depth is restricted to backwall depth"
                };
            }
        } else {
            if (value as number < 0 || value as number > 200) {
                return {
                    isValid: false,
                    isDisabled: false,
                    message: "Depth is restricted to 200 mm"
                };
            }
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodCalibrationDiameter: (value: string | number | boolean): IValidationResult => {
        if (value as number < 0 || value as number > 60) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Diameter is restricted to 60mm or less"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshSize: (value: string | number | boolean): IValidationResult => {
        if (value as number < -120 || value as number > 120) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Size is restricted from -120mm to +120mm"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshSizeXIncrement: (value: string | number | boolean): IValidationResult => {
        // If the increment is negative, then Method:Mesh:Size:XStart must be greater than Method:Mesh:Size:XEnd
        // or if the increment is positive, then Method:Mesh:Size:XStart must be less than Method:Mesh:Size:XEnd
        // increment can also not be zero
        let start = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:XStart") as TreeInput
        let end = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:XEnd") as TreeInput

        if (value as number < 0) {
            if (start.value <= end.value) {
                return {
                    isValid: false,
                    isDisabled: false,
                    message: "Increment is negative, XStart must be greater than XEnd"
                };
            }
        }

        if (value as number > 0) {
            if (start.value >= end.value) {
                return {
                    isValid: false,
                    isDisabled: false,
                    message: "Increment is positive, XStart must be less than XEnd"
                };
            }
        }

        if (value === 0) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Increment cannot be zero"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshSizeYIncrement: (value: string | number | boolean): IValidationResult => {
        // If the increment is negative, then Method:Mesh:Size:YStart must be greater than Method:Mesh:Size:YEnd
        // or if the increment is positive, then Method:Mesh:Size:YStart must be less than Method:Mesh:Size:YEnd
        // increment can also not be zero
        let start = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:YStart") as TreeInput
        let end = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:YEnd") as TreeInput

        if (value as number < 0) {
            if (start.value <= end.value) {
                return {
                    isValid: false,
                    isDisabled: false,
                    message: "Increment is negative, YStart must be greater than YEnd"
                };
            }
        }

        if (value as number > 0) {
            if (start.value >= end.value) {
                return {
                    isValid: false,
                    isDisabled: false,
                    message: "Increment is positive, YStart must be less than YEnd"
                };
            }
        }

        if (value === 0) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Increment cannot be zero"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldType: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldParametersInputEnergy: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 10000) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Energy is restricted from 0 to 10000 J"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldParametersInitialTemperature: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 1000) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Temperature is restricted from 0 to 1000 C"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldParametersHeatEfficiency: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 1) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Efficiency is restricted from 0 to 1"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldGeometryB1: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 1000) {
            return {
                isValid: false,
                isDisabled: false,
                message: "B1 is restricted from 0 to 1000 mm"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldGeometryB2: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 1000) {
            return {
                isValid: false,
                isDisabled: false,
                message: "B2 is restricted from 0 to 1000 mm"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldGeometryB3: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 1000) {
            return {
                isValid: false,
                isDisabled: false,
                message: "B3 is restricted from 0 to 1000 mm"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldGeometryT1: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 1000) {
            return {
                isValid: false,
                isDisabled: false,
                message: "T1 is restricted from 0 to 1000 mm"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldGeometryT2: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 1000) {
            return {
                isValid: false,
                isDisabled: false,
                message: "T2 is restricted from 0 to 1000 mm"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldPropertiesSpecificHeat: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 10000) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Specific heat is restricted from 0 to 10000 J/kgK"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldPropertiesInitialGrainSize: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 10000) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Grain size is restricted from 0 to 10000 mm"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldPropertiesDensity: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 10000) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Density is restricted from 0 to 10000 kg/m3"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldPropertiesMeltingTemperature: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 10000) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Melting temperature is restricted from 0 to 10000 C"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldPropertiesTemperatureDiffusivity: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 1) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Temperature diffusivity is restricted from 0 to 1"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldPropertiesActivationEnergy: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 10000) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Activation energy is restricted from 0 to 10000 J/mol"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldPropertiesExponentialGrowthConstant: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 1) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Exponential growth constant is restricted from 0 to 1"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldPropertiesGrainBoundaryEnergyConstant: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 1) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Grain boundary energy constant is restricted from 0 to 1"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldControlVolumeXStart: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none or regular weld, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0 || type.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < -120 || value as number > 120) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Size is restricted from -120mm to +120mm"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldControlVolumeXEnd: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none or regular weld, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0 || type.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < -120 || value as number > 120) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Size is restricted from -120mm to +120mm"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldControlVolumeYStart: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none or regular weld, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0 || type.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < -120 || value as number > 120) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Size is restricted from -120mm to +120mm"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldControlVolumeYEnd: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none or regular weld, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0 || type.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < -120 || value as number > 120) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Size is restricted from -120mm to +120mm"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldControlVolumeDepth: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none or regular weld, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0 || type.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 200) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Depth is restricted from 0 to 200"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldControlVolumeThickness: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none or regular weld, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0 || type.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 200) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Thickness is restricted from 0 to 200"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldControlVolumeGrainSize: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none or regular weld, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0 || type.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 200) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Grain size is restricted from 0 to 200"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldControlVolumeInitial: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none ir regular weld, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0 || type.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 200) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Initial is restricted from 0 to 200"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldSNRatioPercentOfSDH: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 100) {
            return {
                isValid: false,
                isDisabled: false,
                message: "SN ratio is restricted from 0% to 100%"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldSNRatioDiameter: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // Get the size of the model and compared it to the diameter
        let XStart = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:XStart") as TreeInput
        let XEnd = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:XEnd") as TreeInput
        let YStart = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:YStart") as TreeInput
        let YEnd = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:YEnd") as TreeInput

        let sizeX = Math.abs(XEnd.value - XStart.value)
        let sizeY = Math.abs(YEnd.value - YStart.value)

        if (value as number > sizeX || value as number > sizeY) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Diameter is restricted to model size " + sizeX + " x " + sizeY + " mm"
            };
        }

        // Number can not be negative
        if (value as number < 0) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Diameter can not be negative"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodMeshWeldSNRatioDepth: (value: string | number | boolean): IValidationResult => {
        // If Method:Mesh:Weld:Type is set to none, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Weld:Type") as TreeInput

        if (type.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 200) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Depth is restricted from 0 to 200 mm"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodTimeWindowType: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodTimeWindowStart: (value: string | number | boolean): IValidationResult => {
        // If Method:TimeWindow:Type is set to Automatic, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:TimeWindow:Type") as TreeInput

        if (type.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 100) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Size is restricted from 0 to 100us"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodTimeWindowEnd: (value: string | number | boolean): IValidationResult => {
        // If Method:TimeWindow:Type is set to Automatic, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:TimeWindow:Type") as TreeInput

        if (type.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 100) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Size is restricted from 0 to 100us"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodTimeWindowIncrement: (value: string | number | boolean): IValidationResult => {
        // If Method:TimeWindow:Type is set to Automatic, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:TimeWindow:Type") as TreeInput

        if (type.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 1) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Increment is restricted from 0 to 1 steps"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodTimeWindowDepth: (value: string | number | boolean): IValidationResult => {
        // If Method:TimeWindow:Type is set to Automatic, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:TimeWindow:Type") as TreeInput

        if (type.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < 0 || value as number > 200) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Depth is restricted from 0 to 200"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodTimeWindowX: (value: string | number | boolean): IValidationResult => {
        // If Method:TimeWindow:Type is set to Automatic, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:TimeWindow:Type") as TreeInput

        if (type.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < -120 || value as number > 120) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Size is restricted from -120mm to +120mm"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    MethodTimeWindowY: (value: string | number | boolean): IValidationResult => {
        // If Method:TimeWindow:Type is set to Automatic, disable this input
        let type = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:TimeWindow:Type") as TreeInput

        if (type.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        if (value as number < -120 || value as number > 120) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Size is restricted from -120mm to +120mm"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterShapeAndElementsType: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterShapeAndElementsAutoNumElements: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterShapeAndElementsXLength: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterShapeAndElementsXElements: (value: string | number | boolean): IValidationResult => {
        let autoNumElements = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Transmitter:ShapeandElements:AutoNumElements") as TreeCheckbox

        if (autoNumElements.value) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterShapeAndElementsXGap: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterShapeAndElementsYLength: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterShapeAndElementsYElements: (value: string | number | boolean): IValidationResult => {
        let autoNumElements = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Transmitter:ShapeandElements:AutoNumElements") as TreeCheckbox

        if (autoNumElements.value) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterShapeAndElementsYGap: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterSpectrumFrequency: (value: string | number | boolean): IValidationResult => {
        // If Transmitter:Spectrum:Type is set to Input spectrum, disable this input
        let spectrumType = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Transmitter:Spectrum:Type") as TreeInput

        if (spectrumType.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // .. otherwise standard frequency validation applies
        if (value as number < 1 || value as number > 12) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Frequency is restricted from 1 to 12 MHz"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterSpectrumBandwidth: (value: string | number | boolean): IValidationResult => {
        // If bandwidth is higher than 12 MHz send warning
        if (value as number < 0.5 || value as number > 12) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Bandwidth is restricted from 0.5 to 12 MHz"
            };
        }

        // If bandwidth is higher than frequency send warning
        let frequency = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Transmitter:Spectrum:Frequency") as TreeInput

        if (value as number > frequency.value) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Bandwidth is higher than frequency, please change the bandwidth so it is lower than the frequency. Running the simulation with this configuration will result in a calculation error."
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterSpectrumInputF1: (value: string | number | boolean): IValidationResult => {
        // If Transmitter:Spectrum:Type is set to Cosine Square or Monochromatic, disable this input
        let spectrumType = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Transmitter:Spectrum:Type") as TreeInput

        if (spectrumType.value === -1 || spectrumType.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // .. otherwise standard frequency validation applies
        if (value as number < 1 || value as number > 12) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Frequency range is restricted from 1 to 12 MHz"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterSpectrumInputF2: (value: string | number | boolean): IValidationResult => {
        // If Transmitter:Spectrum:Type is set to Cosine Square or Monochromatic, disable this input
        let spectrumType = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Transmitter:Spectrum:Type") as TreeInput

        if (spectrumType.value === -1 || spectrumType.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // .. otherwise standard frequency validation applies
        if (value as number < 1 || value as number > 12) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Frequency range is restricted from 1 to 12 MHz"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterSpectrumInputF3: (value: string | number | boolean): IValidationResult => {
        // If Transmitter:Spectrum:Type is set to Cosine Square or Monochromatic, disable this input
        let spectrumType = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Transmitter:Spectrum:Type") as TreeInput

        if (spectrumType.value === -1 || spectrumType.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // .. otherwise standard frequency validation applies
        if (value as number < 1 || value as number > 12) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Frequency range is restricted from 1 to 12 MHz"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterSpectrumInputF4: (value: string | number | boolean): IValidationResult => {
        // If Transmitter:Spectrum:Type is set to Cosine Square or Monochromatic, disable this input
        let spectrumType = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Transmitter:Spectrum:Type") as TreeInput

        if (spectrumType.value === -1 || spectrumType.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // .. otherwise standard frequency validation applies
        if (value as number < 1 || value as number > 12) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Frequency range is restricted from 1 to 12 MHz"
            };
        }
    
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterSpectrumInputHeightatF2AF: (value: string | number | boolean): IValidationResult => {
        // If Transmitter:Spectrum:Type is set to Cosine Square or Monochromatic, disable this input
        let spectrumType = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Transmitter:Spectrum:Type") as TreeInput

        if (spectrumType.value === -1 || spectrumType.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // Validate that the value is between 0-100, representing a percentage
        if (value as number < 0 || value as number > 100) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Height is restricted from 0 to 100%"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterSpectrumInputHeightatF3BF: (value: string | number | boolean): IValidationResult => {
        // If Transmitter:Spectrum:Type is set to Cosine Square or Monochromatic, disable this input
        let spectrumType = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Transmitter:Spectrum:Type") as TreeInput

        if (spectrumType.value === -1 || spectrumType.value === 1) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // Validate that the value is between 0-100, representing a percentage
        if (value as number < 0 || value as number > 100) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Height is restricted from 0 to 100%"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterFocusFocalDistance: (value: string | number | boolean): IValidationResult => {
        // If Transmitter:Focus:Type is set to Unfocused, disable this input
        let focusType = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Transmitter:Focus:Type") as TreeInput

        if (focusType.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterPositionX: (value: string | number | boolean): IValidationResult => {
        // Get the mesh size of the X parameters Method:Mesh:Size:XStart, Method:Mesh:Size:XEnd
        let meshSizeXStart = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:XStart") as TreeInput
        let meshSizeXEnd = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:XEnd") as TreeInput

        // Calculate size of the model
        let size = Math.abs(meshSizeXEnd.value - meshSizeXStart.value)

        // Check whether the value is within the range of the model
        if (value as number > size / 2 || value as number < -size / 2) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Position is restricted to the model size " + meshSizeXStart.value + " to " + meshSizeXEnd.value + " mm"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterPositionY: (value: string | number | boolean): IValidationResult => {
        // Get the mesh size of the Y parameters Method:Mesh:Size:YStart, Method:Mesh:Size:YEnd
        let meshSizeYStart = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:YStart") as TreeInput
        let meshSizeYEnd = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:YEnd") as TreeInput

        // Calculate size of the model
        let size = Math.abs(meshSizeYEnd.value - meshSizeYStart.value)

        // Check whether the value is within the range of the model
        if (value as number > size / 2 || value as number < -size / 2) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Position is restricted to the model size " + meshSizeYStart.value + " to " + meshSizeYEnd.value + " mm"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterWaveType: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterWaveSuppression: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterBeamAnglesAngle: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterBeamAnglesSkewAngle: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterWedgeLongitudinalWavespeed: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterWedgeTransversalWavespeed: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterWedgeDensity: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterWedgeAngle: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterWedgeWidth: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterEulerAnglesPhi: (value: string | number | boolean): IValidationResult => {
        // If Method:UTTechnique:Transmitter is not set to Immersion, disable this input
        let techniqueType = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:UTTechnique:Transmitter") as TreeInput

        if (techniqueType.value !== 4) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // If the value is not between 0-360, send warning
        if (value as number < -180 || value as number > 360) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Phi is restricted from -180 to 180 degrees"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterEulerAnglesTheta: (value: string | number | boolean): IValidationResult => {
        // If Method:UTTechnique:Transmitter is not set to Immersion, disable this input
        let techniqueType = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:UTTechnique:Transmitter") as TreeInput

        if (techniqueType.value !== 4) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // If the value is not between 0-360, send warning
        if (value as number < -180 || value as number > 360) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Phi is restricted from -180 to 180 degrees"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterEulerAnglesPsi: (value: string | number | boolean): IValidationResult => {
        // If Method:UTTechnique:Transmitter is not set to Immersion, disable this input
        let techniqueType = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:UTTechnique:Transmitter") as TreeInput

        if (techniqueType.value !== 4) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // If the value is not between 0-360, send warning
        if (value as number < -180 || value as number > 360) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Phi is restricted from -180 to 180 degrees"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterFluidSpecificationDensityRatio: (value: string | number | boolean): IValidationResult => {
        // If Method:UTTechnique:Transmitter is not set to Immersion, disable this input
        let techniqueType = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:UTTechnique:Transmitter") as TreeInput

        if (techniqueType.value !== 4) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterFluidSpecificationFluidWavespeed: (value: string | number | boolean): IValidationResult => {
        // If Method:UTTechnique:Transmitter is not set to Immersion, disable this input
        let techniqueType = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:UTTechnique:Transmitter") as TreeInput

        if (techniqueType.value !== 4) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterFluidSpecificationDamping: (value: string | number | boolean): IValidationResult => {
        // If Method:UTTechnique:Transmitter is not set to Immersion, disable this input
        let techniqueType = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:UTTechnique:Transmitter") as TreeInput

        if (techniqueType.value !== 4) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterCouplant: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    TransmitterDistanceProbeSurface: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverShapeAndElementsType: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverShapeAndElementsAutoNumElements: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverShapeAndElementsXLength: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverShapeAndElementsXElements: (value: string | number | boolean): IValidationResult => {
        let autoNumElements = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Receiver:ShapeandElements:AutoNumElements") as TreeCheckbox

        if (autoNumElements.value) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverShapeAndElementsXGap: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverShapeAndElementsYLength: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverShapeAndElementsYElements: (value: string | number | boolean): IValidationResult => {
        let autoNumElements = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Receiver:ShapeandElements:AutoNumElements") as TreeCheckbox

        if (autoNumElements.value) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverShapeAndElementsYGap: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverFocusType: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverFocusFocalDistance: (value: string | number | boolean): IValidationResult => {
        // If Receiver:Focus:Type is set to Unfocused, disable this input
        let focusType = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Receiver:Focus:Type") as TreeInput

        if (focusType.value === 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverSeparationX: (value: string | number | boolean): IValidationResult => {
        // Get the mesh size of the X parameters Method:Mesh:Size:XStart, Method:Mesh:Size:XEnd
        let meshSizeXStart = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:XStart") as TreeInput
        let meshSizeXEnd = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:XEnd") as TreeInput

        // Calculate the size of the model
        let size = Math.abs(meshSizeXEnd.value - meshSizeXStart.value)

        // Check whether the value is within the range of the model
        if (value as number > size / 2 || value as number < -size / 2) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Separation is restricted to the model size " + meshSizeXStart.value + " to " + meshSizeXEnd.value + " mm"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverSeparationY: (value: string | number | boolean): IValidationResult => {
        // Get the mesh size of the Y parameters Method:Mesh:Size:YStart, Method:Mesh:Size:YEnd
        let meshSizeYStart = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:YStart") as TreeInput
        let meshSizeYEnd = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:YEnd") as TreeInput

        // Calculate the size of the model
        let size = Math.abs(meshSizeYEnd.value - meshSizeYStart.value)

        // Check whether the value is within the range of the model
        if (value as number > size / 2 || value as number < -size / 2) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Separation is restricted to the model size " + meshSizeYStart.value + " to " + meshSizeYEnd.value + " mm"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverWaveSuppression: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverBeamAnglesAngle: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverBeamAnglesSkewAngle: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverWedgeLongitudinalWavespeed: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverWedgeTransversalWavespeed: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverWedgeDensity: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverWedgeAngle: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverWedgeWidth: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverEulerAnglesPhi: (value: string | number | boolean): IValidationResult => {
        // If Method:UTTechnique:Transmitter is not set to Immersion, disable this input
        let techniqueType = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:UTTechnique:Receiver") as TreeInput

        if (techniqueType.value !== 4) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // If the value is not between 0-360, send warning
        if (value as number < -180 || value as number > 360) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Phi is restricted from -180 to 180 degrees"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverEulerAnglesTheta: (value: string | number | boolean): IValidationResult => {
        // If Method:UTTechnique:Transmitter is not set to Immersion, disable this input
        let techniqueType = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:UTTechnique:Receiver") as TreeInput

        if (techniqueType.value !== 4) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // If the value is not between 0-360, send warning
        if (value as number < -180 || value as number > 360) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Theta is restricted from -180 to 180 degrees"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverEulerAnglesPsi: (value: string | number | boolean): IValidationResult => {
        // If Method:UTTechnique:Transmitter is not set to Immersion, disable this input
        let techniqueType = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:UTTechnique:Receiver") as TreeInput

        if (techniqueType.value !== 4) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // If the value is not between 0-360, send warning
        if (value as number < -180 || value as number > 360) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Psi is restricted from -180 to 180 degrees"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverCouplant: (value: string | number | boolean): IValidationResult => {
        // Set as invalid if couplant is less than 0 or greater than 1 (percentage)
        if (value as number < 0 || value as number > 1) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Couplant is restricted from 0 to 1 (0% - 100%)"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverDistanceProbeSurface: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    ReceiverFocusDepth: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    DefectPositionX: (value: string | number | boolean): IValidationResult => {
        // Position can't be outside of model
        let sizeXStart = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:XStart") as TreeInput
        let sizeXEnd = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:XEnd") as TreeInput

        // Calculate size of the model
        let size = Math.abs(sizeXEnd.value - sizeXStart.value)
        
        if (value as number > size / 2 || value as number < -size / 2) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Position is restricted to the model size " + sizeXStart.value + " to " + sizeXEnd.value + " mm"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectPositionY: (value: string | number | boolean): IValidationResult => {
        // Position can't be outside of model
        let sizeYStart = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:YStart") as TreeInput
        let sizeYEnd = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Method:Mesh:Size:YEnd") as TreeInput

        // Calculate size of the model
        let size = Math.abs(sizeYEnd.value - sizeYStart.value)

        if (value as number > size / 2 || value as number < -size / 2) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Position is restricted to the model size " + sizeYStart.value + " to " + sizeYEnd.value + " mm"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSpecificationVariant: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSpecificationMeasurementDiameter: (value: string | number | boolean): IValidationResult => {
        // If Defect:Specification:Variant is set to Spheroidal Cavity, Rectangular Crack, Strip-like Crack, SBSL Crack, disable this input
        let variant = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Specification:Variant") as TreeInput

        if (variant.value === 4 || variant.value === 5 || variant.value === 7 || variant.value === 19) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSpecificationMeasurementCentreDepth: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSpecificationMeasurementDiameterParallel: (value: string | number | boolean): IValidationResult => {
        // If Defect:Specification:Variant is set to anything but Spheroidal Cavity, disable this input
        let variant = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Specification:Variant") as TreeInput

        if (variant.value !== 4) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSpecificationMeasurementDiameterPerpendicular: (value: string | number | boolean): IValidationResult => {
        // If Defect:Specification:Variant is set to anything but Spheroidal Cavity, disable this input
        let variant = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Specification:Variant") as TreeInput

        if (variant.value !== 4) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSpecificationMeasurementHeight: (value: string | number | boolean): IValidationResult => {
        // If Defect:Specification:Variant is set to anything but Strip-like Crack or SBSL Crack, disable this input
        let variant = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Specification:Variant") as TreeInput

        if (variant.value !== 7 && variant.value !== 19) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSpecificationMeasurementLength: (value: string | number | boolean): IValidationResult => {
        // If Defect:Specification:Variant is set to anything but Rectangular Crack, disable this input
        let variant = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Specification:Variant") as TreeInput

        if (variant.value !== 5) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSpecificationMeasurementLengthParallel: (value: string | number | boolean): IValidationResult => {
        // If Defect:Specification:Variant is set to anything but rectangular crack, disable this input
        let variant = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Specification:Variant") as TreeInput

        if (variant.value !== 5) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSpecificationAnglesTilt: (value: string | number | boolean): IValidationResult => {
        // If Defect:Specification:Variant is set to anything but Circular Crack or Spheroidal Cavity, disable this input
        let variant = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Specification:Variant") as TreeInput

        if (variant.value !== 3 && variant.value !== 4) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // If the value is not between 0-360, send warning
        if (value as number < -180 || value as number > 180) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Tilt is restricted from -180 to 180 degrees"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSpecificationAnglesSkew: (value: string | number | boolean): IValidationResult => {
        // If Defect:Specification:Variant is set to anything but Circular Crack or Spheroidal Cavity, disable this input
        let variant = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Specification:Variant") as TreeInput

        if (variant.value !== 3 && variant.value !== 4) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // If the value is not between 0-360, send warning
        if (value as number < -180 || value as number > 180) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Tilt is restricted from -180 to 180 degrees"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSpecificationAnglesTiltCrack: (value: string | number | boolean): IValidationResult => {
        // If Defect:Specification:Variant is set to anything but Rectangular Crack, Strip-like Crack or SBSL Crack, disable this input
        let variant = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Specification:Variant") as TreeInput

        if (variant.value !== 5 && variant.value !== 7 && variant.value !== 19) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // Restrict the value to -90 to 90 degrees
        if (value as number < -90 || value as number > 90) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Tilt is restricted from -90 to 90 degrees"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSpecificationInclusionPropertiesRelativeDensity: (value: string | number | boolean): IValidationResult => {
        // If Defect:Specification:Variant is set to anything but Elastic Spherical Inclusion, disable this input
        let variant = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Specification:Variant") as TreeInput

        if (variant.value !== 2) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSpecificationInclusionPropertiesLongitudinalWavespeed: (value: string | number | boolean): IValidationResult => {
        // If Defect:Specification:Variant is set to anything but Elastic Spherical Inclusion, disable this input
        let variant = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Specification:Variant") as TreeInput

        if (variant.value !== 2) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSpecificationInclusionPropertiesTransversalWavespeed: (value: string | number | boolean): IValidationResult => {
        // If Defect:Specification:Variant is set to anything but Elastic Spherical Inclusion, disable this input
        let variant = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Specification:Variant") as TreeInput

        if (variant.value !== 2) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSpecificationInclusionPropertiesDamping: (value: string | number | boolean): IValidationResult => {
        // If Defect:Specification:InclusionProperties:LongitudinalWavespeed is greater than 0 or equals to 0, disable this input
        let wavespeed = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Specification:InclusionProperties:LongitudinalWavespeed") as TreeInput

        if (wavespeed.value >= 0) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSpecificationCircularPropertiesVariant: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSpecificationCircularPropertiesStressQuotient: (value: string | number | boolean): IValidationResult => {
        // If Defect:Specification:CircularProperties:Variant is set to anything but Partly Closed, disable this input
        let variant = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Specification:CircularProperties:Variant") as TreeInput

        if (variant.value !== 3) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // If the value is not between 0-1, send warning
        if (value as number < 0 || value as number > 1) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Stress Quotient is restricted from 0 to 1 (0% - 100%)"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSpecificationCircularPropertiesContactDiameter: (value: string | number | boolean): IValidationResult => {
        // If Defect:Specification:CircularProperties:Variant is set to anything but Partly Closed, disable this input
        let variant = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Specification:CircularProperties:Variant") as TreeInput

        if (variant.value !== 3) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSurfacesBackwallEnabled: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSurfacesBackwallDepth: (value: string | number | boolean): IValidationResult => {
        // If Defect:Surfaces:Backwall:Enabled is set to false, disable this input
        let enabled = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Surfaces:Backwall:Enabled") as TreeCheckbox

        if (!enabled.value) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSurfacesBackwallTiltHorizontal: (value: string | number | boolean): IValidationResult => {
        // If Defect:Surfaces:Backwall:Enabled is set to false, disable this input
        let enabled = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Surfaces:Backwall:Enabled") as TreeCheckbox

        if (!enabled.value) {
            return { isValid: true, isDisabled: true, message: null };
        }

        // If the value is not between 0-360, send warning
        if (value as number < -90 || value as number > 90) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Tilt is restricted from -90 to 90 degrees"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSurfacesRoughnessEnabled: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSurfacesRoughnessRMSHeight: (value: string | number | boolean): IValidationResult => {
        // If Defect:Surfaces:Roughness:Enabled is set to false, disable this input
        let enabled = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Surfaces:Roughness:Enabled") as TreeCheckbox

        if (!enabled.value) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSurfacesRoughnessCorrelationLength: (value: string | number | boolean): IValidationResult => {
        // If Defect:Surfaces:Roughness:Enabled is set to false, disable this input
        let enabled = ProjectSingleton.GetInstance().Tree?.FindChildByPattern("Defect:Surfaces:Roughness:Enabled") as TreeCheckbox

        if (!enabled.value) {
            return { isValid: true, isDisabled: true, message: null };
        }

        return { isValid: true, isDisabled: false, message: null };
    },
    DefectSurfacesIntegration: (value: string | number | boolean): IValidationResult => {
        return { isValid: true, isDisabled: false, message: null };
    }
}