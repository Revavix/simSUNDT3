import type { UTDefectSaver } from "./utDefectSaver";
import type { TreeBool, TreeSelect, TreeSelectMember, TreeNumber, TreeExpandable } from "./treeDef";
import { TreeUtil } from "./treeUtil";

export class UTDefectTreeBinder
{
    method: TreeExpandable
    transmitter: TreeExpandable
    receiver: TreeExpandable
    defect: TreeExpandable
    saver: UTDefectSaver
    accuracy: number


    constructor(
        method: TreeExpandable, 
        transmitter: TreeExpandable, 
        receiver: TreeExpandable, 
        defect: TreeExpandable,
        saver: UTDefectSaver,
        accuracy: number
    ) 
    {
        this.method = method
        this.transmitter = transmitter
        this.receiver = receiver
        this.defect = defect
        this.saver = saver
        this.accuracy = accuracy

        this.Update()
    }

    Update() {
        // Create bindings to UTDefectSaver
        this.saver.LP = this.ConvertNFRToLP(TreeUtil.FindRecursive(this.transmitter, ["Spectrum", "Type"]).selectedItem) 
        this.saver.LS = TreeUtil.FindRecursive(this.method, ["UT Technique", "Method"]).selectedItem
        this.saver.XS = TreeUtil.FindRecursive(this.method, ["Mesh", "Size", "X - Start"]).value
        this.saver.XE = TreeUtil.FindRecursive(this.method, ["Mesh", "Size", "X - End"]).value
        this.saver.XI = TreeUtil.FindRecursive(this.method, ["Mesh", "Size", "X - Increment"]).value
        this.saver.YS = TreeUtil.FindRecursive(this.method, ["Mesh", "Size", "Y - Start"]).value
        this.saver.YE = TreeUtil.FindRecursive(this.method, ["Mesh", "Size", "Y - End"]).value
        this.saver.YI = TreeUtil.FindRecursive(this.method, ["Mesh", "Size", "Y - Increment"]).value
        this.saver.CP = TreeUtil.FindRecursive(this.method, ["Material", "Metal Properties", "Longitudinal Velocity"]).value
        this.saver.CS = TreeUtil.FindRecursive(this.method, ["Material", "Metal Properties", "Transversal Velocity"]).value
        this.saver.DBA = TreeUtil.FindRecursive(this.method, ["Material", "Metal Properties", "Damping"]).value
        this.saver.NFR = TreeUtil.FindRecursive(this.transmitter, ["Spectrum", "Type"]).selectedItem
        this.saver.FREQ = TreeUtil.FindRecursive(this.transmitter, ["Spectrum", "Frequency"]).value
        this.saver.BANDW = TreeUtil.FindRecursive(this.transmitter, ["Spectrum", "Bandwidth"]).value
        this.saver.F1 = TreeUtil.FindRecursive(this.transmitter, ["Spectrum", "Input", "F1"]).value
        this.saver.F2 = TreeUtil.FindRecursive(this.transmitter, ["Spectrum", "Input", "F2"]).value
        this.saver.F3 = TreeUtil.FindRecursive(this.transmitter, ["Spectrum", "Input", "F3"]).value
        this.saver.F4 = TreeUtil.FindRecursive(this.transmitter, ["Spectrum", "Input", "F4"]).value
        this.saver.AF = TreeUtil.FindRecursive(this.transmitter, ["Spectrum", "Input", "Height at F2 (AF)"]).value
        this.saver.BF = TreeUtil.FindRecursive(this.transmitter, ["Spectrum", "Input", "Height at F3 (BF)"]).value
        this.saver.LTTY = TreeUtil.FindRecursive(this.method, ["Time Window", "Type"]).selectedItem
        this.saver.TS = TreeUtil.FindRecursive(this.method, ["Time Window", "Start"]).value
        this.saver.TE = TreeUtil.FindRecursive(this.method, ["Time Window", "End"]).value
        this.saver.TI = TreeUtil.FindRecursive(this.method, ["Time Window", "Increment"]).value
        this.saver.XD = TreeUtil.FindRecursive(this.method, ["Time Window", "X"]).value
        this.saver.YD = TreeUtil.FindRecursive(this.method, ["Time Window", "Y"]).value
        this.saver.ZD = TreeUtil.FindRecursive(this.method, ["Time Window", "Depth"]).value
        this.saver.IMODE[0] = this.ConvertFocusAndTechniqueToIMODE(
            TreeUtil.FindRecursive(this.transmitter, ["Focus", "Type"]).selectedItem,
            TreeUtil.FindRecursive(this.method, ["UT Technique", "Transmitter"]).selectedItem) 
        this.saver.INSTY[0] = (TreeUtil.FindRecursive(this.transmitter, ["Wave", "Suppression"]).value == true) ? 1 : 0
        this.saver.COUP[0] = TreeUtil.FindRecursive(this.transmitter, ["Couplant"]).value
        this.saver.PGA[0] = TreeUtil.FindRecursive(this.transmitter, ["Beam Angles", "Angle"]).value
        this.saver.PSI[0] = TreeUtil.FindRecursive(this.transmitter, ["Beam Angles", "Skew Angle"]).value
        this.saver.ISHA[0] = this.ConvertAutoElementsToISHA(
            TreeUtil.FindRecursive(this.transmitter, ["Shape & Elements", "Auto Num of Elements"]).value, 
            TreeUtil.FindRecursive(this.transmitter, ["Shape & Elements", "Shape"]).selectedItem)
        this.saver.PA[0] = TreeUtil.FindRecursive(this.transmitter, ["Shape & Elements", "X", "Length"]).value
        this.saver.PB[0] = TreeUtil.FindRecursive(this.transmitter, ["Shape & Elements", "Y", "Length"]).value
        this.saver.PD[0] = TreeUtil.FindRecursive(this.transmitter, ["Shape & Elements", "Distance"]).value
        this.saver.NAWX[0] = TreeUtil.FindRecursive(this.transmitter, ["Shape & Elements", "X", "Elements"]).value
        this.saver.NAWY[0] = TreeUtil.FindRecursive(this.transmitter, ["Shape & Elements", "Y", "Elements"]).value
        this.saver.GAPX[0] = TreeUtil.FindRecursive(this.transmitter, ["Shape & Elements", "X", "Gap"]).value
        this.saver.GAPY[0] = TreeUtil.FindRecursive(this.transmitter, ["Shape & Elements", "Y", "Gap"]).value
        this.saver.RHOW[0] = TreeUtil.FindRecursive(this.transmitter, ["Wedge", "Density"]).value
        this.saver.CPW[0] = TreeUtil.FindRecursive(this.transmitter, ["Wedge", "Longitudinal Wavespeed"]).value
        this.saver.CSW[0] = TreeUtil.FindRecursive(this.transmitter, ["Wedge", "Transversal Wavespeed"]).value
        this.saver.PCW[0] = TreeUtil.FindRecursive(this.transmitter, ["Wedge", "Width"]).value
        this.saver.GW[0] = TreeUtil.FindRecursive(this.transmitter, ["Wedge", "Angle"]).value
        this.saver.RF = TreeUtil.FindRecursive(this.transmitter, ["Fluid Specification", "Density Ratio"]).value
        this.saver.CF = TreeUtil.FindRecursive(this.transmitter, ["Fluid Specification", "Fluid Wave Speed"]).value
        this.saver.DBF = TreeUtil.FindRecursive(this.transmitter, ["Fluid Specification", "Damping"]).value
        this.saver.FPHI[0] = TreeUtil.FindRecursive(this.transmitter, ["Euler Angles", "Phi"]).value
        this.saver.FTHE[0] = TreeUtil.FindRecursive(this.transmitter, ["Euler Angles", "Theta"]).value
        this.saver.FPSI[0] = TreeUtil.FindRecursive(this.transmitter, ["Euler Angles", "Psi"]).value
        this.saver.FOC[0] = TreeUtil.FindRecursive(this.transmitter, ["Focus", "Focal Distance"]).value

        // From .NET version => "XSEP and YSEP changes depending on receiver: ADD FUNCTIONALITY FOR THIS", TODO: Investigate this
        this.saver.XSEP = TreeUtil.FindRecursive(this.transmitter, ["Position", "X"]).value
        this.saver.YSEP = TreeUtil.FindRecursive(this.transmitter, ["Position", "X"]).value

        this.saver.LDTY = TreeUtil.FindRecursive(this.defect, ["Specification", "Variant"]).selectedItem
        this.saver.DZ = TreeUtil.FindRecursive(this.defect, ["Specification", "Measurement", "Centre Depth"]).value

        let isBackwallEnabled: boolean = TreeUtil.FindRecursive(this.defect, ["Surfaces", "Backwall", "Enabled"]).value
        let isRoughnessEnabled: boolean = TreeUtil.FindRecursive(this.defect, ["Surfaces", "Roughness", "Enabled"]).value

        if (isBackwallEnabled && isRoughnessEnabled && (this.saver.LDTY == 5 || this.saver.LDTY == 7)) {
            this.saver.LDTY += 30
        } else if (!isBackwallEnabled && isRoughnessEnabled && (this.saver.LDTY == 5 || this.saver.LDTY == 7)) {
            this.saver.LDTY += 20
        } else if (isBackwallEnabled && (this.saver.LDTY >= 1 && this.saver.LDTY <= 7)) {
            this.saver.LDTY += 10
        }

        switch(this.saver.LDTY) {
            case 1:
            case 2:
            case 3:
            case 8:
            case 11:
            case 12:
            case 13:
                this.saver.DA = TreeUtil.FindRecursive(this.defect, ["Specification", "Measurement", "Diameter"]).value
                break
            case 7:
            case 17:
            case 19:
            case 27:
            case 37:
                this.saver.DA = TreeUtil.FindRecursive(this.defect, ["Specification", "Measurement", "Height"]).value
                break
            case 4:
            case 14:
                this.saver.DA = TreeUtil.FindRecursive(this.defect, ["Specification", "Measurement", "Diameter Parallel"]).value
                break
        }

        this.saver.ETHA = TreeUtil.FindRecursive(this.defect, ["Specification", "Angles", "Tilt"]).value
        this.saver.PHI = TreeUtil.FindRecursive(this.defect, ["Specification", "Angles", "Skew"]).value
        this.saver.LDC = TreeUtil.FindRecursive(this.defect, ["Specification", "Circular Properties", "Variant"]).selectedItem
        this.saver.DC = TreeUtil.FindRecursive(this.defect, ["Specification", "Circular Properties", "Stress Quotient"]).value
        this.saver.DAC = TreeUtil.FindRecursive(this.defect, ["Specification", "Circular Properties", "Contact Diameter"]).value
        this.saver.DB = TreeUtil.FindRecursive(this.defect, ["Specification", "Measurement", "Diameter Perpendicular"]).value
        this.saver.DBI = TreeUtil.FindRecursive(this.defect, ["Specification", "Inclusion Properties", "Damping"]).value
        this.saver.A = TreeUtil.FindRecursive(this.defect, ["Specification", "Measurement", "Height"]).value
        this.saver.B = TreeUtil.FindRecursive(this.defect, ["Specification", "Measurement", "Length, Parallel Y-axis"]).value
        this.saver.PS = TreeUtil.FindRecursive(this.defect, ["Specification", "Angles", "Tilt"]).value // Same as this.saver.ETHA, why?
        this.saver.BZ = TreeUtil.FindRecursive(this.defect, ["Surfaces", "Backwall", "Depth"]).value
        this.saver.ET = TreeUtil.FindRecursive(this.defect, ["Surfaces", "Backwall", "Tilt from Horizontal"]).value
        this.saver.EPSI = TreeUtil.FindRecursive(this.defect, ["Surfaces", "Roughness", "RMS Height"]).value
        this.saver.LZ = TreeUtil.FindRecursive(this.defect, ["Surfaces", "Roughness", "Corr. Length"]).value
        this.saver.LCTY = TreeUtil.FindRecursive(this.method, ["Calibration", "Type"]).selectedItem
        this.saver.CA = TreeUtil.FindRecursive(this.method, ["Calibration", "Diameter"]).value
        this.saver.CZ = TreeUtil.FindRecursive(this.method, ["Calibration", "Center Depth"]).value
        this.saver.IA = this.accuracy
        this.saver.XDEF = TreeUtil.FindRecursive(this.defect, ["Position", "X"]).value
        this.saver.YDEF = TreeUtil.FindRecursive(this.defect, ["Position", "Y"]).value
        this.saver.WELD = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Type"]).selectedItem
        this.saver.B1 = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Geometry", "b\u2081"]).value
        this.saver.B2 = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Geometry", "b\u2082"]).value
        this.saver.B3 = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Geometry", "b\u2083"]).value
        this.saver.T1 = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Geometry", "t\u2081"]).value
        this.saver.T1 = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Geometry", "t\u2082"]).value
        this.saver.CALB2A = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "S/N Ratio", "% of SDH"]).value
        this.saver.CALB2D = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "S/N Ratio", "Diameter"]).value
        this.saver.CALB2Z = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "S/N Ratio", "Depth"]).value
        this.saver.LQ = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Parameters", "Input Energy"]).value
        this.saver.T0 = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Parameters", "Initial Temperature"]).value
        this.saver.NN = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Parameters", "Heat efficiency"]).value

        this.saver.CC = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Properties", "Specific Heat"]).value
        this.saver.D0 = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Properties", "Initial Grain Size"]).value
        this.saver.RA = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Properties", "Density"]).value
        this.saver.TMP = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Properties", "Melting Temperature"]).value
        this.saver.KK = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Properties", "Temperature Diffusivity"]).value
        this.saver.Q = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Properties", "Activation Energy"]).value
        this.saver.AA = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Properties", "Exponential Growth Constant"]).value
        this.saver.K0 = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Properties", "Grain BE Constant"]).value

        this.saver.HMT0 = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Control Volume", "Depth"]).value
        this.saver.HMT1 = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Control Volume", "Thickness"]).value
        this.saver.HMX1 = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Control Volume", "X - Start"]).value
        this.saver.HMX2 = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Control Volume", "X - End"]).value
        this.saver.HMY1 = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Control Volume", "Y - Start"]).value
        this.saver.HMY2 = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Control Volume", "Y - End"]).value
        this.saver.HMD0 = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Control Volume", "Grain Size"]).value
        this.saver.HMD1 = TreeUtil.FindRecursive(this.method, ["Mesh", "Weld", "Control Volume", "Initial"]).value

        this.saver.DRR = TreeUtil.FindRecursive(this.defect, ["Specification", "Inclusion Properties", "Relative Density"]).value
        this.saver.CPI = TreeUtil.FindRecursive(this.defect, ["Specification", "Inclusion Properties", "Longitudinal Velocity"]).value
        this.saver.CSI = TreeUtil.FindRecursive(this.defect, ["Specification", "Inclusion Properties", "Transversal Velocity"]).value
    }

    ConvertNFRToLP(n: number) {
        switch(n)
        {
            case 0:
            case -1:
                return 1
            case 1: 
                return 3
        }

        return 0
    }

    ConvertFocusAndTechniqueToIMODE(focusType: number, technique: number) {
        if (focusType < 0) {
            return focusType + technique
        } else {
            return focusType - technique
        }
    }

    ConvertAutoElementsToISHA(autoNumElements: boolean, isha: number) {
        if (!autoNumElements) {
            return isha
        } else {
            return -isha
        }
    }
}