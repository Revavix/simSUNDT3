import { TreeCheckbox } from "../models/tree/TreeCheckbox";
import { TreeDropdown } from "../models/tree/TreeDropdown";
import type TreeDropdownOption from "../models/tree/TreeDropdownOption";
import { TreeInput } from "../models/tree/TreeInput";
import TreeNode from "../models/tree/TreeNode";

// Receiver
const Receiver = new TreeNode("Receiver", false, false)

// Receiver:ShapeAndElements
const shapeAndElements = Receiver.AddChild(new TreeNode("Shape and Elements", true, false))
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
shapeAndElements.AddChild(new TreeCheckbox("Auto Num Elements", null, false))

// Receiver:ShapeAndElements:X
const shapeAndElementsX = shapeAndElements.AddChild(new TreeNode("X", true, false))
shapeAndElementsX.AddChild(new TreeInput("Length", "PA [1]", 9.5, true))
shapeAndElementsX.AddChild(new TreeInput("Elements", "NAWX [1]", 16, true))
shapeAndElementsX.AddChild(new TreeInput("Gap", "GAPX [1]", 0, true))

// Receiver:ShapeAndElements:Y
const shapeAndElementsY = shapeAndElements.AddChild(new TreeNode("Y", true, false))
shapeAndElementsY.AddChild(new TreeInput("Length", "PB [1]", 9.5, true))
shapeAndElementsY.AddChild(new TreeInput("Elements", "NAWY [1]", 16, true))
shapeAndElementsY.AddChild(new TreeInput("Gap", "GAPY [1]", 0, true))

// Receiver:Focus
const focus = Receiver.AddChild(new TreeNode("Focus", true, false))
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
focus.AddChild(new TreeInput("Focal Distance", "FOC [1]", 0, true))

// Receiver:Separation
const separation = Receiver.AddChild(new TreeNode("Separation", true, false))
separation.AddChild(new TreeInput("X", "XSEP [1]", 0, true))
separation.AddChild(new TreeInput("Y", "YSEP [1]", 0, true))

// Receiver:Wave
const wave = Receiver.AddChild(new TreeNode("Wave", true, false))
wave.AddChild(new TreeCheckbox("Suppression", "INSTY [1]", false))

// Receiver:BeamAngles
const beamAngles = Receiver.AddChild(new TreeNode("Beam Angles", true, false))
beamAngles.AddChild(new TreeInput("Angle", "PGA [1]", 45, true))
beamAngles.AddChild(new TreeInput("Skew Angle", "PSI [1]", 0, true))

// Receiver:Wedge
const wedge = Receiver.AddChild(new TreeNode("Wedge", true, false))
wedge.AddChild(new TreeInput("Longitudinal Wavespeed", "CPW [0]", 6320, true))
wedge.AddChild(new TreeInput("Transversal Wavespeed", "CSW [0]", 3130, true))
wedge.AddChild(new TreeInput("Density", "RHOW [0]", 2.7, true))
wedge.AddChild(new TreeInput("Angle", "GW [0]", 49, true))
wedge.AddChild(new TreeInput("Width", "PCW [0]", 2, true))

// Transmitter:EulerAngles
const eulerAngles = Receiver.AddChild(new TreeNode("Euler Angles", true, false))
eulerAngles.AddChild(new TreeInput("Phi", "FPHI [1]", 0, true))
eulerAngles.AddChild(new TreeInput("Theta", "FTHE [1]", 0, true))
eulerAngles.AddChild(new TreeInput("Psi", "FPSI [1]", 0, true))

// Transmitter:Couplant
const couplant = Receiver.AddChild(new TreeInput("Couplant", "COUP [1]", 0, true))

// Transmitter:DistanceProbeSurface
const distanceToProbe = Receiver.AddChild(new TreeInput("Distance - Probe/Surface", "PD [1]", 0, true))

// Receiver:FocusDepth
const focusDepth = Receiver.AddChild(new TreeInput("Focus Depth", "Unknown", 0, true))

export default Receiver