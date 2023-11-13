export interface Button {
    label?: string
    color: string
    icon: string
    action:  () => void
    disabled?: boolean
    hoverColor?: string
    size?: number
    labelSize?: number
}