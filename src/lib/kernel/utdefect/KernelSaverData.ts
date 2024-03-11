import { ProjectSingleton } from "../../data/ProjectSingleton"
import type { TreeCheckbox } from "../../models/tree/TreeCheckbox"
import type { TreeDropdown } from "../../models/tree/TreeDropdown"
import type { TreeInput } from "../../models/tree/TreeInput"
import type TreeNode from "../../models/tree/TreeNode"

export default class KernelSaverData {
    LS: number
    LP: number
    XS: number
    XE: number
    XI: number
    YS: number
    YE: number
    YI: number
    CP: number
    CS: number
    DBA: number
    NFR: number
    FREQ: number
    BANDW: number
    F1: number
    F2: number
    F3: number
    F4: number
    AF: number
    BF: number
    LTTY: number
    TS: number
    TE: number
    TI: number
    XD: number
    YD: number
    ZD: number
    IMODE: Array<number>
    ISHA: Array<number>
    INSTY: Array<number>
    COUP: Array<number>
    PGA: Array<number>
    PSI: Array<number>
    PA: Array<number>
    PB: Array<number>
    NAWX: Array<number>
    NAWY: Array<number>
    GAPX: Array<number>
    GAPY: Array<number>
    RHOW: Array<number>
    CPW: Array<number>
    CSW: Array<number>
    PCW: Array<number>
    GW: Array<number>
    FOC: Array<number>
    XSEP: number
    YSEP: number
    PD: Array<number>
    RF: number
    CF: number
    FPHI: Array<number>
    FTHE: Array<number>
    FPSI: Array<number>
    DBF: number
    LDTY: number
    DZ: number
    DA: number
    DB: number
    A: number
    B: number
    DRR: number
    CPI: number
    CSI: number
    DBI: number
    ETHA: number
    PHI: number
    LDC: number
    DC: number
    DAC: number
    PS: number
    ET: number
    DEL: number = 0
    BZ: number
    EPSI: number
    LZ: number
    LCTY: number
    CA: number
    CZ: number
    IA: number
    XDEF: number
    YDEF: number
    WELD: string
    B1: number
    B2: number
    B3: number
    T1: number
    T2: number
    CALB2A: number
    CALB2D: number
    CALB2Z: number
    LQ: number
    T0: number
    NN: number
    CC: number
    D0: number
    RA: number
    TMP: number
    KK: number
    Q: number
    AA: number
    K0: number
    HMT0: number
    HMT1: number
    HMX1: number
    HMX2: number
    HMY1: number
    HMY2: number
    HMD0: number
    HMD1: number
    DET: boolean
    DER: boolean
    DEIXYT: Array<number>
    DEIXYR: Array<number>
    NDE: Array<number>

