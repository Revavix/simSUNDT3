export default interface IValidationResult {
    isValid: boolean;
    isDisabled: boolean;
    message: string | null;
}