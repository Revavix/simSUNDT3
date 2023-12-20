import TreeNode from "./TreeNode";

export class TreeInput extends TreeNode {
    value: number
    end: number
    increment: number
    min: number | null
    max: number | null
    identity: string | null
    parametric: boolean
    validationFunction: () => string | null

    constructor(name: string, identity: string, defaultValue: number = 0, parametric: boolean = false) {
        super(name)
        this.identity = identity
        this.value = defaultValue
        this.end = defaultValue
        this.min = null
        this.max = null
        this.increment = 1
        this.parametric = parametric
        this.validationFunction = () => null
    }

    public setMinMaxValidation(min: number | null, max: number | null): void {
        this.min = min
        this.max = max
    }
}