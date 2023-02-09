import { convertNFRToLP, convertAutoElementsToISHA, convertFocusAndTechniqueToIMODE } from "./utDefUtils"

export class UTDefectIsoSaver {
    constructor(data, miscParameters)
    {
        this.LP = convertNFRToLP(data.transmitter.spectrum.stype.value)
        this.LS = data.method.utTechnique.method.value
        this.XS = data.method.mesh.size.xs.value
        this.XE = data.method.mesh.size.xe.value
        this.XI = data.method.mesh.size.xi.value
        this.YS = data.method.mesh.size.ys.value
        this.YE = data.method.mesh.size.ye.value
        this.YI = data.method.mesh.size.yi.value
        this.CP = data.method.material.metalProperties.longitudinalVelocity.value / 1000
        this.CS = data.method.material.metalProperties.transversalVelocity.value / 1000
        this.DBA = data.method.material.metalProperties.damping.value
        this.NFR = data.transmitter.spectrum.stype.value
        this.FREQ = data.transmitter.spectrum.frequency.value
        this.BANDW = data.transmitter.spectrum.bandwidth.value 
        this.F1 = data.transmitter.spectrum.input.f1.value  
        this.F2 = data.transmitter.spectrum.input.f2.value   
        this.F3 = data.transmitter.spectrum.input.f3.value   
        this.F4 = data.transmitter.spectrum.input.f4.value   
        this.AF = data.transmitter.spectrum.input.af.value   
        this.BF = data.transmitter.spectrum.input.bf.value
        this.LTTY = data.method.timeWindow.twtype.value
        this.TS = data.method.timeWindow.start.value 
        this.TE = data.method.timeWindow.end.value  
        this.TI = data.method.timeWindow.increment.value  
        this.XD = data.method.timeWindow.x.value  
        this.YD = data.method.timeWindow.y.value  
        this.ZD = data.method.timeWindow.depth.value  
        this.IMODE = [
            convertFocusAndTechniqueToIMODE(data.transmitter.focus.ftype.value, data.method.utTechnique.transmitter.value),
            convertFocusAndTechniqueToIMODE(data.receiver.focus.ftype.value, data.method.utTechnique.receiver.value)
        ]
        this.INSTY = [
            data.transmitter.wave.suppression.value == true ? 1 : 0, 
            data.receiver.wave.suppression.value == true ? 1 : 0
        ]
        this.PGA = [
            data.transmitter.beamAngles.angle.value, 
            data.receiver.beamAngles.angle.value
        ]
        this.PSI = [
            data.transmitter.beamAngles.skewAngle.value, 
            data.receiver.beamAngles.skewAngle.value
        ]
        this.ISHA = [
            convertAutoElementsToISHA(data.transmitter.shapeAndElements.autoNumElements.value,
                data.transmitter.shapeAndElements.shape.value), 
            convertAutoElementsToISHA(data.receiver.shapeAndElements.autoNumElements.value,
                data.receiver.shapeAndElements.shape.value)
        ]
        this.COUP = [
            data.transmitter.couplant.value, 
            data.receiver.couplant.value
        ]
        this.PA = [
            data.transmitter.shapeAndElements.x.length.value, 
            data.receiver.shapeAndElements.x.length.value
        ]
        this.PB = [
            data.transmitter.shapeAndElements.y.length.value, 
            data.receiver.shapeAndElements.y.length.value
        ]
        this.PD = [
            data.transmitter.distanceToProbe.value, 
            data.receiver.distanceToProbe.value
        ]
        this.NAWX = [
            data.transmitter.shapeAndElements.x.elements.value, 
            data.receiver.shapeAndElements.x.elements.value
        ]
        this.NAWY = [
            data.transmitter.shapeAndElements.y.elements.value, 
            data.receiver.shapeAndElements.y.elements.value
        ]
        this.GAPX = [
            data.transmitter.shapeAndElements.x.gap.value, 
            data.receiver.shapeAndElements.x.gap.value
        ]
        this.GAPY = [
            data.transmitter.shapeAndElements.y.gap.value, 
            data.receiver.shapeAndElements.y.gap.value
        ]
        this.RHOW = [
            data.transmitter.wedge.density.value, 
            data.receiver.wedge.density.value
        ]
        this.CPW = [
            data.transmitter.wedge.longitudinalWavespeed.value, 
            data.receiver.wedge.longitudinalWavespeed.value
        ]
        this.CSW = [
            data.transmitter.wedge.transversalWavespeed.value, 
            data.receiver.wedge.transversalWavespeed.value
        ]
        this.PCW = [
            data.transmitter.wedge.width.value, 
            data.receiver.wedge.width.value
        ]
        this.GW = [
            data.transmitter.wedge.angle.value, 
            data.receiver.wedge.angle.value
        ]
        this.RF = data.transmitter.fluidSpecification.densityRatio.value 
        this.CF = data.transmitter.fluidSpecification.fluidWavespeed.value
        this.DBF = data.transmitter.fluidSpecification.damping.value
        this.FPHI = [
            data.transmitter.eulerAngles.phi.value, 
            data.receiver.eulerAngles.phi.value
        ]
        this.FTHE = [
            data.transmitter.eulerAngles.theta.value, 
            data.receiver.eulerAngles.theta.value
        ]
        this.FPSI = [
            data.transmitter.eulerAngles.psi.value, 
            data.receiver.eulerAngles.psi.value
        ]
        this.FOC = [
            data.transmitter.focus.focalDistance.value, 
            data.receiver.focus.focalDistance.value
        ]
        this.XSEP = data.transmitter.position.x.value
        this.YSEP = data.transmitter.position.y.value
        this.LDTY = data.defect.specification.variant.value

        let isBackwallEnabled = data.defect.surfaces.backwall.enabled.value
        let isRoughnessEnabled = data.defect.surfaces.roughness.enabled.value

        if (isBackwallEnabled && isRoughnessEnabled && (this.LDTY == 5 || this.LDTY == 7)) {
            this.LDTY += 30
        } else if (!isBackwallEnabled && isRoughnessEnabled && (this.LDTY == 5 || this.LDTY == 7)) {
            this.LDTY += 20
        } else if (isBackwallEnabled && (this.LDTY >= 1 && this.LDTY <= 7)) {
            this.LDTY += 10
        }

        switch(this.LDTY) {
            case 1:
            case 2:
            case 3:
            case 8:
            case 11:
            case 12:
            case 13:
                this.DA = data.defect.specification.measurement.diameter.value
                break
            case 7:
            case 17:
            case 19:
            case 27:
            case 37:
                this.DA = data.defect.specification.measurement.height.value
                break
            case 4:
            case 14:
                this.DA = data.defect.specification.measurement.diameterParallel.value
                break
        }

        this.DZ = data.defect.specification.measurement.centreDepth.value
        this.ETHA = data.defect.specification.angles.tilt.value
        this.PHI = data.defect.specification.angles.skew.value 
        this.LDC = data.defect.specification.circularProperties.variant.value
        this.DC = data.defect.specification.circularProperties.stressQuotient.value  
        this.DAC = data.defect.specification.circularProperties.contactDiameter.value  
        this.DB = data.defect.specification.measurement.diameterPerpendicular.value
        this.DBI = data.defect.specification.inclusionProperties.damping.value
        this.A = data.defect.specification.measurement.height.value
        this.B = data.defect.specification.measurement.lengthParallel.value
        this.PS = data.defect.specification.angles.tilt.value
        this.BZ = data.defect.surfaces.backwall.depth.value
        this.ET = data.defect.surfaces.backwall.tiltFromHorizontal.value
        this.DEL = 0 // ?? Could potentially be related to defect => surfaces => integration
        this.EPSI = data.defect.surfaces.roughness.rmsHeight.value 
        this.LZ = data.defect.surfaces.roughness.corrLength.value 
        this.LCTY = data.method.calibration.ctype.value
        this.CA = data.method.calibration.diameter.value
        this.CZ = data.method.calibration.depth.value
        this.IA = miscParameters.accuracy
        this.XDEF = data.defect.position.x.value
        this.YDEF = data.defect.position.y.value
        this.WELD = data.method.mesh.weld.wtype.value
        this.B1 = data.method.mesh.weld.geometry.b1.value
        this.B2 = data.method.mesh.weld.geometry.b2.value
        this.B3 = data.method.mesh.weld.geometry.b3.value 
        this.T1 = data.method.mesh.weld.geometry.t1.value 
        this.T2 = data.method.mesh.weld.geometry.t2.value 
        this.CALB2A = data.method.mesh.weld.signalToNoiseRatio.percentageOfSDH.value
        this.CALB2D = data.method.mesh.weld.signalToNoiseRatio.diameter.value 
        this.CALB2Z = data.method.mesh.weld.signalToNoiseRatio.depth.value 
        this.LQ = data.method.mesh.weld.parameters.inputEnergy.value
        this.T0 = data.method.mesh.weld.parameters.initialTemperature.value 
        this.NN = data.method.mesh.weld.parameters.heatEfficiency.value 
        this.CC = data.method.mesh.weld.properties.specificHeat.value 
        this.D0 = data.method.mesh.weld.properties.initialGrainSize.value  
        this.RA = data.method.mesh.weld.properties.density.value  
        this.TMP = data.method.mesh.weld.properties.meltingTemperature.value  
        this.KK = data.method.mesh.weld.properties.temperatureDiffusivity.value 
        this.Q = data.method.mesh.weld.properties.activationEnergy.value  
        this.AA = data.method.mesh.weld.properties.exponentialGrowthConstant.value  
        this.K0 = data.method.mesh.weld.properties.grainBoundaryEnergyConstant.value  
        this.DRR = data.defect.specification.inclusionProperties.relativeDensity.value 
        this.CPI = data.defect.specification.inclusionProperties.longitudinalVelocity.value  
        this.CSI = data.defect.specification.inclusionProperties.transversalVelocity.value  
        this.HMT0 = data.method.mesh.weld.controlVolume.depth.value  
        this.HMT1 = data.method.mesh.weld.controlVolume.thickness.value   
        this.HMX1 = data.method.mesh.weld.controlVolume.xs.value   
        this.HMX2 = data.method.mesh.weld.controlVolume.xe.value   
        this.HMY1 = data.method.mesh.weld.controlVolume.ys.value   
        this.HMY2 = data.method.mesh.weld.controlVolume.ye.value   
        this.HMD0 = data.method.mesh.weld.controlVolume.grainSize.value   
        this.HMD1 = data.method.mesh.weld.controlVolume.initial.value   
        this.NDE = [0, 0]
        this.DEIXYT = []
        this.DEIXYR = []
        this.DET = false
        this.DER = false
    }

