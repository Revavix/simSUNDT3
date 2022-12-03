/*class TreeParameters extends Array {};
class TreeSelect extends Array {};
class TreeNumber extends Number {};
class TreeBool extends Boolean {};*/

import { TreeExpandable, TreeNumber, TreeSelect, TreeBool } from './treeDef'

export const treeMethod = new TreeExpandable
(
  "Method", 
  [
    new TreeExpandable(
      "Material",
      [
        new TreeSelect("Symmetry", ["Isotropic", "Transversaly Isotropic", "Orthotropic"]),
        new TreeExpandable("Metal Properties", 
        [
            new TreeSelect("Alloy", ["Steel"]),
            new TreeNumber("Longitudinal Velocity", 0),
            new TreeNumber("Transversal Velocity", 0),
            new TreeNumber("Damping", 0)
        ],
        false
        ),
        new TreeNumber("Density", 0),
        new TreeExpandable("Constants", 
        [
            new TreeNumber("C11", 0),
            new TreeNumber("C22", 0),
            new TreeNumber("C33", 0),
            new TreeNumber("C12", 0),
            new TreeNumber("C13", 0),
            new TreeNumber("C23", 0),
            new TreeNumber("C44", 0),
            new TreeNumber("C55", 0),
            new TreeNumber("C66", 0)
        ],
        false
        ),
        new TreeExpandable("Euler Angles", 
        [
            new TreeNumber("Phi", 0),
            new TreeNumber("Theta", 0),
            new TreeNumber("Psi", 0)
        ],
        false
        )
      ],
      false
    ),
    new TreeExpandable(
      "UT Technique",
      [
        new TreeSelect("Method", ["Pulse Echo", "Separate", "Tandem", "TOFD"]),
        new TreeSelect("Transmitter", ["Contact", "Immersion", "Phased Array"]),
        new TreeSelect("Receiver", ["Contact", "Immersion", "Phased Array"])
      ],
      false
    ),
    new TreeExpandable(
        "Calibration",
        [
            new TreeSelect("Type", ["None", "Side-drilled Hole", "Flat-bottomed Hole"]),
            new TreeNumber("Diameter", 0),
            new TreeNumber("Center Depth", 0)
        ],
        false
    ),
    new TreeExpandable(
        "Mesh",
        [
            new TreeExpandable(
                "Size",
                [
                    new TreeNumber("X - Start", 0),
                    new TreeNumber("X - End", 30),
                    new TreeNumber("X - Increment", 1),
                    new TreeNumber("Y - Start", 0),
                    new TreeNumber("Y - End", 30),
                    new TreeNumber("Y - Increment", 1),
                ],
                false
            ),
            new TreeExpandable(
                "Weld",
                [
                    new TreeSelect("Type", ["None", "Regular Weld", "Control Volume"]),
                    new TreeExpandable(
                        "Parameters",
                        [
                            new TreeNumber("Input Energy", 0),
                            new TreeNumber("Initial Temperature", 0),
                            new TreeNumber("Heat Efficiency", 0)
                        ],
                        false
                    ),
                    new TreeExpandable(
                        "Geometry",
                        [
                            new TreeNumber("b\u2081", 0),
                            new TreeNumber("b\u2082", 0),
                            new TreeNumber("b\u2083", 0),
                            new TreeNumber("t\u2081", 0),
                            new TreeNumber("t\u2082", 0)
                        ],
                        false
                    ),
                    new TreeExpandable(
                        "Properties",
                        [
                            new TreeNumber("Specific Heat", 0),
                            new TreeNumber("Initial Grain Size", 0),
                            new TreeNumber("Density", 0),
                            new TreeNumber("Melting Temperature", 0),
                            new TreeNumber("Temperature Diffusivity", 0),
                            new TreeNumber("Activation Energy", 0),
                            new TreeNumber("Exponential Growth Constant", 0),
                            new TreeNumber("Grain BE Constant", 0)
                        ],
                        false
                    ),
                    new TreeExpandable(
                        "Control Volume",
                        [
                            new TreeNumber("X - Start", 0),
                            new TreeNumber("X - End", 0),
                            new TreeNumber("Y - Start", 0),
                            new TreeNumber("Y - End", 0),
                            new TreeNumber("Depth", 0),
                            new TreeNumber("Thickness", 0),
                            new TreeNumber("Grain Size", 0),
                            new TreeNumber("Initial", 0)
                        ],
                        false
                    ),
                    new TreeExpandable(
                        "S/N Ratio",
                        [
                            new TreeNumber("% of SDH", 0),
                            new TreeNumber("Diameter", 0),
                            new TreeNumber("Depth", 0)
                        ],
                        false
                    )
                ],
                false
            ),
        ],
        false
    ),
    new TreeExpandable(
        "Time Window",
        [
            new TreeSelect("Type", ["Automatic", "All positions", "Specific Diffraction Point"]),
            new TreeNumber("Start", 0),
            new TreeNumber("End", 0),
            new TreeNumber("Increment", 0),
            new TreeNumber("Depth", 0),
            new TreeNumber("X", 0),
            new TreeNumber("Y", 0)
        ],
        false
    ),
    //new TreeSelect("Accuracy", ["Highest", "High", "Medium", "Lower", "Lowest"])
  ],
  true
)

