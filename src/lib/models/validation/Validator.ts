import type IValidationResult from "./ValidationResult";

export interface IValidator {
    Validate(treePath: string, value: string | number | boolean): IValidationResult
}