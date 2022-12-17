export class UTDefectIsoSaver {
    LP: number 
    LS: number 
    XS: number 
    XE: number 
    XI: number 
    YS: number 
    YE: number 
    YI: number 
    CP: number 
    CS: number 
    DBA: number 
    NFR: number 
    FREQ: number 
    BANDW: number 
    F1: number 
    F2: number 
    F3: number 
    F4: number 
    AF: number 
    BF: number 
    LTTY: number 
    TS: number 
    TE: number 
    TI: number 
    XD: number 
    YD: number 
    ZD: number 
    IMODE: [number, number] 
    INSTY: [number, number] 
    COUP: [number, number] 
    PGA: [number, number] 
    PSI: [number, number] 
    ISHA: [number, number] 
    PA: [number, number] 
    PB: [number, number] 
    PD: [number, number] 
    NAWX: [number, number] 
    NAWY: [number, number] 
    GAPX: [number, number] 
    GAPY: [number, number] 
    RHOW: [number, number] 
    CPW: [number, number] 
    CSW: [number, number] 
    PCW: [number, number] 
    GW: [number, number] 
    RF: number 
    CF: number 
    FPHI: [number, number] 
    FTHE: [number, number] 
    FPSI: [number, number] 
    DBF: number 
    FOC: [number, number] 
    XSEP: number 
    YSEP: number 
    LDTY: number 
    DZ: number 
    DA: number
    ETHA: number 
    PHI: number 
    LDC: number 
    DC: number 
    DAC: number  
    DB: number 
    DBI: number 
    A: number 
    B: number 
    PS: number 
    BZ: number 
    ET: number 
    DEL: number 
    EPSI: number 
    LZ: number 
    LCTY: number 
    CA: number 
    CZ: number 
    IA: number 
    XDEF: number 
    YDEF: number 
    WELD: string 
    B1: number 
    B2: number 
    B3: number 
    T1: number 
    T2: number 
    CALB2A: number 
    CALB2D: number 
    CALB2Z: number 
    LQ: number 
    T0: number 
    NN: number 
    CC: number 
    D0: number 
    RA: number 
    TMP: number 
    KK: number 
    Q: number 
    AA: number 
    K0: number 
    DRR: number 
    CPI: number 
    CSI: number 
    HMT0: number 
    HMT1: number 
    HMX1: number 
    HMX2: number 
    HMY1: number 
    HMY2: number 
    HMD0: number 
    HMD1: number 
    NDE: [number, number] 
    DEIXYT: Array<number>
    DEIXYR: Array<number>
    DET: boolean
    DER: boolean


    // TODO: Add NDE, DEIXYT, DEIXYR, DET and DER when ready

    constructor()
    {
        this.LP = 0 
        this.LS = 0 
        this.XS = 0 
        this.XE = 0 
        this.XI = 0 
        this.YS = 0 
        this.YE = 0 
        this.YI = 0 
        this.CP = 0 
        this.CS = 0 
        this.DBA = 0 
        this.NFR = 0 
        this.FREQ = 0 
        this.BANDW = 0 
        this.F1 = 0 
        this.F2 = 0 
        this.F3 = 0 
        this.F4 = 0 
        this.AF = 0 
        this.BF = 0 
        this.LTTY = 0 
        this.TS = 0 
        this.TE = 0 
        this.TI = 0 
        this.XD = 0 
        this.YD = 0 
        this.ZD = 0 
        this.IMODE = [0, 0]
        this.INSTY = [0, 0]
        this.PGA = [0, 0]
        this.PSI = [0, 0]
        this.ISHA = [0, 0]
        this.COUP = [0, 0]
        this.PA = [0, 0]
        this.PB = [0, 0]
        this.PD = [0, 0]
        this.NAWX = [0, 0]
        this.NAWY = [0, 0]
        this.GAPX = [0, 0]
        this.GAPY = [0, 0]
        this.RHOW = [0, 0]
        this.CPW = [0, 0]
        this.CSW = [0, 0]
        this.PCW = [0, 0]
        this.GW = [0, 0]
        this.RF = 0 
        this.CF = 0 
        this.FPHI = [0, 0]
        this.FTHE = [0, 0]
        this.FPSI = [0, 0]
        this.DBF = 0
        this.FOC = [0, 0]
        this.XSEP = 0 
        this.YSEP = 0 
        this.LDTY = 0 
        this.DZ = 0 
        this.DA = 0
        this.ETHA = 0 
        this.PHI = 0 
        this.LDC = 0 
        this.DC = 0 
        this.DAC = 0  
        this.DB = 0 
        this.DBI = 0 
        this.A = 0 
        this.B = 0 
        this.PS = 0 
        this.BZ = 0 
        this.ET = 0 
        this.DEL = 0 
        this.EPSI = 0 
        this.LZ = 0 
        this.LCTY = 0 
        this.CA = 0 
        this.CZ = 0 
        this.IA = 0 
        this.XDEF = 0 
        this.YDEF = 0 
        this.WELD = "" 
        this.B1 = 0 
        this.B2 = 0 
        this.B3 = 0 
        this.T1 = 0 
        this.T2 = 0 
        this.CALB2A = 0 
        this.CALB2D = 0 
        this.CALB2Z = 0 
        this.LQ = 0 
        this.T0 = 0 
        this.NN = 0 
        this.CC = 0 
        this.D0 = 0 
        this.RA = 0 
        this.TMP = 0 
        this.KK = 0 
        this.Q = 0 
        this.AA = 0 
        this.K0 = 0 
        this.DRR = 0 
        this.CPI = 0 
        this.CSI = 0 
        this.HMT0 = 0 
        this.HMT1 = 0 
        this.HMX1 = 0 
        this.HMX2 = 0 
        this.HMY1 = 0 
        this.HMY2 = 0 
        this.HMD0 = 0 
        this.HMD1 = 0 
        this.NDE = [0, 0]
        this.DEIXYT = new Array<number>()
        this.DEIXYR = new Array<number>()
        this.DET = false;
        this.DER = false;
    }

    async Save() {
        // Check if folder exists under saves
        let pharr: [number, number] = [0, 0]
        let homeDir: string = await window.electronAPI.getHomeDir()
        let saveLoc: string = homeDir + "/Documents/simSUNDT/utdefdat"

        let writeArray: Array<string> = new Array<string>()
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

        //console.log("[DEBUG] Writing utdefdat array:\n" + writeArray)

        let writeSuccessful: boolean = await window.electronAPI.writeFile(saveLoc, writeArray)
        //console.log(writeSuccessful)
    }
}