export const treeTransmitter = new TreeExpandable
(
    "Transmitter",
    [
        new TreeExpandable(
            "Shape & Elements",
            [
                new TreeSelect("Shape", ["Rectangular", "Elliptic"]),
                new TreeBool("Auto Num of Elements", false),
                new TreeExpandable(
                    "X",
                    [
                        new TreeNumber("Length", 0),
                        new TreeNumber("Elements", 0),
                        new TreeNumber("Gap", 0),
                    ],
                    false
                ),
                new TreeExpandable(
                    "Y",
                    [
                        new TreeNumber("Length", 0),
                        new TreeNumber("Elements", 0),
                        new TreeNumber("Gap", 0),
                    ],
                    false
                )
            ],
            false
        ),
        new TreeExpandable(
            "Spectrum",
            [
                new TreeBool("Type", false),
                new TreeNumber("Frequency", 0),
                new TreeNumber("Bandwidth", 0),
                new TreeExpandable(
                    "Input",
                    [
                        new TreeNumber("F1", 0),
                        new TreeNumber("F2", 0),
                        new TreeNumber("F3", 0),
                        new TreeNumber("F4", 0),
                        new TreeNumber("Height at F2 (AF)", 0),
                        new TreeNumber("Height at F3 (BF)", 0),
                    ],
                    false
                )
            ],
            false
        ),
        new TreeExpandable(
            "Focus",
            [
                new TreeSelect("Type", ["Unfocused", "Line Focused", "Point Focused"]),
                new TreeNumber("Focal Distance", 0),
            ],
            false
        ),
        new TreeExpandable(
            "Position",
            [
                new TreeNumber("X", 0),
                new TreeNumber("Y", 0)
            ],
            false
        ),
        new TreeExpandable(
            "Wave",
            [
                new TreeSelect("Type", ["Longitudinal", "Transversal (vert. pol)", "Transversal (hori. pol)"]),
                new TreeBool("Suppression", false)
            ],
            false
        ),
        new TreeExpandable(
            "Beam Angles",
            [
                new TreeNumber("Angle", 0),
                new TreeNumber("Skew Angle", 0)
            ],
            false
        ),
        new TreeExpandable(
            "Wedge",
            [
                new TreeNumber("Longitudinal Wavespeed", 0),
                new TreeNumber("Transversal Wavespeed", 0),
                new TreeNumber("Density", 0),
                new TreeNumber("Angle", 0),
                new TreeNumber("Width", 0),
            ],
            false
        ),
        new TreeExpandable(
            "Euler Angles", 
            [
                new TreeNumber("Phi", 0),
                new TreeNumber("Theta", 0),
                new TreeNumber("Psi", 0)
            ],
            false
        ),
        new TreeExpandable(
            "Fluid Specification", 
            [
                new TreeNumber("Density Ratio", 0),
                new TreeNumber("Fluid Wave Speed", 0),
                new TreeNumber("Damping", 0)
            ],
            false
        ),
        new TreeNumber("Couplant", 0),
        new TreeNumber("Distance - Probe/Surface", 0)
    ],
    true
)

