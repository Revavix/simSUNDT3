export class Tabs
{
    members: Array<Tab>
    activeIdx: number

    constructor(items: Array<Tab>)
    {
        this.members = items;
        this.activeIdx = 0;
    }
}

export class Tab
{
    label: string
    component: ConstructorOfATypedSvelteComponent
    properties: object

    constructor(name: string, page: ConstructorOfATypedSvelteComponent, properties: object)
    {
        this.label = name
        this.component = page
        this.properties = properties
    }
}