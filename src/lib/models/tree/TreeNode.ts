import type { TreeCheckbox } from "./TreeCheckbox"
import type { TreeDropdown } from "./TreeDropdown"
import type { TreeInput } from "./TreeInput"

export default class TreeNode {
    name: string
    children: Array<TreeNode> | null
    disabled: boolean
    expanded: boolean | null
    padding: boolean | null

    constructor(name: string, padding: boolean = false, expanded: boolean | null = null) {
        this.name = name
        this.children = null
        this.disabled = false
        this.expanded = expanded
        this.padding = padding
    }

    public AddChild(child: TreeNode | TreeInput | TreeCheckbox | TreeDropdown): TreeNode | TreeInput | TreeCheckbox | TreeDropdown {
        if (this.children === null) {
            this.children = []
        }

        this.children.push(child)

        return child
    }

    public FindChildByPattern(pattern: string): TreeNode | TreeInput | TreeCheckbox | TreeDropdown | null {
        const path = pattern.split(':');
        let currentNode: TreeNode | null = this;
    
        for (let i = 0; i < path.length; i++) {
            const childName = path[i];
            if (currentNode?.children) {
                const childNode: any = currentNode.children.find(child => child.name
                    .replace(/\W/g, "") === childName);
                if (childNode) {
                    currentNode = childNode;
                } else {
                    throw new Error(`Could not find child node ${childName}`);
                }
            } else {
                throw new Error(`Could not find children of node ${currentNode?.name}`);
            }
        }
    
        return currentNode;
    }
}