export interface Preset {
    name: string
    manufacturer: string
    manufacturerHref: string | null,
    datasheetHref: string | null,
    frequency: number
    pb: number
    angle: number
    dimensions: {
        x: number
        y: number
    }
}