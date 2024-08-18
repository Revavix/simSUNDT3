export interface Button {
    label?: string
    color: string
    hoverColor?: string
    icon: string
    action:  () => void
    disabled?: boolean
    size?: number
    labelSize?: number
}