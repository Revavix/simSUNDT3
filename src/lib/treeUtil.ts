export class TreeUtil
{
    static FindRecursive(tree: object, arrayOfEntries: Array<string>) {

        const childIndex: number = this.FindIndex(tree['value'], arrayOfEntries[0])

        if (childIndex >= 0) {
            arrayOfEntries.shift()
            return this.FindRecursive(tree['value'][childIndex], arrayOfEntries)
        }

        try {
            return tree
        } catch {
            return null
        }
    }

    static FindIndex(values: Array<object>, childName: string) {
        if (!childName) { return -1 }

        for(let i = 0; i < values.length; i++)
        {
            if (values[i]["label"] === childName) { 
                return i 
            }
            
        }

        return -1
    }
}