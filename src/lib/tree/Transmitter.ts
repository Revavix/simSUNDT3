import { TreeCheckbox } from "../models/tree/TreeCheckbox"
import { TreeDropdown } from "../models/tree/TreeDropdown"
import type TreeDropdownOption from "../models/tree/TreeDropdownOption"
import { TreeInput } from "../models/tree/TreeInput"
import TreeNode from "../models/tree/TreeNode"

// Transmitter
const Transmitter = new TreeNode("Transmitter", false, false)

// Transmitter:ShapeAndElements
const shapeAndElements = Transmitter.AddChild(new TreeNode("Shape and Elements", true, false))
shapeAndElements.AddChild(new TreeDropdown("Type", null, [
    {
        text: "Rectangular",
        value: -1
    },
    {
        text: "Elliptic",
        value: -2
    }
] as Array<TreeDropdownOption>, -1))
shapeAndElements.AddChild(new TreeCheckbox("Auto Num Elements", null, true))

// Transmitter:ShapeAndElements:X
const shapeAndElementsX = shapeAndElements.AddChild(new TreeNode("X", true, false))
shapeAndElementsX.AddChild(new TreeInput("Length", "PA [0]", 9.5, true))
shapeAndElementsX.AddChild(new TreeInput("Elements", "NAWX [0]", 16, true))
shapeAndElementsX.AddChild(new TreeInput("Gap", "GAPX [0]", 0, true))

// Transmitter:ShapeAndElements:Y
const shapeAndElementsY = shapeAndElements.AddChild(new TreeNode("Y", true, false))
shapeAndElementsY.AddChild(new TreeInput("Length", "PB [0]", 9.5, true))
shapeAndElementsY.AddChild(new TreeInput("Elements", "NAWY [0]", 16, true))
shapeAndElementsY.AddChild(new TreeInput("Gap", "GAPY [0]", 0, true))

// Transmitter:Spectrum
const spectrum = Transmitter.AddChild(new TreeNode("Spectrum", true, false))
spectrum.AddChild(new TreeDropdown("Type", "NFR", [
    {
        text: "Cosine Square",
        value: -1
    },
    {
        text: "Monochromatic",
        value: 1
    },
    {
        text: "Input Spectrum",
        value: 0
    }
] as Array<TreeDropdownOption>, -1))
spectrum.AddChild(new TreeInput("Frequency", "FREQ", 1.25, true))
spectrum.AddChild(new TreeInput("Bandwidth", "BANDW", 1, true))

// Transmitter:Spectrum:Input
const spectrumInput = spectrum.AddChild(new TreeNode("Input", true, false))
spectrumInput.AddChild(new TreeInput("F1", "F1", 0, true))
spectrumInput.AddChild(new TreeInput("F2", "F2", -3.5, true))
spectrumInput.AddChild(new TreeInput("F3", "F3", 4.75, true))
spectrumInput.AddChild(new TreeInput("F4", "F4", 6.5, true))
spectrumInput.AddChild(new TreeInput("Height at F2 (AF)", "AF", 100, true))
spectrumInput.AddChild(new TreeInput("Height at F3 (BF)", "BF", 100, true))

// Transmitter:Focus
const focus = Transmitter.AddChild(new TreeNode("Focus", true, false))
focus.AddChild(new TreeDropdown("Type", null, [
    {
        text: "Unfocused",
        value: 0
    },
    {
        text: "Line Focused",
        value: 10
    },
    {
        text: "Point Focused",
        value: 20
    }
] as Array<TreeDropdownOption>, 0))
focus.AddChild(new TreeInput("Focal Distance", "FOC", 0, true))

// Transmitter:Position
const position = Transmitter.AddChild(new TreeNode("Position", true, false))
position.AddChild(new TreeInput("X", "XSEP", 0, true))
position.AddChild(new TreeInput("Y", "YSEP", 0, true))

// Transmitter:Wave
const wave = Transmitter.AddChild(new TreeNode("Wave", true, false))
wave.AddChild(new TreeDropdown("Type", null, [
    {
        text: "Longitudinal",
        value: 0
    },
    {
        text: "Transversal (vert. pol)",
        value: 1
    },
    {
        text: "Transversal (hori. pol)",
        value: 2
    }
] as Array<TreeDropdownOption>, 0))
wave.AddChild(new TreeCheckbox("Suppression", "INSTY [0]", false))

// Transmitter:BeamAngles
const beamAngles = Transmitter.AddChild(new TreeNode("Beam Angles", true, false))
beamAngles.AddChild(new TreeInput("Angle", "PGA [0]", 45, true))
beamAngles.AddChild(new TreeInput("Skew Angle", "PSI [0]", 0, true))

// Transmitter:Wedge
const wedge = Transmitter.AddChild(new TreeNode("Wedge", true, false))
wedge.AddChild(new TreeInput("Longitudinal Wavespeed", "CPW [0]", 6320, true))
wedge.AddChild(new TreeInput("Transversal Wavespeed", "CSW [0]", 3130, true))
wedge.AddChild(new TreeInput("Density", "RHOW [0]", 2.7, true))
wedge.AddChild(new TreeInput("Angle", "GW [0]", 49, true))
wedge.AddChild(new TreeInput("Width", "PCW [0]", 2, true))

// Transmitter:EulerAngles
const eulerAngles = Transmitter.AddChild(new TreeNode("Euler Angles", true, false))
eulerAngles.AddChild(new TreeInput("Phi", "FPHI [0]", 0, true))
eulerAngles.AddChild(new TreeInput("Theta", "FTHE [0]", 0, true))
eulerAngles.AddChild(new TreeInput("Psi", "FPSI [0]", 0, true))

// Transmitter:FluidSpecification
const fluidSpecification = Transmitter.AddChild(new TreeNode("Fluid Specification", true, false))
fluidSpecification.AddChild(new TreeInput("Density Ratio", "RF", 0, true))
fluidSpecification.AddChild(new TreeInput("Fluid Wavespeed", "CF", 0, true))
fluidSpecification.AddChild(new TreeInput("Damping", "DBF", 0, true))

// Transmitter:Couplant
const couplant = Transmitter.AddChild(new TreeInput("Couplant", "COUP [0]", 0, true))

// Transmitter:DistanceProbeSurface
const distanceToProbe = Transmitter.AddChild(new TreeInput("Distance - Probe/Surface", "PD [0]", 0, true))

export default Transmitter