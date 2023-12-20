export default interface IValidationError {
    type: "WARNING" | "ERROR";
    message: string;
}