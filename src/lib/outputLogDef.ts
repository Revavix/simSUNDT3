export class OutputLogItem
{
    icon: string
    msg: string
    color: string
    timestamp: string

    constructor(iconId: string, message: string, color: string)
    {
        this.icon = iconId
        this.msg = message
        this.color = color

        this.timestamp = new Date().toLocaleString()
    }
}

export class OutputLog
{
    contents: Array<OutputLogItem>
    minimized: boolean

    constructor(min: boolean)
    {
        this.contents = []
        this.minimized = min
    }

    AddMessage(iconId: string, message: string, color: string)
    {
        this.contents.push(new OutputLogItem(iconId, message, color))
    }

    Purge()
    {
        this.contents.splice(0)
    }
}