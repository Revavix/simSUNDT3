import { ProjectSingleton } from "../data/ProjectSingleton"
import type { TreeCheckbox } from "../models/tree/TreeCheckbox"
import type { IEnforcer } from "../models/validation/Enforcer"

/**
 * Enforcer class applies modifications to the tree depending on definitions inside of the rules table
 */
export class Enforcer implements IEnforcer {
    rules: Record<string, (value: string | number | boolean) => void> = {
        'DefectSpecificationVariant': (value: string | number | boolean) => { 
            if (value === 19) {
                // Set backwall to enabled
                let enabledNode: any = ProjectSingleton.GetInstance().Tree?.FindChildByPattern('Defect:Surfaces:Backwall:Enabled')
                enabledNode.value = true
            }
        }
    }

    constructor() {
        
    }
    
    public Enforce(treePath: string, value: string | number | boolean) {
        const rule = this.rules[treePath]
        
        if (rule) {
            rule(value)
        }
    }
}