export class Button {
    label: string
    icon: string
    action: Function
    color: string

    constructor(name: string, color: string, materialIconName: string, actionToExec: Function)
    {
        this.label = name;
        this.color = color;
        this.icon = materialIconName;
        this.action = actionToExec;
    }
}