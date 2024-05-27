import TreeNode from "./TreeNode";

export class TreeInput extends TreeNode {
    #default: number
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
        this.#default = defaultValue
        this.identity = identity
        this.value = this.#default
        this.end = this.#default
        this.min = null
        this.max = null
        this.increment = 1
        this.parametric = parametric
        this.validationFunction = () => null
    }

    public get Default(): number {
        return this.#default
    }

    public setMinMaxValidation(min: number | null, max: number | null): void {
        this.min = min
        this.max = max
    }
}