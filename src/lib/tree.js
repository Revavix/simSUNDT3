export const tree = {
    type: "Root",
    children: {
        method: {
            name: "Method",
            type: "Expandable",
            expanded: false,
            children: {
                material: {
                    name: "Material",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        symmetry: {
                            name: "Symmetry",
                            type: "Dropdown",
                            disabled: false,
                            values: [
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
                            ]
                        },
                        metalProperties: {
                            name: "Metal Properties",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                alloy: {
                                    name: "Alloy",
                                    type: "Dropdown",
                                    disabled: false,
                                    values: [
                                        {
                                            text: "Steel",
                                            value: 1
                                        }
                                    ]
                                },
                                longitudinalVelocity: {
                                    name: "Longitudinal Velocity",
                                    type: "Number",
                                    disabled: false
                                },
                                transversalVelocity: {
                                    name: "Transversal Velocity",
                                    type: "Number",
                                    disabled: false
                                },
                                damping: {
                                    name: "Damping",
                                    type: "Number",
                                    disabled: false
                                }
                            }
                        },
                        density: {
                            name: "Density",
                            type: "Number",
                            disabled: false
                        },
                        constants: {
                            name: "Constants",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                c11: {
                                    name: "C11",
                                    type: "Number",
                                    disabled: false
                                },
                                c22: {
                                    name: "C22",
                                    type: "Number",
                                    disabled: false
                                },
                                c33: {
                                    name: "C33",
                                    type: "Number",
                                    disabled: false
                                },
                                c12: {
                                    name: "C12",
                                    type: "Number",
                                    disabled: false
                                },
                                c13: {
                                    name: "C13",
                                    type: "Number",
                                    disabled: false
                                },
                                c23: {
                                    name: "C23",
                                    type: "Number",
                                    disabled: false
                                },
                                c44: {
                                    name: "C44",
                                    type: "Number",
                                    disabled: false
                                },
                                c55: {
                                    name: "C55",
                                    type: "Number",
                                    disabled: false
                                },
                                c66: {
                                    name: "C66",
                                    type: "Number",
                                    disabled: false
                                }
                            }
                        },
                        eulers: {
                            name: "Euler Angles",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                phi: {
                                    name: "Phi",
                                    type: "Number",
                                    disabled: false
                                },
                                theta: {
                                    name: "Theta",
                                    type: "Number",
                                    disabled: false
                                },
                                psi: {
                                    name: "Psi",
                                    type: "Number",
                                    disabled: false
                                }
                            }
                        },
                    },
                },
                utTechnique: {
                    name: "UT Technique",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        method: {
                            name: "Method",
                            type: "Dropdown",
                            disabled: false,
                            values: [
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
                            ]
                        },
                        transmitter: {
                            name: "Transmitter",
                            type: "Dropdown",
                            disabled: false,
                            values: [
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
                                },
                            ]
                        },
                        receiver: {
                            name: "Receiver",
                            type: "Dropdown",
                            disabled: false,
                            values: [
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
                                },
                            ]
                        }
                    },
                },
                calibration: {
                    name: "Calibration",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        ctype: {
                            name: "Type",
                            type: "Dropdown",
                            disabled: false,
                            values: [
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
                                },
                            ]
                        },
                        diameter: {
                            name: "Diameter",
                            type: "Number",
                            disabled: false
                        },
                        depth: {
                            name: "Depth",
                            type: "Number",
                            disabled: false
                        }
                    },
                },
                mesh: {
                    name: "Mesh",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        size: {
                            name: "Size",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                xs: {
                                    name: "X - Start",
                                    type: "Number",
                                    disabled: false
                                },
                                xe: {
                                    name: "X - End",
                                    type: "Number",
                                    disabled: false
                                },
                                xi: {
                                    name: "X - Increment",
                                    type: "Number",
                                    disabled: false
                                },
                                ys: {
                                    name: "Y - Start",
                                    type: "Number",
                                    disabled: false
                                },
                                ye: {
                                    name: "Y - End",
                                    type: "Number",
                                    disabled: false
                                },
                                yi: {
                                    name: "Y - Increment",
                                    type: "Number",
                                    disabled: false
                                }
                            }
                        },
                        weld: {
                            name: "Weld",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                wtype: {
                                    name: "Type",
                                    type: "Dropdown",
                                    disabled: false,
                                    values: [
                                        {
                                            text: "None",
                                            value: "No Weld Specified"
                                        },
                                        {
                                            text: "Regular Weld",
                                            value: "Welding_Parameters"
                                        },
                                        {
                                            text: "Control Volume",
                                            value: "Hard_Measurement"
                                        },
                                    ]
                                },
                                parameters: {
                                    name: "Parameters",
                                    type: "Expandable",
                                    expanded: false,
                                    children: {
                                        inputEnergy: {
                                            name: "Input Energy",
                                            type: "Number",
                                            disabled: false
                                        },
                                        initialTemperature: {
                                            name: "Initial Temperature",
                                            type: "Number",
                                            disabled: false
                                        },
                                        heatEfficiency: {
                                            name: "Heat Effiency",
                                            type: "Number",
                                            disabled: false
                                        }
                                    }
                                },
                                geometry: {
                                    name: "Geometry",
                                    type: "Expandable",
                                    expanded: false,
                                    children: {
                                        b1: {
                                            name: "b\u2081",
                                            type: "Number",
                                            disabled: false
                                        },
                                        b2: {
                                            name: "b\u2082",
                                            type: "Number",
                                            disabled: false
                                        },
                                        b3: {
                                            name: "b\u2083",
                                            type: "Number",
                                            disabled: false
                                        },
                                        t1: {
                                            name: "t\u2081",
                                            type: "Number",
                                            disabled: false
                                        },
                                        t2: {
                                            name: "t\u2082",
                                            type: "Number",
                                            disabled: false
                                        }
                                    }
                                },
                                properties: {
                                    name: "Properties",
                                    type: "Expandable",
                                    expanded: false,
                                    children: {
                                        specificHeat: {
                                            name: "Specific Heat",
                                            type: "Number",
                                            disabled: false
                                        },
                                        initialGrainSize: {
                                            name: "Initial Grain Size",
                                            type: "Number",
                                            disabled: false
                                        },
                                        density: {
                                            name: "Density",
                                            type: "Number",
                                            disabled: false
                                        },
                                        meltingTemperature: {
                                            name: "Melting Temperature",
                                            type: "Number",
                                            disabled: false
                                        },
                                        temperatureDiffusivity: {
                                            name: "Temperature Diffusivity",
                                            type: "Number",
                                            disabled: false
                                        },
                                        activationEnergy: {
                                            name: "Activation Energy",
                                            type: "Number",
                                            disabled: false
                                        },
                                        exponentialGrowthConstant: {
                                            name: "Exponential Growth Constant",
                                            type: "Number",
                                            disabled: false
                                        },
                                        grainBoundaryEnergyConstant: {
                                            name: "Grain Boundary Energy Constant",
                                            type: "Number",
                                            disabled: false
                                        }
                                    }
                                },
                                controlVolume: {
                                    name: "Control Volume",
                                    type: "Expandable",
                                    expanded: false,
                                    children: {
                                        xs: {
                                            name: "X - Start",
                                            type: "Number",
                                            disabled: false
                                        },
                                        xe: {
                                            name: "X - End",
                                            type: "Number",
                                            disabled: false
                                        },
                                        ys: {
                                            name: "Y - Start",
                                            type: "Number",
                                            disabled: false
                                        },
                                        ye: {
                                            name: "Y - End",
                                            type: "Number",
                                            disabled: false
                                        },
                                        depth: {
                                            name: "Depth",
                                            type: "Number",
                                            disabled: false
                                        },
                                        thickness: {
                                            name: "Thickness",
                                            type: "Number",
                                            disabled: false
                                        },
                                        grainSize: {
                                            name: "Grain Size",
                                            type: "Number",
                                            disabled: false
                                        },
                                        initial: {
                                            name: "Initial",
                                            type: "Number",
                                            disabled: false
                                        }
                                    }
                                },
                                signalToNoiseRatio: {
                                    name: "S/N Ratio",
                                    type: "Expandable",
                                    children: {
                                        percentageOfSDH: {
                                            name: "% of SDH",
                                            type: "Number",
                                            disabled: false
                                        },
                                        diameter: {
                                            name: "Diameter",
                                            type: "Number",
                                            disabled: false
                                        },
                                        depth: {
                                            name: "Depth",
                                            type: "Number",
                                            disabled: false
                                        }
                                    }
                                }
                            }
                        }
                    },
                },
                timeWindow: {
                    name: "Time Window",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        twtype: {
                            name: "Type",
                            type: "Dropdown",
                            disabled: false,
                            values: [
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
                            ]
                        },
                        start: {
                            name: "Start",
                            type: "Number",
                            disabled: false
                        },
                        end: {
                            name: "End",
                            type: "Number",
                            disabled: false
                        },
                        increment: {
                            name: "Increment",
                            type: "Number",
                            disabled: false
                        },
                        depth: {
                            name: "Depth",
                            type: "Number",
                            disabled: false,
                        },
                        x: {
                            name: "X",
                            type: "Number",
                            disabled: false,
                        },
                        y: {
                            name: "Y",
                            type: "Number",
                            disabled: false,
                        }
                    },
                }
            }
        },
        transmitter: {
            name: "Transmitter",
            type: "Expandable",
            expanded: false,
            children: {
                shapeAndElements: {
                    name: "Shape & Elements",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        shape: {
                            name: "Shape",
                            type: "Dropdown",
                            disabled: false,
                            values: [
                                {
                                    text: "Rectangular",
                                    value: -1
                                },
                                {
                                    text: "Elliptic",
                                    value: -2
                                }
                            ]
                        },
                        autoNumElements: {
                            name: "Auto Num of Elements",
                            type: "Checkbox",
                            disabled: false
                        },
                        x: {
                            name: "X",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                length: {
                                    name: "Length",
                                    type: "Number",
                                    disabled: false
                                },
                                elements: {
                                    name: "Elements",
                                    type: "Number",
                                    disabled: false
                                },
                                gap: {
                                    name: "Gap",
                                    type: "Number",
                                    disabled: false
                                }
                            }
                        },
                        y: {
                            name: "Y",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                length: {
                                    name: "Length",
                                    type: "Number",
                                    disabled: false
                                },
                                elements: {
                                    name: "Elements",
                                    type: "Number",
                                    disabled: false
                                },
                                gap: {
                                    name: "Gap",
                                    type: "Number",
                                    disabled: false
                                }
                            }
                        }
                    }
                },
                spectrum: {
                    name: "Spectrum",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        stype: {
                            name: "Type",
                            type: "Dropdown",
                            disabled: false,
                            values: [
                                {
                                    text: "Cosine Square",
                                    value: -1
                                },
                                {
                                    text: "Elliptic",
                                    value: 1
                                },
                                {
                                    text: "Input Spectrum",
                                    value: 0
                                }
                            ]
                        },
                        frequency: {
                            name: "Frequency",
                            type: "Number",
                            disabled: false
                        },
                        bandwidth: {
                            name: "Bandwidth",
                            type: "Number",
                            disabled: false
                        },
                        input: {
                            name: "Input",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                f1: {
                                    name: "F1",
                                    type: "Number",
                                    disabled: false
                                },
                                f2: {
                                    name: "F2",
                                    type: "Number",
                                    disabled: false
                                },
                                f3: {
                                    name: "F3",
                                    type: "Number",
                                    disabled: false
                                },
                                f4: {
                                    name: "F4",
                                    type: "Number",
                                    disabled: false
                                },
                                af: {
                                    name: "Height at F2 (AF)",
                                    type: "Number",
                                    disabled: false
                                },
                                bf: {
                                    name: "Height at F3 (BF)",
                                    type: "Number",
                                    disabled: false
                                }
                            }
                        }
                    }
                },
                focus: {
                    name: "Focus",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        ftype: {
                            name: "Type",
                            type: "Dropdown",
                            disabled: false,
                            values: [
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
                            ]
                        },
                        focalDistance: {
                            name: "Focal Distance",
                            type: "Number",
                            disabled: false
                        }
                    }
                },
                position: {
                    name: "Position",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        x: {
                            name: "X",
                            type: "Number",
                            disabled: false
                        },
                        y: {
                            name: "Y",
                            type: "Number",
                            disabled: false
                        }
                    }
                },
                wave: {
                    name: "Wave",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        wtype: {
                            name: "Type",
                            type: "Dropdown",
                            disabled: false,
                            values: [
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
                            ]
                        },
                        suppression: {
                            name: "Suppression",
                            type: "Checkbox",
                            disabled: false
                        }
                    }
                },
                beamAngles: {
                    name: "Beam Angles",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        angle: {
                            name: "Angle",
                            type: "Number",
                            disabled: false
                        },
                        skewAngle: {
                            name: "Skew Angle",
                            type: "Number",
                            disabled: false
                        }
                    }
                },
                wedge: {
                    name: "Wedge",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        longitudinalWavespeed: {
                            name: "Longitudinal Wavespeed",
                            type: "Number",
                            disabled: false
                        },
                        transversalWavespeed: {
                            name: "Transversal Wavespeed",
                            type: "Number",
                            disabled: false
                        },
                        density: {
                            name: "Density",
                            type: "Number",
                            disabled: false
                        },
                        angle: {
                            name: "Angle",
                            type: "Number",
                            disabled: false
                        },
                        width: {
                            name: "Width",
                            type: "Number",
                            disabled: false
                        }
                    }
                },
                eulerAngles: {
                    name: "Euler Angles",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        phi: {
                            name: "Phi",
                            type: "Number",
                            disabled: false
                        },
                        theta: {
                            name: "Theta",
                            type: "Number",
                            disabled: false
                        },
                        psi: {
                            name: "Psi",
                            type: "Number",
                            disabled: false
                        }
                    }
                },
                fluidSpecification: {
                    name: "Fluid Specification",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        densityRatio: {
                            name: "Density Ratio",
                            type: "Number",
                            disabled: false
                        },
                        fluidWavespeed: {
                            name: "Fluid Wavespeed",
                            type: "Number",
                            disabled: false
                        },
                        damping: {
                            name: "Damping",
                            type: "Number",
                            disabled: false
                        }
                    }
                },
                couplant: {
                    name: "Couplant",
                    type: "Number",
                    disabled: false
                },
                distanceToProbe: {
                    name: "Distance - Probe/Surface",
                    type: "Number",
                    disabled: false
                }
            }
        },
        receiver: {
            name: "Receiver",
            type: "Expandable",
            expanded: false,
            children: {
                shapeAndElements: {
                    name: "Shape & Elements",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        shape: {
                            name: "Shape",
                            type: "Dropdown",
                            disabled: false,
                            values: [
                                {
                                    text: "Rectangular",
                                    value: -1
                                },
                                {
                                    text: "Elliptic",
                                    value: -2
                                }
                            ]
                        },
                        autoNumElements: {
                            name: "Auto Num of Elements",
                            type: "Checkbox",
                            disabled: false
                        },
                        x: {
                            name: "X",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                length: {
                                    name: "Length",
                                    type: "Number",
                                    disabled: false
                                },
                                elements: {
                                    name: "Elements",
                                    type: "Number",
                                    disabled: false
                                },
                                gap: {
                                    name: "Gap",
                                    type: "Number",
                                    disabled: false
                                }
                            }
                        },
                        y: {
                            name: "Y",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                length: {
                                    name: "Length",
                                    type: "Number",
                                    disabled: false
                                },
                                elements: {
                                    name: "Elements",
                                    type: "Number",
                                    disabled: false
                                },
                                gap: {
                                    name: "Gap",
                                    type: "Number",
                                    disabled: false
                                }
                            }
                        }
                    }
                },
                focus: {
                    name: "Focus",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        ftype: {
                            name: "Type",
                            type: "Dropdown",
                            disabled: false,
                            values: [
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
                            ]
                        },
                        focalDistance: {
                            name: "Focal Distance",
                            type: "Number",
                            disabled: false
                        }
                    }
                },
                separation: {
                    name: "Separation",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        x: {
                            name: "X",
                            type: "Number",
                            disabled: false
                        },
                        y: {
                            name: "Y",
                            type: "Number",
                            disabled: false
                        }
                    }
                },
                wave: {
                    name: "Wave",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        suppression: {
                            name: "Suppression",
                            type: "Checkbox",
                            disabled: false
                        }
                    }
                },
                beamAngles: {
                    name: "Beam Angles",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        angle: {
                            name: "Angle",
                            type: "Number",
                            disabled: false
                        },
                        skewAngle: {
                            name: "Skew Angle",
                            type: "Number",
                            disabled: false
                        }
                    }
                },
                wedge: {
                    name: "Wedge",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        longitudinalWavespeed: {
                            name: "Longitudinal Wavespeed",
                            type: "Number",
                            disabled: false
                        },
                        transversalWavespeed: {
                            name: "Transversal Wavespeed",
                            type: "Number",
                            disabled: false
                        },
                        density: {
                            name: "Density",
                            type: "Number",
                            disabled: false
                        },
                        angle: {
                            name: "Angle",
                            type: "Number",
                            disabled: false
                        },
                        width: {
                            name: "Width",
                            type: "Number",
                            disabled: false
                        }
                    }
                },
                eulerAngles: {
                    name: "Euler Angles",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        phi: {
                            name: "Phi",
                            type: "Number",
                            disabled: false
                        },
                        theta: {
                            name: "Theta",
                            type: "Number",
                            disabled: false
                        },
                        psi: {
                            name: "Psi",
                            type: "Number",
                            disabled: false
                        }
                    }
                },
                couplant: {
                    name: "Couplant",
                    type: "Number",
                    disabled: false
                },
                distanceToProbe: {
                    name: "Distance - Probe/Surface",
                    type: "Number",
                    disabled: false
                },
                focusDepth: {
                    name: "Focus Depth",
                    type: "Number",
                    disabled: false
                },
            }
        },
        defect: {
            name: "Defect",
            type: "Expandable",
            expanded: false,
            children: {
                position: {
                    name: "Position",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        x: {
                            name: "X",
                            type: "Number",
                            disabled: false
                        },
                        y: {
                            name: "Y",
                            type: "Number",
                            disabled: false
                        }
                    }
                },
                specification: {
                    name: "Specification",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        variant: {
                            name: "Variant",
                            type: "Dropdown",
                            disabled: false,
                            values: [
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
                                    text: "SBSL Crack", 
                                    value: 19
                                }
                            ]
                        },
                        measurement: {
                            name: "Measurement",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                diameter: {
                                    name: "Diameter",
                                    type: "Number",
                                    disabled: false
                                },
                                centreDepth: {
                                    name: "Centre Depth",
                                    type: "Number",
                                    disabled: false
                                },
                                diameterParallel: {
                                    name: "Diameter Parallel",
                                    type: "Number",
                                    disabled: false
                                },
                                diameterPerpendicular: {
                                    name: "Diameter Perpendicular",
                                    type: "Number",
                                    disabled: false
                                },
                                height: {
                                    name: "Height",
                                    type: "Number",
                                    disabled: false
                                },
                                lengthParallel: {
                                    name: "Length, Parallel Y-axis",
                                    type: "Number",
                                    disabled: false
                                }
                            }
                        },
                        angles: {
                            name: "Angles",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                tilt: {
                                    name: "Diameter",
                                    type: "Number",
                                    disabled: false
                                },
                                skew: {
                                    name: "Centre Depth",
                                    type: "Number",
                                    disabled: false
                                },
                                tiltOfCrack: {
                                    name: "Tilt of Crack",
                                    type: "Number",
                                    disabled: false
                                },
                                tiltOfSurface: {
                                    name: "Tilt of Surface",
                                    type: "Number",
                                    disabled: false
                                }
                            }
                        },
                        inclusionProperties: {
                            name: "Inclusion Properties",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                relativeDensity: {
                                    name: "Relative Density",
                                    type: "Number",
                                    disabled: false
                                },
                                longitudinalVelocity: {
                                    name: "Longitudinal Velocity",
                                    type: "Number",
                                    disabled: false
                                },
                                transversalVelocity: {
                                    name: "Transversal Velocity",
                                    type: "Number",
                                    disabled: false
                                },
                                damping: {
                                    name: "Damping",
                                    type: "Number",
                                    disabled: false
                                }
                            }
                        },
                        circularProperties: {
                            name: "Circular Properties",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                variant: {
                                    name: "Variant",
                                    type: "Dropdown",
                                    disabled: false,
                                    values: [
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
                                    ]
                                },
                                stressQuotient: {
                                    name: "Stress Quotient",
                                    type: "Number",
                                    disabled: false
                                },
                                contactDiameter: {
                                    name: "Contact Diameter",
                                    type: "Number",
                                    disabled: false
                                }
                            }
                        },
                    }
                },
                surfaces: {
                    name: "Surfaces",
                    type: "Expandable",
                    expanded: false,
                    children: {
                        backwall: {
                            name: "Backwall",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                enabled: {
                                    name: "Enabled",
                                    type: "Checkbox",
                                    disabled: false
                                },
                                depth: {
                                    name: "Depth",
                                    type: "Number",
                                    disabled: false
                                },
                                tiltFromHorizontal: {
                                    name: "Tilt from Horizontal",
                                    type: "Number",
                                    disabled: false
                                }
                            }
                        },
                        roughness: {
                            name: "Roughness",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                enabled: {
                                    name: "Enabled",
                                    type: "Checkbox",
                                    disabled: false
                                },
                                rmsHeight: {
                                    name: "RMS Height",
                                    type: "Number",
                                    disabled: false
                                },
                                corrLength: {
                                    name: "Corr. Length",
                                    type: "Number",
                                    disabled: false
                                }
                            }
                        },
                        integration: {
                            name: "Integration",
                            type: "Dropdown",
                            disabled: false,
                            values: [
                                {
                                    text: "Exact", 
                                    value: 1
                                },
                                {
                                    text: "S-Phase Approx", 
                                    value: 2
                                }
                            ]
                        }
                    }
                }
            }
        }
    }
}

export function ConstructDefaultTreeData(data, children) {
    for (const [key, value] of Object.entries(children)) {
        if (value.type == "Expandable") {
            data[key] = {}
            ConstructDefaultTreeData(data[key], value.children)
        } else if (value.type == "Number") {
            data[key] = {
                value: 0
            }
        } else if (value.type == "Dropdown") {
            data[key] = {
                value: value.values[0].value
            }
        } else if (value.type == "Checkbox") {
            data[key] = {
                value: false
            }
        }
    }

    return data
}