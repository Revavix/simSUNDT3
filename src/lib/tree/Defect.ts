import { TreeCheckbox } from "../models/tree/TreeCheckbox";
import { TreeDropdown } from "../models/tree/TreeDropdown";
import { TreeInput } from "../models/tree/TreeInput";
import TreeNode from "../models/tree/TreeNode";

const Defect = new TreeNode("Defect", false, false)

// Defect:Position
const position = Defect.AddChild(new TreeNode("Position", true, false))
position.AddChild(new TreeInput("X", "XDEF", 0, true))
position.AddChild(new TreeInput("Y", "YDEF", 0, true))

// Defect:Specification
const specification = Defect.AddChild(new TreeNode("Specification", true, false))
specification.AddChild(new TreeDropdown("Variant", "LDTY", [
    {
        text: "Spherical Cavity", 
        value: 1
    },
    {
        text: "Elastic Spherical Inclusion", 
        value: 2
    },
    {
        text: "Circular Crack", 
        value: 3
    },
    {
        text: "Spheroidal Cavity", 
        value: 4
    },
    {
        text: "Rectangular Crack", 
        value: 5
    },
    {
        text: "Strip-like Crack", 
        value: 7
    },
    {
        text: "Side Drilled Hole", 
        value: 8
    },
    {
        text: "Surface Breaking Strip-like Crack", 
        value: 19
    }
], 1))

// Defect:Specification:Measurement
const measurement = specification.AddChild(new TreeNode("Measurement", true, false))
measurement.AddChild(new TreeInput("Diameter", "DA", 5, true))
measurement.AddChild(new TreeInput("Centre Depth", "DZ", 30, true))
measurement.AddChild(new TreeInput("Diameter Parallel", "DA", 10, true))
measurement.AddChild(new TreeInput("Diameter Perpendicular", "DB", 10, true))
measurement.AddChild(new TreeInput("Length", "A", 5, true))
measurement.AddChild(new TreeInput("Height", "DA & B", 5, true))

// Defect:Specification:Angles
const angles = specification.AddChild(new TreeNode("Angles", true, false))
angles.AddChild(new TreeInput("Tilt", "ETHA", 0, true))
angles.AddChild(new TreeInput("Skew", "PHI", 0, true))
angles.AddChild(new TreeInput("Tilt - Crack", "PS", 0, true))

// Defect:Specification:InclusionProperties
const inclusionProperties = specification.AddChild(new TreeNode("Inclusion Properties", true, false))
inclusionProperties.AddChild(new TreeInput("Relative Density", "DRR", 0, true))
inclusionProperties.AddChild(new TreeInput("Longitudinal Wavespeed", "CPI", 0, true))
inclusionProperties.AddChild(new TreeInput("Transversal Wavespeed", "CSI", 0, true))
inclusionProperties.AddChild(new TreeInput("Damping", "DBI", 0, true))

// Defect:Specification:CircularProperties
const circularProperties = specification.AddChild(new TreeNode("Circular Properties", true, false))
circularProperties.AddChild(new TreeDropdown("Variant", "LDC", [
    {
        text: "Open", 
        value: 1
    },
    {
        text: "Fluid Filled", 
        value: 2
    },
    {
        text: "Partly Closed", 
        value: 3
    }
], 1))
circularProperties.AddChild(new TreeInput("Stress Quotient", "DC", 0.5, true))
circularProperties.AddChild(new TreeInput("Contact Diameter", "DAC", 0, true))

// Defect:Surfaces
const surfaces = Defect.AddChild(new TreeNode("Surfaces", true, false))

// Defect:Surfaces:Backwall
const backwall = surfaces.AddChild(new TreeNode("Backwall", true, false))
backwall.AddChild(new TreeCheckbox("Enabled", null, false))
backwall.AddChild(new TreeInput("Depth", "BZ", 5, true))
backwall.AddChild(new TreeInput("Tilt - Horizontal", "ET", 0, true))

// Defect:Surfaces:Roughness
const roughness = surfaces.AddChild(new TreeNode("Roughness", true, false))
roughness.AddChild(new TreeCheckbox("Enabled", null, false))
roughness.AddChild(new TreeInput("RMS Height", "EPSI", 0, true))
roughness.AddChild(new TreeInput("Correlation Length", "LZ", 0, true))

// Defect:Surfaces:Integration
surfaces.AddChild(new TreeDropdown("Integration", null, [
    {
        text: "Exact", 
        value: 1
    },
    {
        text: "S-Phase Approx", 
        value: 2
    }
], 1))

export default Defect