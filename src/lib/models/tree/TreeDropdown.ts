import type TreeDropdownOption from "./TreeDropdownOption";
import TreeNode from "./TreeNode";

export class TreeDropdown extends TreeNode {
    identity: string | null
    value: number
    options: Array<TreeDropdownOption>

    constructor(name: string, identity: string | null = null, options: Array<TreeDropdownOption> = [], defaultValue: number = 0) {
        super(name)
        this.identity = identity
        this.value = defaultValue
        this.options = options
    }
}