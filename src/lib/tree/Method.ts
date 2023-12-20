import { TreeDropdown } from "../models/tree/TreeDropdown"
import type TreeDropdownOption from "../models/tree/TreeDropdownOption"
import { TreeInput } from "../models/tree/TreeInput"
import TreeNode from "../models/tree/TreeNode"
import Root from "./Root"

// Method
const Method = new TreeNode("Method", false, false)

// Method:Material
const material = Method.AddChild(new TreeNode("Material", true, false))
material.AddChild(new TreeDropdown("Symmetry", "LISO", [
    {
        text: "Isotropic",
        value: 2
    },
    {
        text: "Transversaly Isotropic",
        value: 4
    },
    {
        text: "Orthotropic",
        value: -2
    }
] as Array<TreeDropdownOption>, 2))
material.AddChild(new TreeInput("Density", "RHO", 0, true)) // Unverified identity

// Method:Material:MetalProperties
const metalProperties = material.AddChild(new TreeNode("Metal Properties", true, false))
metalProperties.AddChild(new TreeInput("Longitudinal Velocity", "CP", 5900, true))
metalProperties.AddChild(new TreeInput("Transversal Velocity", "CS", 3230, true))
metalProperties.AddChild(new TreeInput("Damping", "DBA", 0, true))   // Unverified identity

// Method:Material:Constants
const constants = material.AddChild(new TreeNode("Constants", true, false))
constants.AddChild(new TreeInput("C11", "C11", 250, true))
constants.AddChild(new TreeInput("C22", "C22", 250, true))
constants.AddChild(new TreeInput("C33", "C33", 240, true))
constants.AddChild(new TreeInput("C12", "C12", 108, true))
constants.AddChild(new TreeInput("C13", "C13", 84, true))
constants.AddChild(new TreeInput("C23", "C23", 84, true))
constants.AddChild(new TreeInput("C44", "C44", 116, true))
constants.AddChild(new TreeInput("C55", "C55", 116, true))
constants.AddChild(new TreeInput("C66", "C66", 71, true))

// Method:Material:Eulers
const eulers = material.AddChild(new TreeNode("Eulers", true, false))
eulers.AddChild(new TreeInput("Phi", "PHI", 0, true))        // Unverified identity
eulers.AddChild(new TreeInput("Theta", "THETA", 0, true))    // Unverified identity
eulers.AddChild(new TreeInput("Psi", "PSI", 0, true))        // Unverified identity

// Method:UTTechnique
const utTechnique = Method.AddChild(new TreeNode("UT Technique", true, false))
utTechnique.AddChild(new TreeDropdown("Probe Type", "LS", [
    {
        text: "Pulse Echo",
        value: 1
    },
    {
        text: "Tandem",
        value: 2
    },
    {
        text: "TOFD",
        value: 2
    },
    {
        text: "Separate",
        value: 3
    }
] as Array<TreeDropdownOption>, 1))
utTechnique.AddChild(new TreeDropdown("Transmitter", null, [
    {
        text: "Contact",
        value: 2
    },
    {
        text: "Immersion",
        value: 4
    },
    {
        text: "Phased Array",
        value: -2
    }
] as Array<TreeDropdownOption>, 2))
utTechnique.AddChild(new TreeDropdown("Receiver", null, [ // Identity requires special conversion
    {
        text: "Contact",
        value: 2
    },
    {
        text: "Immersion",
        value: 4
    },
    {
        text: "Phased Array",
        value: -2
    }
] as Array<TreeDropdownOption>, 2))

// Method:Calibration
const calibration = Method.AddChild(new TreeNode("Calibration", true, false))
calibration.AddChild(new TreeDropdown("Type", "LCTY", [
    {
        text: "None",
        value: 0
    },
    {
        text: "Side-drilled Hole",
        value: 1
    },
    {
        text: "Flat-bottomed Hole",
        value: 2
    }
] as Array<TreeDropdownOption>, 0))
calibration.AddChild(new TreeInput("Diameter", "CA", 2.4, true))
calibration.AddChild(new TreeInput("Depth", "CZ", 30, true))

// Method:Mesh
const mesh = Method.AddChild(new TreeNode("Mesh", true, false))

// Method:Mesh:Size
const size = mesh.AddChild(new TreeNode("Size", true, false))
size.AddChild(new TreeInput("X - Start", "XS", 0, true))
size.AddChild(new TreeInput("X - End", "XE", 60, true))
size.AddChild(new TreeInput("X - Increment", "XI", 2, true))
size.AddChild(new TreeInput("Y - Start", "YS", -20, true))
size.AddChild(new TreeInput("Y - End", "YE", 20, true))
size.AddChild(new TreeInput("Y - Increment", "YI", 2, true))

