
import type IValidationResult from '../models/validation/ValidationResult';
import type { IValidator } from '../models/validation/Validator';
import * as rules from './Rules';

export class Validator implements IValidator {
    // Rulesets can be added for future kernel versions, if different validation is needed
    ruleset: "UTDefect" = "UTDefect";

    // TODO: Add weld parameter validation
    rules: Record<string, (value: string | number | boolean) => IValidationResult> = {
        'MethodMaterialMetalPropertiesLongitudinalVelocity': rules.default.MethodMaterialMetalPropertiesLongitudinalVelocity,
        'MethodMaterialMetalPropertiesTransversalVelocity': rules.default.MethodMaterialMetalPropertiesTransversalVelocity,
        'MethodMaterialMetalPropertiesDamping': rules.default.MethodMaterialMetalPropertiesDamping,
        'MethodMaterialConstantsC11': rules.default.MethodMaterialConstantsC11,
        'MethodMaterialConstantsC22': rules.default.MethodMaterialConstantsC22,
        'MethodMaterialConstantsC33': rules.default.MethodMaterialConstantsC33,
        'MethodMaterialConstantsC12': rules.default.MethodMaterialConstantsC12,
        'MethodMaterialConstantsC13': rules.default.MethodMaterialConstantsC13,
        'MethodMaterialConstantsC23': rules.default.MethodMaterialConstantsC23,
        'MethodMaterialConstantsC44': rules.default.MethodMaterialConstantsC44,
        'MethodMaterialConstantsC55': rules.default.MethodMaterialConstantsC55,
        'MethodMaterialConstantsC66': rules.default.MethodMaterialConstantsC66,
        'MethodMaterialEulersPhi': rules.default.MethodMaterialEulers,
        'MethodMaterialEulersTheta': rules.default.MethodMaterialEulers,
        'MethodMaterialEulersPsi': rules.default.MethodMaterialEulers,
        'MethodCalibrationDepth': rules.default.MethodCalibrationDepth,
        'MethodCalibrationDiameter': rules.default.MethodCalibrationDiameter,
        'MethodMeshSizeXStart': rules.default.MethodMeshSize,
        'MethodMeshSizeXEnd': rules.default.MethodMeshSize,
        'MethodMeshSizeXIncrement': rules.default.MethodMeshSize,
        'MethodMeshSizeYStart': rules.default.MethodMeshSize,
        'MethodMeshSizeYEnd': rules.default.MethodMeshSize,
        'MethodMeshSizeYIncrement': rules.default.MethodMeshSize,
        'MethodTimeWindowStart': rules.default.MethodTimeWindowStart,
        'MethodTimeWindowEnd': rules.default.MethodTimeWindowEnd,
        'MethodTimeWindowIncrement': rules.default.MethodTimeWindowIncrement,
        'MethodTimeWindowDepth': rules.default.MethodTimeWindowDepth,
        'MethodTimeWindowX': rules.default.MethodTimeWindowX,
        'MethodTimeWindowY': rules.default.MethodTimeWindowY,
        'TransmitterShapeandElementsXLength': rules.default.TransmitterShapeAndElementsXLength,
        'TransmitterShapeandElementsXElements': rules.default.TransmitterShapeAndElementsXElements,
        'TransmitterShapeandElementsXGap': rules.default.TransmitterShapeAndElementsXGap,
        'TransmitterShapeandElementsYLength': rules.default.TransmitterShapeAndElementsYLength,
        'TransmitterShapeandElementsYElements': rules.default.TransmitterShapeAndElementsYElements,
        'TransmitterShapeandElementsYGap': rules.default.TransmitterShapeAndElementsYGap,
        'TransmitterSpectrumFrequency': rules.default.TransmitterSpectrumFrequency,
        'TransmitterSpectrumBandwidth': rules.default.TransmitterSpectrumBandwidth,
        'TransmitterSpectrumInputF1': rules.default.TransmitterSpectrumInputF1,
        'TransmitterSpectrumInputF2': rules.default.TransmitterSpectrumInputF2,
        'TransmitterSpectrumInputF3': rules.default.TransmitterSpectrumInputF3,
        'TransmitterSpectrumInputF4': rules.default.TransmitterSpectrumInputF4,
        'TransmitterSpectrumInputHeightatF2AF': rules.default.TransmitterSpectrumInputHeightatF2AF,
        'TransmitterSpectrumInputHeightatF3BF': rules.default.TransmitterSpectrumInputHeightatF3BF,
        'TransmitterFocusFocalDistance': rules.default.TransmitterFocusFocalDistance,
        'TransmitterPositionX': rules.default.TransmitterPositionX,
        'TransmitterPositionY': rules.default.TransmitterPositionY,
    };

    constructor() {
        
    }

    Validate(treePath: string, value: string | number | boolean): IValidationResult {
        if (treePath in this.rules === false) {
            return { isValid: true, isDisabled: false, message: 'Value could not be validated' };
        }

        return this.rules[treePath](value);
    }
}