    constructor(node: TreeNode) {
        this.LS = (node.FindChildByPattern("Method:UTTechnique:ProbeType") as TreeDropdown)?.value 
        this.LP = this.calculateLP((node.FindChildByPattern("Transmitter:Spectrum:Type") as TreeDropdown)?.value)
        this.XS = (node.FindChildByPattern("Method:Mesh:Size:XStart") as TreeInput)?.value
        this.XE = (node.FindChildByPattern("Method:Mesh:Size:XEnd") as TreeInput)?.value
        this.XI = (node.FindChildByPattern("Method:Mesh:Size:XIncrement") as TreeInput)?.value
        this.YS = (node.FindChildByPattern("Method:Mesh:Size:YStart") as TreeInput)?.value
        this.YE = (node.FindChildByPattern("Method:Mesh:Size:YEnd") as TreeInput)?.value
        this.YI = (node.FindChildByPattern("Method:Mesh:Size:YIncrement") as TreeInput)?.value
        this.CP = (node.FindChildByPattern("Method:Material:MetalProperties:LongitudinalVelocity") as TreeInput)?.value / 1000
        this.CS = (node.FindChildByPattern("Method:Material:MetalProperties:TransversalVelocity") as TreeInput)?.value / 1000
        this.DBA = (node.FindChildByPattern("Method:Material:MetalProperties:Damping") as TreeInput)?.value
        this.NFR = (node.FindChildByPattern("Transmitter:Spectrum:Type") as TreeDropdown)?.value
        this.FREQ = (node.FindChildByPattern("Transmitter:Spectrum:Frequency") as TreeInput)?.value
        this.BANDW = (node.FindChildByPattern("Transmitter:Spectrum:Bandwidth") as TreeInput)?.value
        this.F1 = (node.FindChildByPattern("Transmitter:Spectrum:Input:F1") as TreeInput)?.value
        this.F2 = (node.FindChildByPattern("Transmitter:Spectrum:Input:F2") as TreeInput)?.value
        this.F3 = (node.FindChildByPattern("Transmitter:Spectrum:Input:F3") as TreeInput)?.value
        this.F4 = (node.FindChildByPattern("Transmitter:Spectrum:Input:F4") as TreeInput)?.value
        this.AF = (node.FindChildByPattern("Transmitter:Spectrum:Input:HeightatF2AF") as TreeInput)?.value
        this.BF = (node.FindChildByPattern("Transmitter:Spectrum:Input:HeightatF3BF") as TreeInput)?.value
        this.LTTY = (node.FindChildByPattern("Method:TimeWindow:Type") as TreeDropdown)?.value
        this.TS = (node.FindChildByPattern("Method:TimeWindow:Start") as TreeInput)?.value
        this.TE = (node.FindChildByPattern("Method:TimeWindow:End") as TreeInput)?.value
        this.TI = (node.FindChildByPattern("Method:TimeWindow:Increment") as TreeInput)?.value
        this.XD = (node.FindChildByPattern("Method:TimeWindow:X") as TreeInput)?.value
        this.YD = (node.FindChildByPattern("Method:TimeWindow:Y") as TreeInput)?.value
        this.ZD = (node.FindChildByPattern("Method:TimeWindow:Depth") as TreeInput)?.value
        this.IMODE = [
            this.calculateIMODE(
                (node.FindChildByPattern("Transmitter:Focus:Type") as TreeDropdown)?.value, 
                (node.FindChildByPattern("Method:UTTechnique:Transmitter") as TreeDropdown)?.value
            ),
            this.calculateIMODE(
                (node.FindChildByPattern("Receiver:Focus:Type") as TreeDropdown)?.value, 
                (node.FindChildByPattern("Method:UTTechnique:Receiver") as TreeDropdown)?.value
            )
        ]
        this.ISHA = [
            this.calculateISHA(
                (node.FindChildByPattern("Transmitter:ShapeandElements:AutoNumElements") as TreeCheckbox)?.value,
                (node.FindChildByPattern("Transmitter:ShapeandElements:Type") as TreeInput)?.value
            ),
            this.calculateISHA(
                (node.FindChildByPattern("Receiver:ShapeandElements:AutoNumElements") as TreeCheckbox)?.value,
                (node.FindChildByPattern("Receiver:ShapeandElements:Type") as TreeInput)?.value
            )
        ]
        this.INSTY = [
            (node.FindChildByPattern("Transmitter:Wave:Suppression") as TreeCheckbox)?.value === true ? 1 : 0,
            (node.FindChildByPattern("Receiver:Wave:Suppression") as TreeCheckbox)?.value === true ? 1 : 0
        ]
        this.COUP = [
            (node.FindChildByPattern("Transmitter:Couplant") as TreeCheckbox)?.value === true ? 1 : 0,
            (node.FindChildByPattern("Receiver:Couplant") as TreeCheckbox)?.value === true ? 1 : 0
        ]
        this.PGA = [
            (node.FindChildByPattern("Transmitter:BeamAngles:Angle") as TreeInput)?.value,
            (node.FindChildByPattern("Receiver:BeamAngles:Angle") as TreeInput)?.value
        ]
        this.PSI = [
            (node.FindChildByPattern("Transmitter:BeamAngles:SkewAngle") as TreeInput)?.value,
            (node.FindChildByPattern("Receiver:BeamAngles:SkewAngle") as TreeInput)?.value
        ]
        this.PA = [
            (node.FindChildByPattern("Transmitter:ShapeandElements:X:Length") as TreeInput)?.value,
            (node.FindChildByPattern("Receiver:ShapeandElements:X:Length") as TreeInput)?.value
        ]
        this.PB = [
            (node.FindChildByPattern("Transmitter:ShapeandElements:Y:Length") as TreeInput)?.value,
            (node.FindChildByPattern("Receiver:ShapeandElements:Y:Length") as TreeInput)?.value
        ]
        this.NAWX = [
            (node.FindChildByPattern("Transmitter:ShapeandElements:X:Elements") as TreeInput)?.value,
            (node.FindChildByPattern("Receiver:ShapeandElements:X:Elements") as TreeInput)?.value
        ]
        this.NAWY = [
            (node.FindChildByPattern("Transmitter:ShapeandElements:Y:Elements") as TreeInput)?.value,
            (node.FindChildByPattern("Receiver:ShapeandElements:Y:Elements") as TreeInput)?.value
        ]
        this.GAPX = [
            (node.FindChildByPattern("Transmitter:ShapeandElements:X:Gap") as TreeInput)?.value,
            (node.FindChildByPattern("Receiver:ShapeandElements:X:Gap") as TreeInput)?.value
        ]
        this.GAPY = [
            (node.FindChildByPattern("Transmitter:ShapeandElements:Y:Gap") as TreeInput)?.value,
            (node.FindChildByPattern("Receiver:ShapeandElements:Y:Gap") as TreeInput)?.value
        ]
        this.RHOW = [
            (node.FindChildByPattern("Transmitter:Wedge:Density") as TreeInput)?.value,
            (node.FindChildByPattern("Receiver:Wedge:Density") as TreeInput)?.value
        ]
        this.CPW = [
            (node.FindChildByPattern("Transmitter:Wedge:LongitudinalWavespeed") as TreeInput)?.value / 1000,
            (node.FindChildByPattern("Receiver:Wedge:LongitudinalWavespeed") as TreeInput)?.value / 1000
        ]
        this.CSW = [
            (node.FindChildByPattern("Transmitter:Wedge:TransversalWavespeed") as TreeInput)?.value / 1000,
            (node.FindChildByPattern("Receiver:Wedge:TransversalWavespeed") as TreeInput)?.value / 1000
        ]
        this.PCW = [
            (node.FindChildByPattern("Transmitter:Wedge:Width") as TreeInput)?.value,
            (node.FindChildByPattern("Receiver:Wedge:Width") as TreeInput)?.value
        ]
        this.GW = [
            (node.FindChildByPattern("Transmitter:Wedge:Angle") as TreeInput)?.value,
            (node.FindChildByPattern("Receiver:Wedge:Angle") as TreeInput)?.value
        ]
        this.FOC = [
            (node.FindChildByPattern("Transmitter:Focus:FocalDistance") as TreeInput)?.value,
            (node.FindChildByPattern("Receiver:Focus:FocalDistance") as TreeInput)?.value
        ]
        this.XSEP = (node.FindChildByPattern("Transmitter:Position:X") as TreeInput)?.value + (node.FindChildByPattern("Receiver:Separation:X") as TreeInput)?.value
        this.YSEP = (node.FindChildByPattern("Transmitter:Position:Y") as TreeInput)?.value + (node.FindChildByPattern("Receiver:Separation:Y") as TreeInput)?.value
        this.PD = [
            (node.FindChildByPattern("Transmitter:DistanceProbeSurface") as TreeInput)?.value,
            (node.FindChildByPattern("Receiver:DistanceProbeSurface") as TreeInput)?.value,
        ]
        this.RF = (node.FindChildByPattern("Transmitter:FluidSpecification:DensityRatio") as TreeInput)?.value
        this.CF = (node.FindChildByPattern("Transmitter:FluidSpecification:FluidWavespeed") as TreeInput)?.value / 1000
        this.FPHI = [
            (node.FindChildByPattern("Transmitter:EulerAngles:Phi") as TreeInput)?.value,
            (node.FindChildByPattern("Receiver:EulerAngles:Phi") as TreeInput)?.value
        ]
        this.FTHE = [
            (node.FindChildByPattern("Transmitter:EulerAngles:Theta") as TreeInput)?.value,
            (node.FindChildByPattern("Receiver:EulerAngles:Theta") as TreeInput)?.value
        ]
        this.FPSI = [
            (node.FindChildByPattern("Transmitter:EulerAngles:Psi") as TreeInput)?.value,
            (node.FindChildByPattern("Receiver:EulerAngles:Psi") as TreeInput)?.value
        ]
        this.DBF = (node.FindChildByPattern("Transmitter:FluidSpecification:Damping") as TreeInput)?.value
        this.LDTY = (node.FindChildByPattern("Defect:Specification:Variant") as TreeDropdown)?.value
        this.DZ = (node.FindChildByPattern("Defect:Specification:Measurement:CentreDepth") as TreeInput)?.value
        this.DA = (node.FindChildByPattern("Defect:Specification:Measurement:Diameter") as TreeInput)?.value

        let isBackwallEnabled = (node.FindChildByPattern("Defect:Surfaces:Backwall:Enabled") as TreeCheckbox)?.value
        let isRoughnessEnabled = (node.FindChildByPattern("Defect:Surfaces:Roughness:Enabled") as TreeCheckbox)?.value
    
        if (isBackwallEnabled && isRoughnessEnabled && (this.LDTY == 5 || this.LDTY == 7)) {
            this.LDTY += 30
        } else if (!isBackwallEnabled && isRoughnessEnabled && (this.LDTY == 5 || this.LDTY == 7)) {
            this.LDTY += 20
        } else if (isBackwallEnabled && (this.LDTY >= 1 && this.LDTY <= 7)) {
            this.LDTY += 10
        }
    
        // If the defect is a crack, then the diameter is the crack height
        // otherwise, if the defect is a spheroidal, then the measurement
        // is comprised of a parallel diameter and a perpendicular one
        if (this.LDTY == 7 || this.LDTY == 17 || this.LDTY == 19 || this.LDTY == 27 ||
            this.LDTY == 37) {
            this.DA = (node.FindChildByPattern("Defect:Specification:Measurement:Height") as TreeInput)?.value
        } else if (this.LDTY == 4 || this.LDTY == 14) {
            this.DA = (node.FindChildByPattern("Defect:Specification:Measurement:DiameterParallel") as TreeInput)?.value
        }

        this.DB = (node.FindChildByPattern("Defect:Specification:Measurement:DiameterPerpendicular") as TreeInput)?.value
        this.A = (node.FindChildByPattern("Defect:Specification:Measurement:Length") as TreeInput)?.value
        this.B = (node.FindChildByPattern("Defect:Specification:Measurement:LengthParallel") as TreeInput)?.value
        this.DRR = (node.FindChildByPattern("Defect:Specification:InclusionProperties:RelativeDensity") as TreeInput)?.value
        this.CPI = (node.FindChildByPattern("Defect:Specification:InclusionProperties:LongitudinalWavespeed") as TreeInput)?.value / 1000
        this.CSI = (node.FindChildByPattern("Defect:Specification:InclusionProperties:TransversalWavespeed") as TreeInput)?.value / 1000
        this.DBI = (node.FindChildByPattern("Defect:Specification:InclusionProperties:Damping") as TreeInput)?.value
        this.ETHA = (node.FindChildByPattern("Defect:Specification:Angles:Tilt") as TreeInput)?.value
        this.PHI = (node.FindChildByPattern("Defect:Specification:Angles:Skew") as TreeInput)?.value
        this.LDC = (node.FindChildByPattern("Defect:Surfaces:Backwall:Enabled") as TreeDropdown)?.value
        this.DC = (node.FindChildByPattern("Defect:Specification:CircularProperties:StressQuotient") as TreeInput)?.value
        this.DAC = (node.FindChildByPattern("Defect:Specification:CircularProperties:ContactDiameter") as TreeInput)?.value
        this.PS = (node.FindChildByPattern("Defect:Specification:Angles:TiltCrack") as TreeInput)?.value
        this.ET = (node.FindChildByPattern("Defect:Surfaces:Backwall:TiltHorizontal") as TreeInput)?.value
        this.BZ = (node.FindChildByPattern("Defect:Surfaces:Backwall:Depth") as TreeInput)?.value
        this.EPSI = (node.FindChildByPattern("Defect:Surfaces:Roughness:RMSHeight") as TreeInput)?.value
        this.LZ = (node.FindChildByPattern("Defect:Surfaces:Roughness:CorrelationLength") as TreeInput)?.value
        this.LCTY = (node.FindChildByPattern("Method:Calibration:Type") as TreeDropdown)?.value
        this.CA = (node.FindChildByPattern("Method:Calibration:Diameter") as TreeInput)?.value
        this.CZ = (node.FindChildByPattern("Method:Calibration:Depth") as TreeInput)?.value
        this.IA = Number.parseInt(ProjectSingleton.GetInstance().Misc.accuracy) // Tie to global setting
        this.XDEF = (node.FindChildByPattern("Defect:Position:X") as TreeInput)?.value
        this.YDEF = (node.FindChildByPattern("Defect:Position:Y") as TreeInput)?.value
        this.WELD = this.getWeldName((node.FindChildByPattern("Method:Mesh:Weld:Type") as TreeDropdown)?.value)
        this.B1 = (node.FindChildByPattern("Method:Mesh:Weld:Geometry:B1") as TreeInput)?.value
        this.B2 = (node.FindChildByPattern("Method:Mesh:Weld:Geometry:B2") as TreeInput)?.value
        this.B3 = (node.FindChildByPattern("Method:Mesh:Weld:Geometry:B3") as TreeInput)?.value
        this.T1 = (node.FindChildByPattern("Method:Mesh:Weld:Geometry:T1") as TreeInput)?.value
        this.T2 = (node.FindChildByPattern("Method:Mesh:Weld:Geometry:T2") as TreeInput)?.value
        this.CALB2A = (node.FindChildByPattern("Method:Mesh:Weld:SNRatio:ofSDH") as TreeInput)?.value
        this.CALB2D = (node.FindChildByPattern("Method:Mesh:Weld:SNRatio:Diameter") as TreeInput)?.value
        this.CALB2Z = (node.FindChildByPattern("Method:Mesh:Weld:SNRatio:Depth") as TreeInput)?.value
        this.LQ = (node.FindChildByPattern("Method:Mesh:Weld:Parameters:InputEnergy") as TreeInput)?.value
        this.T0 = (node.FindChildByPattern("Method:Mesh:Weld:Parameters:InitialTemperature") as TreeInput)?.value
        this.NN = (node.FindChildByPattern("Method:Mesh:Weld:Parameters:HeatEfficiency") as TreeInput)?.value
        this.CC = (node.FindChildByPattern("Method:Mesh:Weld:Properties:SpecificHeat") as TreeInput)?.value
        this.D0 = (node.FindChildByPattern("Method:Mesh:Weld:Properties:InitialGrainSize") as TreeInput)?.value
        this.RA = (node.FindChildByPattern("Method:Mesh:Weld:Properties:Density") as TreeInput)?.value
        this.TMP = (node.FindChildByPattern("Method:Mesh:Weld:Properties:MeltingTemperature") as TreeInput)?.value
        this.KK = (node.FindChildByPattern("Method:Mesh:Weld:Properties:TemperatureDiffusivity") as TreeInput)?.value
        this.Q = (node.FindChildByPattern("Method:Mesh:Weld:Properties:ActivationEnergy") as TreeInput)?.value
        this.AA = (node.FindChildByPattern("Method:Mesh:Weld:Properties:ExponentialGrowthConstant") as TreeInput)?.value
        this.K0 = (node.FindChildByPattern("Method:Mesh:Weld:Properties:GrainBoundaryEnergyConstant") as TreeInput)?.value
        this.HMT0 = (node.FindChildByPattern("Method:Mesh:Weld:ControlVolume:Depth") as TreeInput)?.value
        this.HMT1 = (node.FindChildByPattern("Method:Mesh:Weld:ControlVolume:Thickness") as TreeInput)?.value
        this.HMX1 = (node.FindChildByPattern("Method:Mesh:Weld:ControlVolume:XStart") as TreeInput)?.value
        this.HMX2 = (node.FindChildByPattern("Method:Mesh:Weld:ControlVolume:XEnd") as TreeInput)?.value
        this.HMY1 = (node.FindChildByPattern("Method:Mesh:Weld:ControlVolume:YStart") as TreeInput)?.value
        this.HMY2 = (node.FindChildByPattern("Method:Mesh:Weld:ControlVolume:YEnd") as TreeInput)?.value
        this.HMD0 = (node.FindChildByPattern("Method:Mesh:Weld:ControlVolume:GrainSize") as TreeInput)?.value
        this.HMD1 = (node.FindChildByPattern("Method:Mesh:Weld:ControlVolume:Initial") as TreeInput)?.value
        this.DET = false // Dead elements for phased array, transmitter
        this.DER = false // Dead elements for phased array, receiver
        this.DEIXYT = []
        this.DEIXYR = []
        this.NDE = [0, 0]
    }

    private calculateLP(n: number) {
        if (n === 1) {
            return 3
        } else if (n === 0 || n === -1) {
            return 1
        }
    
        return 0
    }

    private calculateIMODE(focus: number, technique: number) {
        if (technique > 0) {
            return technique + focus
        } else {
            return technique - focus
        }
    }
    
    private calculateISHA(autoNumElements: boolean, isha: number) {
        if (!autoNumElements) {
            return isha
        } else {
            return -isha
        }
    }

    private getWeldName(weld: number): string {
        switch (weld) {
            case 0:
                return "No Weld Specified"
            case 1:
                return "Welding_Parameters"
            case 2:
                return "Hard_Measurement"
            default:
                return "No Weld Specified"
        }
    }
}