import type TreeNode from "./tree/TreeNode"

export interface Project {
    name: string
    path: string | null
    data: {
        preprocessor: {
            tree: TreeNode | null,
            misc: {
                accuracy: string,
                binaryPath: string,
                cloudEndpoint: string,
                parametric: {
                    numProcesses: number
                }
            }
        }
        postprocessor: Array<any>
    }
}