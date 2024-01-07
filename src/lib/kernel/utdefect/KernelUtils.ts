import { TreeInput } from "../../models/tree/TreeInput";
import type TreeNode from "../../models/tree/TreeNode";

export function GenerateParametricCombinations(rootNode: TreeNode): Array<TreeNode> {
    const combinations: Array<TreeNode> = [];

    function generateCombinations(node: TreeNode, pattern: string = "") {
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                if (child instanceof TreeInput) {
                    let totalCombinations = (child.end - child.value) / child.increment;

                    for (let i = 0; i < totalCombinations; i++) {
                        let newRootNode = Object.assign({} as TreeNode, rootNode);
                        let childInsert = newRootNode.FindChildByPattern(pattern)

                        if (childInsert instanceof TreeInput) {
                            childInsert.value = child.value + (i * child.increment);
                            combinations.push(newRootNode);
                        }
                    }
                }

                generateCombinations(child, pattern + ":" + child.name.replace(/\W/g, ""));
            });
        } 
    }

    generateCombinations(rootNode, rootNode.name);

    return combinations;
}