export const treeReceiver = new TreeExpandable(
    "Receiver",
    [
        new TreeExpandable(
            "Shape & Elements",
            [
                new TreeSelect("Shape", ["Rectangular", "Elliptic"]),
                new TreeBool("Auto Num of Elements", false),
                new TreeExpandable(
                    "X",
                    [
                        new TreeNumber("Length", 0),
                        new TreeNumber("Elements", 0),
                        new TreeNumber("Gap", 0),
                    ],
                    false
                ),
                new TreeExpandable(
                    "Y",
                    [
                        new TreeNumber("Length", 0),
                        new TreeNumber("Elements", 0),
                        new TreeNumber("Gap", 0),
                    ],
                    false
                )
            ],
            false
        ),
        new TreeExpandable(
            "Focus",
            [
                new TreeSelect("Type", ["Unfocused", "Line Focused", "Point Focused"]),
                new TreeNumber("Focal Distance", 0)
            ],
            false
        ),
        new TreeExpandable(
            "Separation",
            [
                new TreeNumber("X", 0),
                new TreeNumber("Y", 0)
            ],
            false
        ),
        new TreeExpandable(
            "Wave",
            [
                new TreeSelect("Type", ["Longitudinal", "Transversal (vert. pol)", "Transversal (hori. pol)"]),
                new TreeBool("Suppression", false)
            ],
            false
        ),
        new TreeExpandable(
            "Beam Angles",
            [
                new TreeNumber("Angle", 0),
                new TreeNumber("Skew Angle", 0)
            ],
            false
        ),
        new TreeExpandable(
            "Wedge",
            [
                new TreeNumber("Longitudinal Wavespeed", 0),
                new TreeNumber("Transversal Wavespeed", 0),
                new TreeNumber("Density", 0),
                new TreeNumber("Angle", 0),
                new TreeNumber("Width", 0),
            ],
            false
        ),
        new TreeExpandable(
            "Euler Angles", 
            [
                new TreeNumber("Phi", 0),
                new TreeNumber("Theta", 0),
                new TreeNumber("Psi", 0)
            ],
            false
        ),
        new TreeNumber("Couplant", 0),
        new TreeNumber("Distance - Probe/Surface", 0),
        new TreeNumber("Focus Depth", 0)
    ],
    true
)

export const treeDefect = new TreeExpandable(
    "Defect",
    [
        new TreeExpandable(
            "Position",
            [
                new TreeNumber("X", 0),
                new TreeNumber("Y", 0),
            ],
            false
        ),
        new TreeExpandable(
            "Specification",
            [
                new TreeSelect("Variant", 
                [
                    "Spherical Cavity", 
                    "Spherical Inclusion", 
                    "Spheroidal Cavity", 
                    "Circular Crack",
                    "Rectangular Crack",
                    "Side-drilled Hole",
                    "Strip-like Crack",
                    "S-B Strip-like Crack"
                ]),
                new TreeExpandable(
                    "Measurement",
                    [
                        new TreeNumber("Diameter", 0),
                        new TreeNumber("Centre Depth", 0),
                        new TreeNumber("Diameter Parallel", 0),
                        new TreeNumber("Diameter Perpendicular", 0),
                        new TreeNumber("Height", 0),
                        new TreeNumber("Length, Parallel Y-axis", 0),
                    ],
                    false
                ),
                new TreeExpandable(
                    "Angles",
                    [
                        new TreeNumber("Tilt", 0),
                        new TreeNumber("Skew", 0),
                        new TreeNumber("Tilt of Crack", 0),
                        new TreeNumber("Tilt of Surface", 0)
                    ],
                    false
                ),
                new TreeExpandable(
                    "Inclusion Properties",
                    [
                        new TreeNumber("Relative Density", 0),
                        new TreeNumber("Longitudinal Velocity", 0),
                        new TreeNumber("Transversal Velocity", 0),
                        new TreeNumber("Damping", 0)
                    ],
                    false
                ),
                new TreeExpandable(
                    "Circular Properties",
                    [
                        new TreeSelect("Variant", ["Open", "Fluid Filled", "Partly Closed"]),
                        new TreeNumber("Stress Quotient", 0),
                        new TreeNumber("Contact Diameter", 0)
                    ],
                    false
                )
            ],
            false
        ),
        new TreeExpandable(
            "Surfaces",
            [
                new TreeExpandable(
                    "Backwall",
                    [
                        new TreeBool("Enabled", false),
                        new TreeNumber("Depth", 0),
                        new TreeNumber("Tilt from Horizontal", 0)
                    ],
                    false
                ),
                new TreeExpandable(
                    "Roughness",
                    [
                        new TreeBool("Enabled", false),
                        new TreeNumber("RMS Height", 0),
                        new TreeNumber("Corr. Length", 0)
                    ],
                    false
                ),
                new TreeSelect("Integration", ["Exact", "S-Phase Approx."])
            ],
            false
        ),
    ],
    true
)