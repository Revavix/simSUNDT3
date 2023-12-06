import { constructIsoSaveData } from "./utDefSaverUtils.js"

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
                            identity: [null, null],
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
                                    identity: [null, null],
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
                                    identity: ["CP", null],
                                    divisor: 1000, // mm/s to m/s
                                    parametric: true,
                                    disabled: false,
                                    default: 5900
                                },
                                transversalVelocity: {
                                    name: "Transversal Velocity",
                                    type: "Number",
                                    identity: ["CS", null],
                                    divisor: 1000, // mm/s to m/s
                                    parametric: true,
                                    disabled: false,
                                    default: 3230
                                },
                                damping: {
                                    name: "Damping",
                                    type: "Number",
                                    identity: ["UNDECLARED_01", null],
                                    divisor: 1,
                                    parametric: true,
                                    disabled: false,
                                    default: 0
                                }
                            }
                        },
                        density: {
                            name: "Density",
                            type: "Number",
                            identity: ["UNDECLARED_02", null],
                            divisor: 1,
                            parametric: false,
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
                                    identity: ["UNDECLARED_03", null],
                                    divisor: 1,
                                    parametric: false,
                                    disabled: false,
                                    default: 250
                                },
                                c22: {
                                    name: "C22",
                                    type: "Number",
                                    identity: ["UNDECLARED_04", null],
                                    divisor: 1,
                                    parametric: false,
                                    disabled: false,
                                    default: 250
                                },
                                c33: {
                                    name: "C33",
                                    type: "Number",
                                    identity: ["UNDECLARED_05", null],
                                    divisor: 1,
                                    parametric: false,
                                    disabled: false,
                                    default: 240
                                },
                                c12: {
                                    name: "C12",
                                    type: "Number",
                                    identity: ["UNDECLARED_06", null],
                                    divisor: 1,
                                    parametric: false,
                                    disabled: false,
                                    default: 108
                                },
                                c13: {
                                    name: "C13",
                                    type: "Number",
                                    identity: ["UNDECLARED_07", null],
                                    divisor: 1,
                                    parametric: false,
                                    disabled: false,
                                    default: 84
                                },
                                c23: {
                                    name: "C23",
                                    type: "Number",
                                    identity: ["UNDECLARED_08", null],
                                    divisor: 1,
                                    parametric: false,
                                    disabled: false,
                                    default: 84
                                },
                                c44: {
                                    name: "C44",
                                    type: "Number",
                                    identity: ["UNDECLARED_09", null],
                                    divisor: 1,
                                    parametric: false,
                                    disabled: false,
                                    default: 116
                                },
                                c55: {
                                    name: "C55",
                                    type: "Number",
                                    identity: ["UNDECLARED_10", null],
                                    divisor: 1,
                                    parametric: false,
                                    disabled: false,
                                    default: 116
                                },
                                c66: {
                                    name: "C66",
                                    type: "Number",
                                    identity: ["UNDECLARED_11", null],
                                    divisor: 1,
                                    parametric: false,
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
                                    identity: ["UNDECLARED_12", null],
                                    divisor: 1,
                                    parametric: false,
                                    disabled: false,
                                    default: 0
                                },
                                theta: {
                                    name: "Theta",
                                    type: "Number",
                                    identity: ["UNDECLARED_13", null],
                                    divisor: 1,
                                    parametric: false,
                                    disabled: false,
                                    default: 0
                                },
                                psi: {
                                    name: "Psi",
                                    type: "Number",
                                    identity: ["UNDECLARED_14", null],
                                    divisor: 1,
                                    parametric: false,
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
                            identity: ["LS", null],
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
                            identity: [null, null], // requires special function, apply converter rules
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
                            identity: [null, null], // requires special function, apply converter rules
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
                            identity: ["LCTY", null],
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
                            identity: ["CA", null],
                            divisor: 1,
                            parametric: false,
                            disabled: false,
                            default: 2.4
                        },
                        depth: {
                            name: "Depth",
                            type: "Number",
                            identity: ["CZ", null],
                            divisor: 1,
                            parametric: false,
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
                                    identity: ["XS", null],
                                    divisor: 1,
                                    parametric: false,
                                    disabled: false,
                                    default: 0
                                },
                                xe: {
                                    name: "X - End",
                                    type: "Number",
                                    identity: ["XE", null],
                                    divisor: 1,
                                    parametric: false,
                                    disabled: false,
                                    default: 60
                                },
                                xi: {
                                    name: "X - Increment",
                                    type: "Number",
                                    identity: ["XI", null],
                                    divisor: 1,
                                    parametric: false,
                                    disabled: false,
                                    default: 2
                                },
                                ys: {
                                    name: "Y - Start",
                                    type: "Number",
                                    identity: ["YS", null],
                                    divisor: 1,
                                    parametric: false,
                                    disabled: false,
                                    default: -20
                                },
                                ye: {
                                    name: "Y - End",
                                    type: "Number",
                                    identity: ["YE", null],
                                    divisor: 1,
                                    parametric: false,
                                    disabled: false,
                                    default: 20
                                },
                                yi: {
                                    name: "Y - Increment",
                                    type: "Number",
                                    identity: ["YI", null],
                                    divisor: 1,
                                    parametric: false,
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
                                    identity: ["WELD", null],
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
                                            divisor: 1,
                                            identity: ["LQ", null],
                                            parametric: false,
                                            disabled: false,
                                            default: 0
                                        },
                                        initialTemperature: {
                                            name: "Initial Temperature",
                                            type: "Number",
                                            divisor: 1,
                                            identity: ["T0", null],
                                            parametric: false,
                                            disabled: false,
                                            default: 0
                                        },
                                        heatEfficiency: {
                                            name: "Heat Effiency",
                                            type: "Number",
                                            divisor: 1,
                                            identity: ["NN", null],
                                            parametric: false,
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
                                            identity: ["B1", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 10
                                        },
                                        b2: {
                                            name: "b\u2082",
                                            type: "Number",
                                            identity: ["B2", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 3
                                        },
                                        b3: {
                                            name: "b\u2083",
                                            type: "Number",
                                            identity: ["B3", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 6
                                        },
                                        t1: {
                                            name: "t\u2081",
                                            type: "Number",
                                            identity: ["T1", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 10
                                        },
                                        t2: {
                                            name: "t\u2082",
                                            type: "Number",
                                            identity: ["T2", null],
                                            divisor: 1,
                                            parametric: false,
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
                                            identity: ["CC", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 0
                                        },
                                        initialGrainSize: {
                                            name: "Initial Grain Size",
                                            type: "Number",
                                            identity: ["D0", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 0
                                        },
                                        density: {
                                            name: "Density",
                                            type: "Number",
                                            identity: ["RA", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 0
                                        },
                                        meltingTemperature: {
                                            name: "Melting Temperature",
                                            type: "Number",
                                            identity: ["TMP", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 0
                                        },
                                        temperatureDiffusivity: {
                                            name: "Temperature Diffusivity",
                                            type: "Number",
                                            identity: ["KK", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 0
                                        },
                                        activationEnergy: {
                                            name: "Activation Energy",
                                            type: "Number",
                                            identity: ["Q", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 0
                                        },
                                        exponentialGrowthConstant: {
                                            name: "Exponential Growth Constant",
                                            type: "Number",
                                            identity: ["AA", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 0
                                        },
                                        grainBoundaryEnergyConstant: {
                                            name: "Grain Boundary Energy Constant",
                                            type: "Number",
                                            identity: ["K0", null],
                                            divisor: 1,
                                            parametric: false,
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
                                            identity: ["HMX1", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 0
                                        },
                                        xe: {
                                            name: "X - End",
                                            type: "Number",
                                            identity: ["HMX2", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 0
                                        },
                                        ys: {
                                            name: "Y - Start",
                                            type: "Number",
                                            identity: ["HMY1", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 0
                                        },
                                        ye: {
                                            name: "Y - End",
                                            type: "Number",
                                            identity: ["HMY2", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 0
                                        },
                                        depth: {
                                            name: "Depth",
                                            type: "Number",
                                            identity: ["HMT0", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 0
                                        },
                                        thickness: {
                                            name: "Thickness",
                                            type: "Number",
                                            identity: ["HMT1", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 0
                                        },
                                        grainSize: {
                                            name: "Grain Size",
                                            type: "Number",
                                            identity: ["HMD0", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 0
                                        },
                                        initial: {
                                            name: "Initial",
                                            type: "Number",
                                            identity: ["HMD1", null],
                                            divisor: 1,
                                            parametric: false,
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
                                            identity: ["CALB2A", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 0
                                        },
                                        diameter: {
                                            name: "Diameter",
                                            type: "Number",
                                            identity: ["CALB2D", null],
                                            divisor: 1,
                                            parametric: false,
                                            disabled: false,
                                            default: 0
                                        },
                                        depth: {
                                            name: "Depth",
                                            type: "Number",
                                            identity: ["CALB2Z", null],
                                            divisor: 1,
                                            parametric: false,
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
                            identity: ["LTTY", null],
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
                            identity: ["TS", null],
                            divisor: 1,
                            parametric: false,
                            disabled: false,
                            default: 0
                        },
                        end: {
                            name: "End",
                            type: "Number",
                            identity: ["TE", null],
                            divisor: 1,
                            parametric: false,
                            disabled: false,
                            default: 50
                        },
                        increment: {
                            name: "Increment",
                            type: "Number",
                            identity: ["TI", null],
                            divisor: 1,
                            parametric: false,
                            disabled: false,
                            default: 0.1
                        },
                        depth: {
                            name: "Depth",
                            type: "Number",
                            identity: ["ZD", null],
                            divisor: 1,
                            parametric: false,
                            disabled: false,
                            default: 0
                        },
                        x: {
                            name: "X",
                            type: "Number",
                            identity: ["XD", null],
                            divisor: 1,
                            parametric: false,
                            disabled: false,
                            default: 0
                        },
                        y: {
                            name: "Y",
                            type: "Number",
                            identity: ["YD", null],
                            divisor: 1,
                            parametric: false,
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
                            identity: [null, null], // requires special function, apply converter rules
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
                            identity: [null, null], // requires special function, apply converter rules
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
                                    divisor: 1,
                                    identity: ["PA", 0],
                                    parametric: true,
                                    disabled: false,
                                    default: 9.5
                                },
                                elements: {
                                    name: "Elements",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["NAWX", 0],
                                    parametric: true,
                                    disabled: false,
                                    default: 16
                                },
                                gap: {
                                    name: "Gap",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["GAPX", 0],
                                    parametric: false,
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
                                    divisor: 1,
                                    identity: ["PB", 0],
                                    parametric: true,
                                    disabled: false,
                                    default: 5.5
                                },
                                elements: {
                                    name: "Elements",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["NAWY", 0],
                                    parametric: true,
                                    disabled: false,
                                    default: 2
                                },
                                gap: {
                                    name: "Gap",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["GAPY", 0],
                                    parametric: false,
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
                            identity: ["NFR", null],
                            disabled: false,
                            default: -1,
                            values: [
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
                            ]
                        },
                        frequency: {
                            name: "Frequency",
                            type: "Number",
                            divisor: 1,
                            identity: ["FREQ", null],
                            parametric: true,
                            disabled: false,
                            default: 1.25
                        },
                        bandwidth: {
                            name: "Bandwidth",
                            type: "Number",
                            divisor: 1,
                            identity: ["BANDW", null],
                            parametric: true,
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
                                    divisor: 1,
                                    identity: ["F1", null],
                                    parametric: false,
                                    disabled: false,
                                    default: 0
                                },
                                f2: {
                                    name: "F2",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["F2", null],
                                    parametric: false,
                                    disabled: false,
                                    default: -3.5
                                },
                                f3: {
                                    name: "F3",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["F3", null],
                                    parametric: false,
                                    disabled: false,
                                    default: 4.75
                                },
                                f4: {
                                    name: "F4",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["F4", null],
                                    parametric: false,
                                    disabled: false,
                                    default: 6.5
                                },
                                af: {
                                    name: "Height at F2 (AF)",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["AF", null],
                                    parametric: false,
                                    disabled: false,
                                    default: 100
                                },
                                bf: {
                                    name: "Height at F3 (BF)",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["BF", null],
                                    parametric: false,
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
                            identity: [null, null], // requires special function, apply converter rules
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
                            divisor: 1,
                            identity: ["FOC", 0],
                            parametric: true,
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
                            divisor: 1,
                            identity: ["XSEP", null],
                            parametric: false,
                            disabled: false,
                            default: 0
                        },
                        y: {
                            name: "Y",
                            type: "Number",
                            divisor: 1,
                            identity: ["YSEP", null],
                            parametric: false,
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
                            identity: [null, null], // requires special function, apply converter rules
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
                            identity: ["INSTY", 0],
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
                            divisor: 1,
                            identity: ["PGA", 0],
                            parametric: true,
                            disabled: false,
                            default: 45
                        },
                        skewAngle: {
                            name: "Skew Angle",
                            type: "Number",
                            divisor: 1,
                            identity: ["PSI", 0],
                            parametric: true,
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
                            divisor: 1000, // mm/s to m/s
                            identity: ["CPW", 0],
                            parametric: false,
                            disabled: false,
                            default: 6320
                        },
                        transversalWavespeed: {
                            name: "Transversal Wavespeed",
                            type: "Number",
                            divisor: 1000, // mm/s to m/s
                            identity: ["CSW", 0],
                            parametric: false,
                            disabled: false,
                            default: 3130
                        },
                        density: {
                            name: "Density",
                            type: "Number",
                            divisor: 1,
                            identity: ["RHOW", 0],
                            parametric: false,
                            disabled: false,
                            default: 2.7
                        },
                        angle: {
                            name: "Angle",
                            type: "Number",
                            divisor: 1,
                            identity: ["GW", 0],
                            parametric: false,
                            disabled: false,
                            default: 49
                        },
                        width: {
                            name: "Width",
                            type: "Number",
                            divisor: 1,
                            identity: ["PCW", 0],
                            parametric: false,
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
                            divisor: 1,
                            identity: ["FPHI", 0],
                            parametric: false,
                            disabled: false,
                            default: 45
                        },
                        theta: {
                            name: "Theta",
                            type: "Number",
                            divisor: 1,
                            identity: ["FTHE", 0],
                            parametric: false,
                            disabled: false,
                            default: 0
                        },
                        psi: {
                            name: "Psi",
                            type: "Number",
                            divisor: 1,
                            identity: ["FPSI", 0],
                            parametric: false,
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
                            divisor: 1,
                            identity: ["RF", null],
                            parametric: false,
                            disabled: false,
                            default: 0
                        },
                        fluidWavespeed: {
                            name: "Fluid Wavespeed",
                            type: "Number",
                            divisor: 1000, // mm/s to m/s
                            identity: ["CF", null],
                            parametric: false,
                            disabled: false,
                            default: 0
                        },
                        damping: {
                            name: "Damping",
                            type: "Number",
                            divisor: 1,
                            identity: ["DBF", null],
                            parametric: false,
                            disabled: false,
                            default: 0
                        }
                    }
                },
                couplant: {
                    name: "Couplant",
                    type: "Number",
                    divisor: 1,
                    identity: ["COUP", 0],
                    parametric: false,
                    disabled: false,
                    default: 0
                },
                distanceToProbe: {
                    name: "Distance - Probe/Surface",
                    type: "Number",
                    divisor: 1,
                    identity: ["PD", 0],
                    parametric: false,
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
                            identity: [null, null], // requires special function, apply converter rules
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
                            identity: [null, null], // requires special function, apply converter rules
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
                                    divisor: 1,
                                    identity: ["PA", 1],
                                    parametric: true,
                                    disabled: false,
                                    default: 9.5
                                },
                                elements: {
                                    name: "Elements",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["NAWX", 1],
                                    parametric: true,
                                    disabled: false,
                                    default: 16
                                },
                                gap: {
                                    name: "Gap",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["GAPX", 1],
                                    parametric: false,
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
                                    divisor: 1,
                                    identity: ["PB", 1],
                                    parametric: true,
                                    disabled: false,
                                    default: 5.5
                                },
                                elements: {
                                    name: "Elements",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["NAWY", 1],
                                    parametric: true,
                                    disabled: false,
                                    default: 2
                                },
                                gap: {
                                    name: "Gap",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["GAPY", 1],
                                    parametric: false,
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
                            identity: [null, null], // requires special function, apply converter rules
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
                            divisor: 1,
                            identity: ["FOC", 1],
                            parametric: true,
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
                            divisor: 1,
                            identity: ["UNDECLARED_15", null],
                            parametric: false,
                            disabled: false,
                            default: 0
                        },
                        y: {
                            name: "Y",
                            type: "Number",
                            divisor: 1,
                            identity: ["UNDECLARED_16", null],
                            parametric: false,
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
                            identity: ["INSTY", 1],
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
                            divisor: 1,
                            identity: ["PGA", 1],
                            parametric: true,
                            disabled: false,
                            default: 45
                        },
                        skewAngle: {
                            name: "Skew Angle",
                            type: "Number",
                            divisor: 1,
                            identity: ["PSI", 1],
                            parametric: true,
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
                            divisor: 1000, // mm/s to m/s
                            identity: ["CPW", 1],
                            parametric: false,
                            disabled: false,
                            default: 6320
                        },
                        transversalWavespeed: {
                            name: "Transversal Wavespeed",
                            type: "Number",
                            divisor: 1000, // mm/s to m/s
                            identity: ["CSW", 1],
                            parametric: false,
                            disabled: false,
                            default: 3130
                        },
                        density: {
                            name: "Density",
                            type: "Number",
                            divisor: 1,
                            identity: ["RHOW", 1],
                            parametric: false,
                            disabled: false,
                            default: 2.7
                        },
                        angle: {
                            name: "Angle",
                            type: "Number",
                            divisor: 1,
                            identity: ["GW", 1],
                            parametric: false,
                            disabled: false,
                            default: 49
                        },
                        width: {
                            name: "Width",
                            type: "Number",
                            divisor: 1,
                            identity: ["PCW", 1],
                            parametric: false,
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
                            divisor: 1,
                            identity: ["FPHI", 1],
                            parametric: false,
                            disabled: false,
                            default: 45
                        },
                        theta: {
                            name: "Theta",
                            type: "Number",
                            divisor: 1,
                            identity: ["FTHE", 1],
                            parametric: false,
                            disabled: false,
                            default: 0
                        },
                        psi: {
                            name: "Psi",
                            type: "Number",
                            divisor: 1,
                            identity: ["FPSI", 1],
                            parametric: false,
                            disabled: false,
                            default: 0
                        }
                    }
                },
                couplant: {
                    name: "Couplant",
                    type: "Number",
                    divisor: 1,
                    identity: ["COUP", 1],
                    parametric: false,
                    disabled: false,
                    default: 0
                },
                distanceToProbe: {
                    name: "Distance - Probe/Surface",
                    type: "Number",
                    divisor: 1,
                    identity: ["PD", 1],
                    parametric: false,
                    disabled: false,
                    default: 0
                },
                focusDepth: {
                    name: "Focus Depth",
                    type: "Number",
                    divisor: 1,
                    identity: ["UNDECLARED_17", null],
                    parametric: false,
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
                            divisor: 1,
                            identity: ["XDEF", null],
                            parametric: true,
                            disabled: false,
                            default: 15
                        },
                        y: {
                            name: "Y",
                            type: "Number",
                            divisor: 1,
                            identity: ["YDEF", null],
                            parametric: true,
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
                            identity: ["LDTY", null],
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
                                    divisor: 1,
                                    identity: ["DA", null],
                                    parametric: true,
                                    disabled: false,
                                    default: 5
                                },
                                centreDepth: {
                                    name: "Centre Depth",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["DZ", null],
                                    parametric: true,
                                    disabled: false,
                                    default: 30
                                },
                                diameterParallel: {
                                    name: "Diameter Parallel",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["DA", null],
                                    parametric: true,
                                    disabled: false,
                                    default: 5
                                },
                                diameterPerpendicular: {
                                    name: "Diameter Perpendicular",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["DB", null],
                                    parametric: true,
                                    disabled: false,
                                    default: 30
                                },
                                height: {
                                    name: "Height",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["A", null],
                                    parametric: true,
                                    disabled: false,
                                    default: 5
                                },
                                lengthParallel: {
                                    name: "Length, Parallel Y-axis",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["B", null],
                                    parametric: true,
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
                                    name: "Tilt",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["ETHA", null],
                                    parametric: true,
                                    disabled: false,
                                    default: 0
                                },
                                skew: {
                                    name: "Skew",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["PHI", null],
                                    parametric: true,
                                    disabled: false,
                                    default: 0
                                },
                                tiltOfCrack: {
                                    name: "Tilt of Crack",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["PS", null],
                                    parametric: true,
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
                                    divisor: 1,
                                    identity: ["DRR", null],
                                    parametric: false,
                                    disabled: false,
                                    default: 0
                                },
                                longitudinalVelocity: {
                                    name: "Longitudinal Velocity",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["CPI", null],
                                    parametric: false,
                                    disabled: false,
                                    default: 0
                                },
                                transversalVelocity: {
                                    name: "Transversal Velocity",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["CSI", null],
                                    parametric: false,
                                    disabled: false,
                                    default: 0
                                },
                                damping: {
                                    name: "Damping",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["DBI", null],
                                    parametric: false,
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
                                    identity: ["LDC", null],
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
                                    divisor: 1,
                                    identity: ["DC", null],
                                    parametric: false,
                                    disabled: false,
                                    default: 0.5
                                },
                                contactDiameter: {
                                    name: "Contact Diameter",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["DAC", null],
                                    parametric: false,
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
                                    identity: [null, null],
                                    disabled: false,
                                    default: false
                                },
                                depth: {
                                    name: "Depth",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["BZ", null],
                                    parametric: false,
                                    disabled: false,
                                    default: 5
                                },
                                tiltFromHorizontal: {
                                    name: "Tilt from Horizontal",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["ET", null],
                                    parametric: false,
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
                                    identity: [null, null],
                                    disabled: false,
                                    default: false
                                },
                                rmsHeight: {
                                    name: "RMS Height",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["EPSI", null],
                                    parametric: false,
                                    disabled: false,
                                    default: 0
                                },
                                corrLength: {
                                    name: "Corr. Length",
                                    type: "Number",
                                    divisor: 1,
                                    identity: ["LZ", null],
                                    parametric: false,
                                    disabled: false,
                                    default: 0
                                }
                            }
                        },
                        integration: {
                            name: "Integration",
                            type: "Dropdown",
                            identity: ["UNDECLARED_20", null], // could be DEL
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

export function constructDefaultTreeData(data, children) {
    for (const [key, value] of Object.entries(children)) {
        if (value.type == "Expandable") {
            data[key] = {}
            constructDefaultTreeData(data[key], value.children)
        } else if (value.type == "Number") {
            if (value.parametric == true) {
                data[key] = {
                    value: value.default,
                    end: value.default,
                    increment: 1
                }
            } else {
                data[key] = {
                    value: value.default
                }
            }
        } else {
            data[key] = {
                value: value.default
            }
        }
    }

    return data
}

export function constructParametricData(data, misc) {
    const ret = []
    const restructured = {}
    const combinations = [];

    // Restructure the data for creating the parametric arrays
    const recurse = async(t, d) => {
        for (const [k, v] of Object.entries(t)) { 
            if (v.type == "Expandable") { 
                recurse(v.children, d[k])
            } else if (v.type == "Number" && v.parametric) {
                let identityType = v.identity[0]
                let identityIdx = v.identity[1]
                let range = []

                for (let i = d[k].value; i < d[k].end + 1; i += d[k].increment) { 
                    if (d[k].value == d[k].end) { 
                        break 
                    }

                    if (identityIdx == null) {
                        range.push(i / v.divisor) // add unit divisor in tree for eg CS and CP
                    } else {
                        let pair = [null, null]
                        pair[identityIdx] = i / v.divisor
                        range.push(pair)
                    }

                    if (range.length > 0) {
                        restructured[identityType] = range
                    }
                }
            }
        }
    }
    recurse(tree.children, data)

    // Recursively generate combinations
    const generateCombinations = (obj, currentCombination, remainingKeys) => {
        if (remainingKeys.length === 0) {
            combinations.push(currentCombination);
        } else {
            const nextKey = remainingKeys[0];

            for (const value of obj[nextKey]) {
                const newCombination = { ...currentCombination, [nextKey]: value };
                generateCombinations(obj, newCombination, remainingKeys.slice(1));
            }
        }
    }
    generateCombinations(restructured, {}, Object.keys(restructured));

    // Generate a list of return values based on defaults using isoSaveData
    for(let i = 0; i < combinations.length; i++) {
        ret.push(constructIsoSaveData(data, misc))
    }

    // Finally replace the ret data with the combinations
    for(let i = 0; i < ret.length; i++) { 
        for (const [k, v] of Object.entries(combinations[i])) { 
            if (typeof v == 'object') {
                if (v[0] != null) {
                    ret[i][k][0] = v[0]
                } else if (v[1] != null) {
                    ret[i][k][1] = v[1]
                }
            } else if (typeof v == 'number') {
                ret[i][k] = v
            }
        }
    }

    return ret
}