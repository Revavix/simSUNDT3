import TreeNode from "./TreeNode";

export class TreeCheckbox extends TreeNode {
    #default: boolean
    identity: string | null
    value: boolean

    constructor(name: string, identity: string | null = null, defaultValue: boolean = false) {
        super(name)
        this.#default = defaultValue
        this.identity = identity
        this.value = this.#default
    }

    public get Default(): boolean {
        return this.#default
    }
}