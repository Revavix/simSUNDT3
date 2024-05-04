import { TreeInput } from "../../models/tree/TreeInput";
import type TreeNode from "../../models/tree/TreeNode";
import _ from "lodash";

export function GenerateParametricCombinations(rootNode: TreeNode): Array<TreeNode> {
    const combinations: Array<TreeNode> = [];

    function generateCombinations(node: TreeNode, pattern: string = "") {
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                if (child instanceof TreeInput && child.disabled === false) {
                    let totalCombinations = (child.end - child.value) / child.increment;

                    if (pattern !== rootNode.name) {
                        for (let i = 0; i < totalCombinations; i++) {
                            let newRootNode = _.cloneDeep(rootNode);
                            let childInsert = newRootNode.FindChildByPattern(pattern + ":" + child.name.replace(/\W/g, ""));

                            if (childInsert instanceof TreeInput) {
                                childInsert.value = child.value + (i * child.increment);
                                combinations.push(newRootNode);
                            }
                        }
                    }
                }

                generateCombinations(child, pattern === "" ? child.name.replace(/\W/g, "") : pattern + ":" + child.name.replace(/\W/g, ""));
            });
        } 
    }

    generateCombinations(rootNode, "");

    return combinations;
}