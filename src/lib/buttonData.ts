export class Button {
    label: string
    icon: string
    action: Function

    constructor(name: string, materialIconName: string, actionToExec: Function)
    {
        this.label = name;
        this.icon = materialIconName;
        this.action = actionToExec;
    }
}