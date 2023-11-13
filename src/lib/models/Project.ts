export interface Project {
    name: string
    path: string | null
    data: {
        preprocessor: {
            tree: any,
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