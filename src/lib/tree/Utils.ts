import { TreeCheckbox } from "../models/tree/TreeCheckbox";
import { TreeDropdown } from "../models/tree/TreeDropdown";
import { TreeInput } from "../models/tree/TreeInput";
import TreeNode from "../models/tree/TreeNode";
import Root from "./Root";

export function Serialize(node: TreeNode | TreeInput | TreeCheckbox | TreeDropdown): Record<string, string> {
    const dictionary: Record<string, string> = {};

    function traverse(node: TreeNode | TreeInput | TreeCheckbox | TreeDropdown, parentKey: string) {
        const { name, children } = node;
        let currentKey = (parentKey ? `${parentKey}_${name}` : name).replace(/\W/g, "");

        if (currentKey === "Root") currentKey = "";

        if (children) {
            for (const child of children) {
                traverse(child, currentKey);
            }
        } else {
            if (node instanceof TreeInput) {
                dictionary[currentKey] = '[' + node.value.toString() + ',' + 
                    node.end.toString() + ',' + 
                    node.increment.toString() +  ']';
            } else if (node instanceof TreeCheckbox || node instanceof TreeDropdown) {
                dictionary[currentKey] = node.value.toString();
            }
        }
    }

    traverse(node, '');

    console.log(dictionary)

    return dictionary;
}

export function Deserialize(dictionary: Record<string, string>): TreeNode {
    const rootNode = Object.assign(new TreeNode("Root", false, null), Root);

    for (const [key, value] of Object.entries(dictionary)) {
        let object = rootNode.FindChildByPattern(key.split("_").join(":"))

        if (object instanceof TreeInput) {
            object.value = JSON.parse(value)[0];
            object.end = JSON.parse(value)[1];
            object.increment = JSON.parse(value)[2];
        }

        if (object instanceof TreeCheckbox || object instanceof TreeDropdown) {
            object.value = JSON.parse(value);
        }
    };

    return rootNode;
}