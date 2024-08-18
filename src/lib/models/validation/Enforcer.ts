export interface IEnforcer {
    Enforce(treePath: string, value: string | number | boolean): void
}