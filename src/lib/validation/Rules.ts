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
    MethodMaterialEulers: (value: string | number | boolean): IValidationResult => {
        if (value as number < 0 || value as number > 1220) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Angles are restricted from -90 to +90 degrees"
            };
        }
    
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
    MethodTimeWindowStart: (value: string | number | boolean): IValidationResult => {
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
        if (value as number < -120 || value as number > 120) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Size is restricted from -120mm to +120mm"
            };
        }
    
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
        if (value as number < 0 || value as number > 12) {
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
        if (value as number < 1 || value as number > 12) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Bandwidth is restricted from 1 to 12 MHz"
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

        // Check whether the value is within the range of the model
        if (value as number < meshSizeXStart.value || value as number > meshSizeXEnd.value) {
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

        // Check whether the value is within the range of the model
        if (value as number < meshSizeYStart.value || value as number > meshSizeYEnd.value) {
            return {
                isValid: false,
                isDisabled: false,
                message: "Position is restricted to the model size " + meshSizeYStart.value + " to " + meshSizeYEnd.value + " mm"
            };
        }

        return { isValid: true, isDisabled: false, message: null };
    }
}