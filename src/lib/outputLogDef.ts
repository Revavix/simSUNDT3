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