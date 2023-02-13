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
                            default: 2,
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
                                    default: 1,
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
                                    disabled: false,
                                    default: 5900
                                },
                                transversalVelocity: {
                                    name: "Transversal Velocity",
                                    type: "Number",
                                    disabled: false,
                                    default: 3230
                                },
                                damping: {
                                    name: "Damping",
                                    type: "Number",
                                    disabled: false,
                                    default: 0
                                }
                            }
                        },
                        density: {
                            name: "Density",
                            type: "Number",
                            disabled: false,
                            default: 8.2
                        },
                        constants: {
                            name: "Constants",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                c11: {
                                    name: "C11",
                                    type: "Number",
                                    disabled: false,
                                    default: 250
                                },
                                c22: {
                                    name: "C22",
                                    type: "Number",
                                    disabled: false,
                                    default: 250
                                },
                                c33: {
                                    name: "C33",
                                    type: "Number",
                                    disabled: false,
                                    default: 240
                                },
                                c12: {
                                    name: "C12",
                                    type: "Number",
                                    disabled: false,
                                    default: 108
                                },
                                c13: {
                                    name: "C13",
                                    type: "Number",
                                    disabled: false,
                                    default: 84
                                },
                                c23: {
                                    name: "C23",
                                    type: "Number",
                                    disabled: false,
                                    default: 84
                                },
                                c44: {
                                    name: "C44",
                                    type: "Number",
                                    disabled: false,
                                    default: 116
                                },
                                c55: {
                                    name: "C55",
                                    type: "Number",
                                    disabled: false,
                                    default: 116
                                },
                                c66: {
                                    name: "C66",
                                    type: "Number",
                                    disabled: false,
                                    default: 71
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
                                    disabled: false,
                                    default: 0
                                },
                                theta: {
                                    name: "Theta",
                                    type: "Number",
                                    disabled: false,
                                    default: 0
                                },
                                psi: {
                                    name: "Psi",
                                    type: "Number",
                                    disabled: false,
                                    default: 0
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
                            default: 1,
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
                            default: 2,
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
                            default: 2,
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
                            default: 1,
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
                            disabled: false,
                            default: 2.4
                        },
                        depth: {
                            name: "Depth",
                            type: "Number",
                            disabled: false,
                            default: 30
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
                                    disabled: false,
                                    default: 0
                                },
                                xe: {
                                    name: "X - End",
                                    type: "Number",
                                    disabled: false,
                                    default: 60
                                },
                                xi: {
                                    name: "X - Increment",
                                    type: "Number",
                                    disabled: false,
                                    default: 2
                                },
                                ys: {
                                    name: "Y - Start",
                                    type: "Number",
                                    disabled: false,
                                    default: -20
                                },
                                ye: {
                                    name: "Y - End",
                                    type: "Number",
                                    disabled: false,
                                    default: 20
                                },
                                yi: {
                                    name: "Y - Increment",
                                    type: "Number",
                                    disabled: false,
                                    default: 2
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
                                    default: "No Weld Specified",
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
                                            disabled: false,
                                            default: 0
                                        },
                                        initialTemperature: {
                                            name: "Initial Temperature",
                                            type: "Number",
                                            disabled: false,
                                            default: 0
                                        },
                                        heatEfficiency: {
                                            name: "Heat Effiency",
                                            type: "Number",
                                            disabled: false,
                                            default: 0
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
                                            disabled: false,
                                            default: 10
                                        },
                                        b2: {
                                            name: "b\u2082",
                                            type: "Number",
                                            disabled: false,
                                            default: 3
                                        },
                                        b3: {
                                            name: "b\u2083",
                                            type: "Number",
                                            disabled: false,
                                            default: 6
                                        },
                                        t1: {
                                            name: "t\u2081",
                                            type: "Number",
                                            disabled: false,
                                            default: 10
                                        },
                                        t2: {
                                            name: "t\u2082",
                                            type: "Number",
                                            disabled: false,
                                            default: 4
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
                                            disabled: false,
                                            default: 0
                                        },
                                        initialGrainSize: {
                                            name: "Initial Grain Size",
                                            type: "Number",
                                            disabled: false,
                                            default: 0
                                        },
                                        density: {
                                            name: "Density",
                                            type: "Number",
                                            disabled: false,
                                            default: 0
                                        },
                                        meltingTemperature: {
                                            name: "Melting Temperature",
                                            type: "Number",
                                            disabled: false,
                                            default: 0
                                        },
                                        temperatureDiffusivity: {
                                            name: "Temperature Diffusivity",
                                            type: "Number",
                                            disabled: false,
                                            default: 0
                                        },
                                        activationEnergy: {
                                            name: "Activation Energy",
                                            type: "Number",
                                            disabled: false,
                                            default: 0
                                        },
                                        exponentialGrowthConstant: {
                                            name: "Exponential Growth Constant",
                                            type: "Number",
                                            disabled: false,
                                            default: 0
                                        },
                                        grainBoundaryEnergyConstant: {
                                            name: "Grain Boundary Energy Constant",
                                            type: "Number",
                                            disabled: false,
                                            default: 0
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
                                            disabled: false,
                                            default: 0
                                        },
                                        xe: {
                                            name: "X - End",
                                            type: "Number",
                                            disabled: false,
                                            default: 0
                                        },
                                        ys: {
                                            name: "Y - Start",
                                            type: "Number",
                                            disabled: false,
                                            default: 0
                                        },
                                        ye: {
                                            name: "Y - End",
                                            type: "Number",
                                            disabled: false,
                                            default: 0
                                        },
                                        depth: {
                                            name: "Depth",
                                            type: "Number",
                                            disabled: false,
                                            default: 0
                                        },
                                        thickness: {
                                            name: "Thickness",
                                            type: "Number",
                                            disabled: false,
                                            default: 0
                                        },
                                        grainSize: {
                                            name: "Grain Size",
                                            type: "Number",
                                            disabled: false,
                                            default: 0
                                        },
                                        initial: {
                                            name: "Initial",
                                            type: "Number",
                                            disabled: false,
                                            default: 0
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
                                            disabled: false,
                                            default: 0
                                        },
                                        diameter: {
                                            name: "Diameter",
                                            type: "Number",
                                            disabled: false,
                                            default: 0
                                        },
                                        depth: {
                                            name: "Depth",
                                            type: "Number",
                                            disabled: false,
                                            default: 0
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
                            default: 1,
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
                            disabled: false,
                            default: 0
                        },
                        end: {
                            name: "End",
                            type: "Number",
                            disabled: false,
                            default: 50
                        },
                        increment: {
                            name: "Increment",
                            type: "Number",
                            disabled: false,
                            default: 0.1
                        },
                        depth: {
                            name: "Depth",
                            type: "Number",
                            disabled: false,
                            default: 0
                        },
                        x: {
                            name: "X",
                            type: "Number",
                            disabled: false,
                            default: 0
                        },
                        y: {
                            name: "Y",
                            type: "Number",
                            disabled: false,
                            default: 0
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
                            default: -2,
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
                            disabled: false,
                            default: true
                        },
                        x: {
                            name: "X",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                length: {
                                    name: "Length",
                                    type: "Number",
                                    disabled: false,
                                    default: 9.5
                                },
                                elements: {
                                    name: "Elements",
                                    type: "Number",
                                    disabled: false,
                                    default: 16
                                },
                                gap: {
                                    name: "Gap",
                                    type: "Number",
                                    disabled: false,
                                    default: 0
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
                                    disabled: false,
                                    default: 5.5
                                },
                                elements: {
                                    name: "Elements",
                                    type: "Number",
                                    disabled: false,
                                    default: 2
                                },
                                gap: {
                                    name: "Gap",
                                    type: "Number",
                                    disabled: false,
                                    default: 0
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
                            default: -1,
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
                            disabled: false,
                            default: 1.25
                        },
                        bandwidth: {
                            name: "Bandwidth",
                            type: "Number",
                            disabled: false,
                            default: 1
                        },
                        input: {
                            name: "Input",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                f1: {
                                    name: "F1",
                                    type: "Number",
                                    disabled: false,
                                    default: 0
                                },
                                f2: {
                                    name: "F2",
                                    type: "Number",
                                    disabled: false,
                                    default: -3.5
                                },
                                f3: {
                                    name: "F3",
                                    type: "Number",
                                    disabled: false,
                                    default: 4.75
                                },
                                f4: {
                                    name: "F4",
                                    type: "Number",
                                    disabled: false,
                                    default: 6.5
                                },
                                af: {
                                    name: "Height at F2 (AF)",
                                    type: "Number",
                                    disabled: false,
                                    default: 100
                                },
                                bf: {
                                    name: "Height at F3 (BF)",
                                    type: "Number",
                                    disabled: false,
                                    default: 100
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
                            default: 0,
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
                            disabled: false,
                            default: 0
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
                            disabled: false,
                            default: 0
                        },
                        y: {
                            name: "Y",
                            type: "Number",
                            disabled: false,
                            default: 0
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
                            default: 0,
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
                            disabled: false,
                            default: false
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
                            disabled: false,
                            default: 45
                        },
                        skewAngle: {
                            name: "Skew Angle",
                            type: "Number",
                            disabled: false,
                            default: 0
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
                            disabled: false,
                            default: 6320
                        },
                        transversalWavespeed: {
                            name: "Transversal Wavespeed",
                            type: "Number",
                            disabled: false,
                            default: 3130
                        },
                        density: {
                            name: "Density",
                            type: "Number",
                            disabled: false,
                            default: 2.7
                        },
                        angle: {
                            name: "Angle",
                            type: "Number",
                            disabled: false,
                            default: 49
                        },
                        width: {
                            name: "Width",
                            type: "Number",
                            disabled: false,
                            default: 2
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
                            disabled: false,
                            default: 45
                        },
                        theta: {
                            name: "Theta",
                            type: "Number",
                            disabled: false,
                            default: 0
                        },
                        psi: {
                            name: "Psi",
                            type: "Number",
                            disabled: false,
                            default: 0
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
                            disabled: false,
                            default: 0
                        },
                        fluidWavespeed: {
                            name: "Fluid Wavespeed",
                            type: "Number",
                            disabled: false,
                            default: 0
                        },
                        damping: {
                            name: "Damping",
                            type: "Number",
                            disabled: false,
                            default: 0
                        }
                    }
                },
                couplant: {
                    name: "Couplant",
                    type: "Number",
                    disabled: false,
                    default: 0
                },
                distanceToProbe: {
                    name: "Distance - Probe/Surface",
                    type: "Number",
                    disabled: false,
                    default: 0
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
                            default: -1,
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
                            disabled: false,
                            default: false
                        },
                        x: {
                            name: "X",
                            type: "Expandable",
                            expanded: false,
                            children: {
                                length: {
                                    name: "Length",
                                    type: "Number",
                                    disabled: false,
                                    default: 9.5
                                },
                                elements: {
                                    name: "Elements",
                                    type: "Number",
                                    disabled: false,
                                    default: 16
                                },
                                gap: {
                                    name: "Gap",
                                    type: "Number",
                                    disabled: false,
                                    default: 0
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
                                    disabled: false,
                                    default: 5.5
                                },
                                elements: {
                                    name: "Elements",
                                    type: "Number",
                                    disabled: false,
                                    default: 2
                                },
                                gap: {
                                    name: "Gap",
                                    type: "Number",
                                    disabled: false,
                                    default: 0
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
                            default: 0,
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
                            disabled: false,
                            default: 0
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
                            disabled: false,
                            default: 0
                        },
                        y: {
                            name: "Y",
                            type: "Number",
                            disabled: false,
                            default: 0
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
                            disabled: false,
                            default: false
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
                            disabled: false,
                            default: 45
                        },
                        skewAngle: {
                            name: "Skew Angle",
                            type: "Number",
                            disabled: false,
                            default: 0
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
                            disabled: false,
                            default: 6320
                        },
                        transversalWavespeed: {
                            name: "Transversal Wavespeed",
                            type: "Number",
                            disabled: false,
                            default: 3130
                        },
                        density: {
                            name: "Density",
                            type: "Number",
                            disabled: false,
                            default: 2.7
                        },
                        angle: {
                            name: "Angle",
                            type: "Number",
                            disabled: false,
                            default: 49
                        },
                        width: {
                            name: "Width",
                            type: "Number",
                            disabled: false,
                            default: 2
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
                            disabled: false,
                            default: 45
                        },
                        theta: {
                            name: "Theta",
                            type: "Number",
                            disabled: false,
                            default: 0
                        },
                        psi: {
                            name: "Psi",
                            type: "Number",
                            disabled: false,
                            default: 0
                        }
                    }
                },
                couplant: {
                    name: "Couplant",
                    type: "Number",
                    disabled: false,
                    default: 0
                },
                distanceToProbe: {
                    name: "Distance - Probe/Surface",
                    type: "Number",
                    disabled: false,
                    default: 0
                },
                focusDepth: {
                    name: "Focus Depth",
                    type: "Number",
                    disabled: false,
                    default: 0
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
                            disabled: false,
                            default: 15
                        },
                        y: {
                            name: "Y",
                            type: "Number",
                            disabled: false,
                            default: 10
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
                            default: 1,
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
                                    disabled: false,
                                    default: 5
                                },
                                centreDepth: {
                                    name: "Centre Depth",
                                    type: "Number",
                                    disabled: false,
                                    default: 30
                                },
                                diameterParallel: {
                                    name: "Diameter Parallel",
                                    type: "Number",
                                    disabled: false,
                                    default: 5
                                },
                                diameterPerpendicular: {
                                    name: "Diameter Perpendicular",
                                    type: "Number",
                                    disabled: false,
                                    default: 30
                                },
                                height: {
                                    name: "Height",
                                    type: "Number",
                                    disabled: false,
                                    default: 5
                                },
                                lengthParallel: {
                                    name: "Length, Parallel Y-axis",
                                    type: "Number",
                                    disabled: false,
                                    default: 30
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
                                    disabled: false,
                                    default: 0
                                },
                                skew: {
                                    name: "Centre Depth",
                                    type: "Number",
                                    disabled: false,
                                    default: 0
                                },
                                tiltOfCrack: {
                                    name: "Tilt of Crack",
                                    type: "Number",
                                    disabled: false,
                                    default: 0
                                },
                                tiltOfSurface: {
                                    name: "Tilt of Surface",
                                    type: "Number",
                                    disabled: false,
                                    default: 0
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
                                    disabled: false,
                                    default: 0
                                },
                                longitudinalVelocity: {
                                    name: "Longitudinal Velocity",
                                    type: "Number",
                                    disabled: false,
                                    default: 0
                                },
                                transversalVelocity: {
                                    name: "Transversal Velocity",
                                    type: "Number",
                                    disabled: false,
                                    default: 0
                                },
                                damping: {
                                    name: "Damping",
                                    type: "Number",
                                    disabled: false,
                                    default: 0
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
                                    default: 1,
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
                                    disabled: false,
                                    default: 0.5
                                },
                                contactDiameter: {
                                    name: "Contact Diameter",
                                    type: "Number",
                                    disabled: false,
                                    default: 0
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
                                    disabled: false,
                                    default: false
                                },
                                depth: {
                                    name: "Depth",
                                    type: "Number",
                                    disabled: false,
                                    default: 5
                                },
                                tiltFromHorizontal: {
                                    name: "Tilt from Horizontal",
                                    type: "Number",
                                    disabled: false,
                                    default: 0
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
                                    disabled: false,
                                    default: false
                                },
                                rmsHeight: {
                                    name: "RMS Height",
                                    type: "Number",
                                    disabled: false,
                                    default: 0
                                },
                                corrLength: {
                                    name: "Corr. Length",
                                    type: "Number",
                                    disabled: false,
                                    default: 0
                                }
                            }
                        },
                        integration: {
                            name: "Integration",
                            type: "Dropdown",
                            disabled: false,
                            default: 1,
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
        } else {
            data[key] = {
                value: value.default
            }
        }
    }

    return data
}