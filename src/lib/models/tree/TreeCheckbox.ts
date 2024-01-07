import TreeNode from "./TreeNode";

export class TreeCheckbox extends TreeNode {
    identity: string | null
    value: boolean

    constructor(name: string, identity: string | null = null, defaultValue: boolean = false) {
        super(name)
        this.identity = identity
        this.value = defaultValue
    }
}