// Method:Mesh:Weld
const weld = mesh.AddChild(new TreeNode("Weld", true, false))
weld.AddChild(new TreeDropdown("Type", "WELD", [
    {
        text: "None",
        value: 0 // "No Weld Specified"
    },
    {
        text: "Regular Weld",
        value: 1 // "Welding_Parameters"
    },
    {
        text: "Control Volume",
        value: 2 // "Hard_Measurement"
    },
] as Array<TreeDropdownOption>, 0))

// Method:Mesh:Weld:Parameters
const weldParameters = weld.AddChild(new TreeNode("Parameters", true, false))
weldParameters.AddChild(new TreeInput("Input Energy", "LQ", 0, true))
weldParameters.AddChild(new TreeInput("Initial Temperature", "T0", 0, true))
weldParameters.AddChild(new TreeInput("Heat Efficiency", "NN", 0, true))

// Method:Mesh:Weld:Geometry
const weldGeometry = weld.AddChild(new TreeNode("Geometry", true, false))
weldGeometry.AddChild(new TreeInput("B1", "B1", 10, true))
weldGeometry.AddChild(new TreeInput("B2", "B2", 3, true))
weldGeometry.AddChild(new TreeInput("B3", "B3", 6, true))
weldGeometry.AddChild(new TreeInput("T1", "T1", 10, true))
weldGeometry.AddChild(new TreeInput("T2", "T2", 4, true))

// Method:Mesh:Weld:Properties
const weldProperties = weld.AddChild(new TreeNode("Properties", true, false))
weldProperties.AddChild(new TreeInput("Specific Heat", "CC", 0, true))
weldProperties.AddChild(new TreeInput("Initial Grain Size", "D0", 0, true))
weldProperties.AddChild(new TreeInput("Density", "RA", 0, true))
weldProperties.AddChild(new TreeInput("Melting Temperature", "TMP", 0, true))
weldProperties.AddChild(new TreeInput("Temperature Diffusivity", "KK", 0, true))
weldProperties.AddChild(new TreeInput("Activation Energy", "Q", 0, true))
weldProperties.AddChild(new TreeInput("Exponential Growth Constant", "AA", 0, true))
weldProperties.AddChild(new TreeInput("Grain Boundary Energy Constant", "K0", 0, true))

// Method:Mesh:Weld:ControlVolume
const controlVolume = weld.AddChild(new TreeNode("Control Volume", true, false))
controlVolume.AddChild(new TreeInput("X - Start", "HMX1", 0, true))
controlVolume.AddChild(new TreeInput("X - End", "HMX2", 0, true))
controlVolume.AddChild(new TreeInput("Y - Start", "HMY1", 0, true))
controlVolume.AddChild(new TreeInput("Y - End", "HMY2", 0, true))
controlVolume.AddChild(new TreeInput("Depth", "HMT0", 0, true))
controlVolume.AddChild(new TreeInput("Thickness", "HMT1", 0, true))
controlVolume.AddChild(new TreeInput("Grain Size", "HMD0", 0, true))
controlVolume.AddChild(new TreeInput("Initial", "HMD1", 0, true))

// Method:Mesh:Weld:SNRatio
const snRatio = weld.AddChild(new TreeNode("S/N Ratio", true, false))
snRatio.AddChild(new TreeInput("% of SDH", "CALB2A", 0, true))
snRatio.AddChild(new TreeInput("Diameter", "CALB2D", 0, true))
snRatio.AddChild(new TreeInput("Depth", "CALB2Z", 0, true))

// Method:TimeWindow
const timeWindow = Method.AddChild(new TreeNode("Time Window", true, false))
timeWindow.AddChild(new TreeDropdown("Type", "LTTY", [
    {
        text: "Automatic",
        value: 1
    },
    {
        text: "All Positions",
        value: 2
    },
    {
        text: "Specific Diffraction Point",
        value: 3
    }
] as Array<TreeDropdownOption>, 1))
timeWindow.AddChild(new TreeInput("Start", "TS", 0, true))
timeWindow.AddChild(new TreeInput("End", "TE", 50, true))
timeWindow.AddChild(new TreeInput("Increment", "TI", 0.1, true))
timeWindow.AddChild(new TreeInput("Depth", "ZD", 0, true))
timeWindow.AddChild(new TreeInput("X", "XD", 0, true))
timeWindow.AddChild(new TreeInput("Y", "YD", 0, true))

export default Method