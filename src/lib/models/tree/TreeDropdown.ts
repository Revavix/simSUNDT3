import type TreeDropdownOption from "./TreeDropdownOption";
import TreeNode from "./TreeNode";

export class TreeDropdown extends TreeNode {
    #default: number
    identity: string | null
    value: number
    options: Array<TreeDropdownOption>

    constructor(name: string, identity: string | null = null, options: Array<TreeDropdownOption> = [], defaultValue: number = 0) {
        super(name)
        this.#default = defaultValue
        this.identity = identity
        this.value = this.#default
        this.options = options
    }

    public get Default(): number {
        return this.#default
    }
}