    async Save() {
        // Check if folder exists under saves
        let pharr = [0, 0]
        let homeDir = await window.electronAPI.getHomeDir()
        let saveLoc = homeDir + "/Documents/simSUNDT/tmp/utdefdat"

        let writeArray = []
        writeArray.push("Indefa")
        writeArray.push(" 1" + "   " + "Mode")
        writeArray.push(" " + (10*this.LS + this.LP) + "   " + "UT Technique")
        writeArray.push(" " + this.XS + " , " + this.XE + " , " + this.XI + "   " + "X Start, X End, X Increment");
        writeArray.push(" " + this.YS + " , " + this.YE + " , " + this.YI + "   " + "Y Start, Y End, Y Increment")
        writeArray.push(" " + this.CP + " , " + this.CS + "   " + "Longitudinal Wavespeed & Transversal Wavespeed")

        if (this.CP < 0) {
            writeArray.push(" " + this.DBA + "   " + "Dampening");
        }

        writeArray.push(" " + this.NFR + "   " + "Spectrum");

        if (this.NFR < 0 || this.NFR == 1) {
            writeArray.push(" " + this.FREQ + " , " + this.BANDW + "   " + "Frequency & Bandwidth");
        } else {
            writeArray.push(" " + this.F1 + " , " + this.F2 + " , " + this.F3 + " , " + this.F4 + "   " + "F1, F2, F3, F4");
            writeArray.push(" " + this.AF + " , " + this.BF + "   " + "Height of F2 and F3");
        }

        if (this.NFR != 1 && this.LS != 0) {
            writeArray.push(" " + this.LTTY + "   " + "Time Window Type");

            if (this.LTTY == 2) { 
                writeArray.push(" " + this.TS + " , " + this.TE + " , " + this.TI + "   " + 
                "Time Window: Start, End, and Increment"); 
            }

            if (this.LTTY == 3) { 
                writeArray.push(" " + this.XD + " , " + this.YD + " , " + this.ZD + "   " + "Time Window: X Depth, Y Depth, Depth of Diffraction");
                writeArray.push(" " + this.TS + " , " + this.TI + "   " + "Time Window: Start and Increment");
            }
        }

        if (this.IMODE[0] == 4 || this.IMODE[0] == 24){
            writeArray.push(" " + this.IMODE[0] + " , " + this.ISHA[0] + " , " + this.COUP[0] + "   " + "Focus, Shape and Coupling");
        } else {
            writeArray.push(" " + this.IMODE[0] + " , " + this.INSTY[0] + " , " + this.COUP[0] + "   " + "Focus, Suppression and Coupling");
        }

        if (this.IMODE[0] < 0) { pharr[0] = 2; this.IMODE[0] = -this.IMODE[0]; }

        if (this.IMODE[0] != 4 && this.IMODE[0] != 24) {
            writeArray.push(" " + this.PGA[0] + " , " + this.PSI[0] + "   " + "Probe Angle and Skew");
            writeArray.push(" " + this.ISHA[0] + " , " + this.PA[0] + " , " + this.PB[0] + "   " + "Probe Type, Length in X, and Y Direction");

            if (this.ISHA[0] < 0) {
                writeArray.push(" " + this.NAWX[0] + " , " + this.NAWY[0] + "   " + "Probe Separation");

                if (pharr[0] != 0) {
                    writeArray.push(" " + this.GAPX[0] + " , " + this.GAPY[0] + " , " + this.RHOW[0] + "   " + "Gap of X, Y and Density");

                    if (this.RHOW[0] > 0) {
                        writeArray.push(" " + this.CPW[0] + " , " + this.CSW[0] + "   " + "Wedge Longitudinal and Transversal");
                        writeArray.push(" " + this.PCW[0] + " , " + this.GW[0] + "   " + "Wedge Width and Gradient");
                    }
                }
            }

            if (this.IMODE[0] > 10) {
                writeArray.push(" " + this.FOC[0]);
            }

            if (pharr[0] != 0 && this.LP == 1) {
                this.XSEP = 0;
                this.YSEP = 0;
                this.NAWX[1] = this.NAWX[0];
                this.NAWY[1] = this.NAWY[0];
                this.GAPX[1] = this.GAPX[0];
                this.GAPY[1] = this.GAPY[0];
                this.RHOW[1] = this.RHOW[0];

                if (this.RHOW[0] > 0) {
                    this.CPW[1] = this.CPW[0];
                    this.CSW[1] = this.CSW[0];
                    this.PCW[1] = this.PCW[0];
                    this.GW[1] = this.GW[0];
                }

                if (this.IMODE[0] > 10) {
                    this.FOC[1] = this.FOC[0];
                }
            }
        } else {
            // ISHA[0] = INSTY[0]; In immersion mode, it seems that INSTY is overwritten to be ISHA?

            if (this.ISHA[0] < 0) {
                writeArray.push(" " + this.NAWX[0] + " , " + this.NAWY[0]);
            }

            writeArray.push(" " + this.PD[0] + " , " + this.PA[0] + " , " + this.PB[0] + "   " + "Height, Shape X, Shape Y");
            writeArray.push(" " + this.RF + " , " + this.CF + "   " + "Immersion Density and Wavespeed");
            writeArray.push(" " + this.FPHI[0] + " , " + this.FTHE[0] + " , " + this.FPSI[0] + "   " + "Immersion Euler Angles, Phi, Theta and Psi");

            if (this.CF < 0) {
                writeArray.push(" " + this.DBF);
            }

            // For some reason source program does: if (this.IMODE[0] > 10) { writeArray.push(" " + FOC[0]); } ==> impossible to reach
        }

        // LP in fortran. TODO: Investigate that this is correct
        if (this.LS >= 2) {
            writeArray.push(" " + this.IMODE[1] + " , " + this.INSTY[1] + " , " + this.COUP[1] + "   " + "Focus, Suppression and Coupling for Receiver");

            pharr[1] = 0;

            if (this.IMODE[1] < 0) {
                this.IMODE[1] = -this.IMODE[1];
                pharr[1] = 1;
            }

            if ((this.IMODE[1] - (10 * (this.IMODE[1] / 10))) != 4) {
                writeArray.push(" " + this.PGA[1] + " , " + this.PSI[1] + " , ");
                writeArray.push(" " + this.ISHA[1] + " , " + this.PA[1] + " , " + " , " + this.PB[1]);

                if (this.ISHA[1] < 0) {
                    writeArray.push(" " + this.NAWX[1] + " , " + this.NAWY[1]);

                    if (pharr[1] != 0) {
                        writeArray.push(" " + this.GAPX[1] + " , " + this.GAPY[1] + " , " + this.RHOW[1]);

                        if (this.RHOW[1] > 0) {
                            writeArray.push(" " + this.CPW[1] + " , " + this.CSW[1]);
                            writeArray.push(" " + this.PCW[1] + " , " + this.GW[1]);
                        }
                    }
                }

                if (this.IMODE[1] > 10) {
                    writeArray.push(" " + this.FOC[1]);
                }
            } else {
                this.ISHA[1] = this.INSTY[1];

                if (this.ISHA[1] < 0) {
                    writeArray.push(" " + this.NAWX[1] + " , " + this.NAWY[1]);
                }

                writeArray.push(" " + this.PD[1] + " , " + this.PA[1] + " , " + this.PB[1]);
                writeArray.push(" " + this.FPHI[1] + " , " + this.FTHE[1] + " , " + this.FPSI[1]);

                if (this.IMODE[1] == 24) {
                    writeArray.push(" " + this.FOC[1]);
                }
            }

            writeArray.push(" " + this.XSEP + " , " + this.YSEP);

            if (pharr[0] != 0 && this.LS == 1) {
                this.LS = 2;
            }
        }
        else {
            this.XSEP = 0;
            this.YSEP = 0;
        }

        writeArray.push(" " + this.LDTY + " , " + this.DZ + "   " + "Defect Type and Centre Depth");

        if (this.LDTY == 1 || this.LDTY == 11) {
            writeArray.push(" " + this.DA + "   " + "Defect Diameter");
        }

        if (this.LDTY == 2 || this.LDTY == 12) {
            writeArray.push(" " + this.DA + " , " + this.DRR + " , " +  this.CPI + " , " + this.CSI);
        }

        if (this.CPI < 0) {
            writeArray.push(" " + this.DBI);
        }

        if (this.LDTY == 3 || this.LDTY == 13) {
            writeArray.push(" " + this.DA + " , " + this.ETHA + " , " + this.PHI);
            writeArray.push(" " + this.LDC);

            if (this.LDC == 3)
            {
                writeArray.push(" " + this.DC + " , " + this.DAC);
            }
        }

        if (this.LDTY == 4 || this.LDTY == 14) {
            writeArray.push(" " + this.DA + " , " + this.DB + " , " + this.ETHA + " , " + this.PHI);
        }

        if (this.LDTY == 5 || this.LDTY == 25) {
            writeArray.push(" " + this.A + " , " + this.B + " , " + this.PS);
        }

        if (this.LDTY == 7 || this.LDTY == 27) {
            writeArray.push(" " + this.DA + " , " + this.PS);
        }

        if (this.LDTY == 8) {
            writeArray.push(" " + this.DA);
        }

        if (this.LDTY == 15 || this.LDTY == 35) {
            writeArray.push(" " + this.A + " , " + this.B + " , " + this.PS + " , " + this.ET);
        }

        if (this.LDTY == 17 || this.LDTY == 19 || this.LDTY == 37) {
            writeArray.push(" " + this.DA + " , " + this.PS + " , " + this.ET);
        }

        if (this.DA < 0) { writeArray.push(" " + this.DEL); } // Can't find the point of this

        if ((this.LDTY > 10 && this.LDTY < 18) || this.LDTY == 37) {
            writeArray.push(" " + this.BZ);
        }

        if (this.LDTY >= 27) {
            writeArray.push(" " + this.PSI + " , " + this.LZ);
        }

        writeArray.push(" " + this.LCTY + "   " + "Calibration Type");

        if (this.LCTY == 1 || this.LCTY == 2) {
            writeArray.push(" " + this.CA + " , " + this.CZ);
        }

        if (this.LCTY == 3) {
            writeArray.push(" " + this.CZ);
        }

        writeArray.push(" " + this.IA + "   " + "Accuracy Index");
        writeArray.push(" " + this.XDEF + " , " + this.YDEF + "   " + "X/Y Position of the Defect");

        writeArray.push(" " + this.WELD);

        if (this.WELD == "Welding_Parameters") {
            writeArray.push(" " + this.B1 + " , " + this.B2 + " , " + this.B3);
            writeArray.push(" " + this.T1 + " , " + this.T2);
            writeArray.push(" " + this.CALB2A + " , " + this.CALB2D + " , " + this.CALB2Z);
            writeArray.push(" " + this.LQ + " , " + this.T0 + " , " + this.NN);
            writeArray.push(" " + this.CC + " , " + this.D0 + " , " + this.RA + " , " + this.TMP);
            writeArray.push(" " + this.KK + " , " + this.Q + " , " + this.AA + " , " + this.K0);
        }
            
        if (this.WELD == "Hard_Measurement") {
            writeArray.push(" " + this.HMT0 + " , " + this.HMT1);
            writeArray.push(" " + this.HMX1 + " , " + this.HMX2 + " , " + this.HMY1 + " , " + this.HMY2);
            writeArray.push(" " + this.CALB2A + " , " + this.CALB2D + " , " + this.CALB2Z);
            writeArray.push(" " + this.HMD0 + " , " + this.HMD1);
        }

        if (pharr[0] != 0)
        {
            if (this.DET && !this.DER) {
                writeArray.push("Dead_Elements");
            } else if (this.DET && this.DER) {
                writeArray.push("Dead_Elements/T");
            }

            if (this.DET) {
                writeArray.push(" " + this.NDE[0]);

                let s = " ";

                for(let i = 0; i < (Math.ceil(this.DEIXYT.length/10))*10; i++) {
                    if (i % 10 == 0 && i != 0) {
                        writeArray.push(s);
                        s = " ";
                    } 
                    else {
                        try {
                            if (i % 10 == 0) {
                                s += " " + this.DEIXYT[i]; // , 5 , 5
                            } 
                            else {
                                s += " , " + this.DEIXYT[i];
                            }
                        } catch {
                            if (i % 10 == 0)
                            {
                                s += " 0";
                            } 
                            else
                            {
                                s += " , 0";
                            }
                        }
                    }
                }
            }
        }

        if (pharr[1] != 0) { 
            if (this.DER) {
                writeArray.push("Dead_Elements/R");

                writeArray.push(" " + this.NDE[1]);

                let s = " ";

                for (let i = 0; i < (Math.ceil(this.DEIXYR.length/10))*10; i++)
                {
                    if (i % 10 == 0 && i != 0) {
                        writeArray.push(s);
                        s = " ";
                    } else {
                        try {
                            if (i % 10 == 0)
                            {
                                s += " " + this.DEIXYR[i]; // , 5 , 5
                            }
                            else
                            {
                                s += " , " + this.DEIXYR[i];
                            }
                        } catch {
                            if (i % 10 == 0) {
                                s += " 0";
                            } else {
                                s += " , 0";
                            }
                        }
                    }
                }
            }
        }

        let writeSuccessful = await window.electronAPI.writeFileByLines(saveLoc, writeArray)
        
        return Promise.resolve(writeSuccessful)
    }

    
}