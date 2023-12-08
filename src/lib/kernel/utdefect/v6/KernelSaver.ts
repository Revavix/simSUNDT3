import { BaseDirectory, writeTextFile } from "@tauri-apps/api/fs"
import { Saver } from "../../../models/Kernel"

export class KernelSaver extends Saver {
    data: any = {}

    constructor()
    {
        super()
    }

    async Save(dest: string): Promise<void> {
        // Check if folder exists under saves
        let pharr = [0, 0]

        let writeArray = []
        writeArray.push("Indefa")
        writeArray.push(" 1" + "   " + "Mode")
        writeArray.push(" " + (10*this.data.LS + this.data.LP) + "   " + "UT Technique (LSTY)")
        writeArray.push(" " + this.data.XS + " , " + this.data.XE + " , " + this.data.XI + "   " + "X Start, X End, X Increment (XS, XE, XI)");
        writeArray.push(" " + this.data.YS + " , " + this.data.YE + " , " + this.data.YI + "   " + "Y Start, Y End, Y Increment (YS, YE, YI)");
        writeArray.push(" " + this.data.CP + " , " + this.data.CS + "   " + "Longitudinal Wavespeed & Transversal Wavespeed (CP, CS)")

        if (this.data.CP < 0) {
            writeArray.push(" " + this.data.DBA + "   " + "Dampening (DBA)");
        }

        writeArray.push(" " + this.data.NFR + "   " + "Spectrum (NFR)");

        if (this.data.NFR < 0 || this.data.NFR == 1) {
            writeArray.push(" " + this.data.FREQ + " , " + this.data.BANDW + "   " + "Frequency & Bandwidth (FREQ, BANDW)");
        } else {
            writeArray.push(" " + this.data.F1 + " , " + this.data.F2 + " , " + this.data.F3 + " , " + this.data.F4 + "   " + "Frequencies (F1, F2, F3, F4)");
            writeArray.push(" " + this.data.AF + " , " + this.data.BF + "   " + "Height of F2 and F3 (AF, BF)");
        }

        if (this.data.NFR != 1 && this.data.LS != 0) {
            writeArray.push(" " + this.data.LTTY + "   " + "Time Window Type (LTTY)");

            if (this.data.LTTY == 2) { 
                writeArray.push(" " + this.data.TS + " , " + this.data.TE + " , " + this.data.TI + "   " + 
                "Time Window: Start, End, and Increment (TS, TE, TI)"); 
            }

            if (this.data.LTTY == 3) { 
                writeArray.push(" " + this.data.XD + " , " + this.data.YD + " , " + this.data.ZD + "   " + "Time Window: X Depth, Y Depth, Depth of Diffraction (XD, YD, ZD)");
                writeArray.push(" " + this.data.TS + " , " + this.data.TI + "   " + "Time Window: Start and Increment (TS, TI)");
            }
        }
        
        if (this.data.IMODE[0] == 4 || this.data.IMODE[0] == 24){
            writeArray.push(" " + this.data.IMODE[0] + " , " + this.data.ISHA[0] + " , " + this.data.COUP[0] + "   " + "Focus, Shape and Coupling (IMODE, ISHA, COUP)");
        } else {
            writeArray.push(" " + this.data.IMODE[0] + " , " + this.data.INSTY[0] + " , " + this.data.COUP[0] + "   " + "Focus, Suppression and Coupling (IMODE, INSTY, COUP)");
        }

        if (this.data.IMODE[0] < 0) { pharr[0] = 2; this.data.IMODE[0] = -this.data.IMODE[0]; }

        if (this.data.IMODE[0] != 4 && this.data.IMODE[0] != 24) {
            writeArray.push(" " + this.data.PGA[0] + " , " + this.data.PSI[0] + "   " + "Probe Angle and Skew (PGA, PSI)");
            writeArray.push(" " + this.data.ISHA[0] + " , " + this.data.PA[0] + " , " + this.data.PB[0] + "   " + "Probe Type, Length in X, and Y Direction (ISHA, PA, PB)");

            if (this.data.ISHA[0] < 0) {
                writeArray.push(" " + this.data.NAWX[0] + " , " + this.data.NAWY[0] + "   " + "Probe Separation (NAWX, NAWY)");

                if (pharr[0] != 0) {
                    writeArray.push(" " + this.data.GAPX[0] + " , " + this.data.GAPY[0] + " , " + this.data.RHOW[0] + "   " + "Gap of X, Y and Density (GAPX, GAPY, RHOW)");

                    if (this.data.RHOW[0] > 0) {
                        writeArray.push(" " + this.data.CPW[0] + " , " + this.data.CSW[0] + "   " + "Wedge Longitudinal and Transversal (CPW, CSW)");
                        writeArray.push(" " + this.data.PCW[0] + " , " + this.data.GW[0] + "   " + "Wedge Width and Gradient (PCW, GW)");
                    }
                }
            }

            if (this.data.IMODE[0] > 10) {
                writeArray.push(" " + this.data.FOC[0] + "   " + "Focus (FOC)");
            }

            if (pharr[0] != 0 && this.data.LP == 1) {
                this.data.XSEP = 0;
                this.data.YSEP = 0;
                this.data.NAWX[1] = this.data.NAWX[0];
                this.data.NAWY[1] = this.data.NAWY[0];
                this.data.GAPX[1] = this.data.GAPX[0];
                this.data.GAPY[1] = this.data.GAPY[0];
                this.data.RHOW[1] = this.data.RHOW[0];

                if (this.data.RHOW[0] > 0) {
                    this.data.CPW[1] = this.data.CPW[0];
                    this.data.CSW[1] = this.data.CSW[0];
                    this.data.PCW[1] = this.data.PCW[0];
                    this.data.GW[1] = this.data.GW[0];
                }

                if (this.data.IMODE[0] > 10) {
                    this.data.FOC[1] = this.data.FOC[0];
                }
            }
        } else {
            // ISHA[0] = INSTY[0]; In immersion mode, it seems that INSTY is overwritten to be ISHA?

            if (this.data.ISHA[0] < 0) {
                writeArray.push(" " + this.data.NAWX[0] + " , " + this.data.NAWY[0] + "   " + "Probe Separation (NAWX, NAWY)");
            }

            writeArray.push(" " + this.data.PD[0] + " , " + this.data.PA[0] + " , " + this.data.PB[0] + "   " + "Height, Shape X, Shape Y (PD, PA, PB)");
            writeArray.push(" " + this.data.RF + " , " + this.data.CF + "   " + "Immersion Density and Wavespeed (RF, CF)");
            writeArray.push(" " + this.data.FPHI[0] + " , " + this.data.FTHE[0] + " , " + this.data.FPSI[0] + "   " + "Immersion Euler Angles, Phi, Theta and Psi (FPHI, FTHE, FPSI)");

            if (this.data.CF < 0) {
                writeArray.push(" " + this.data.DBF);
            }

            if (this.data.IMODE[0] > 10) {
                writeArray.push(" " + this.data.FOC[0] + "   " + "Focus (FOC)");
            }
        }

        // LP in fortran. TODO: Investigate that this.data.is correct
        if (this.data.LS >= 2) {
            writeArray.push(" " + this.data.IMODE[1] + " , " + this.data.INSTY[1] + " , " + this.data.COUP[1] + "   " + "Focus, Suppression and Coupling for Receiver (IMODE, INSTY, COUP)");

            pharr[1] = 0;

            if (this.data.IMODE[1] < 0) {
                this.data.IMODE[1] = -this.data.IMODE[1];
                pharr[1] = 1;
            }

            if ((this.data.IMODE[1] - (10 * (this.data.IMODE[1] / 10))) != 4) {
                writeArray.push(" " + this.data.PGA[1] + " , " + this.data.PSI[1] + " , ");
                writeArray.push(" " + this.data.ISHA[1] + " , " + this.data.PA[1] + " , " + " , " + this.data.PB[1]);

                if (this.data.ISHA[1] < 0) {
                    writeArray.push(" " + this.data.NAWX[1] + " , " + this.data.NAWY[1]);

                    if (pharr[1] != 0) {
                        writeArray.push(" " + this.data.GAPX[1] + " , " + this.data.GAPY[1] + " , " + this.data.RHOW[1]);

                        if (this.data.RHOW[1] > 0) {
                            writeArray.push(" " + this.data.CPW[1] + " , " + this.data.CSW[1]);
                            writeArray.push(" " + this.data.PCW[1] + " , " + this.data.GW[1]);
                        }
                    }
                }

                if (this.data.IMODE[1] > 10) {
                    writeArray.push(" " + this.data.FOC[1]);
                }
            } else {
                this.data.ISHA[1] = this.data.INSTY[1];

                if (this.data.ISHA[1] < 0) {
                    writeArray.push(" " + this.data.NAWX[1] + " , " + this.data.NAWY[1]);
                }

                writeArray.push(" " + this.data.PD[1] + " , " + this.data.PA[1] + " , " + this.data.PB[1]);
                writeArray.push(" " + this.data.FPHI[1] + " , " + this.data.FTHE[1] + " , " + this.data.FPSI[1]);

                if (this.data.IMODE[1] == 24) {
                    writeArray.push(" " + this.data.FOC[1]);
                }
            }

            writeArray.push(" " + this.data.XSEP + " , " + this.data.YSEP);

            if (pharr[0] != 0 && this.data.LS == 1) {
                this.data.LS = 2;
            }
        }
        else {
            this.data.XSEP = 0;
            this.data.YSEP = 0;
        }

        writeArray.push(" " + this.data.LDTY + " , " + this.data.DZ + "   " + "Defect Type and Centre Depth (LDTY, DZ)");

        if (this.data.LDTY == 1 || this.data.LDTY == 11) {
            writeArray.push(" " + this.data.DA + "   " + "Defect Diameter (DA)");
        }

        if (this.data.LDTY == 2 || this.data.LDTY == 12) {
            writeArray.push(" " + this.data.DA + " , " + this.data.DRR + " , " +  this.data.CPI + " , " + this.data.CSI + "   " + 
            "Defect Diameter, Relative Density, Inclusion Longitudinal and Inclusion Transversal Wavespeed (DA, DRR, CPI, CSI)");
        }

        if (this.data.CPI < 0) {
            writeArray.push(" " + this.data.DBI + "   " + "Inclusion Dampening (DBI)");
        }

        if (this.data.LDTY == 3 || this.data.LDTY == 13) {
            writeArray.push(" " + this.data.DA + " , " + this.data.ETHA + " , " + this.data.PHI + "   " + "Defect Diameter, Euler Angles Phi and Theta (DA, ETHA, PHI)");
            writeArray.push(" " + this.data.LDC + "   " + "Circular variant (LDC)");

            if (this.data.LDC == 3)
            {
                writeArray.push(" " + this.data.DC + " , " + this.data.DAC + "   " + "Stress Quotient, Contact Diameter (DC, DAC)");
            }
        }

        if (this.data.LDTY == 4 || this.data.LDTY == 14) {
            writeArray.push(" " + this.data.DA + " , " + this.data.DB + " , " + this.data.ETHA + " , " + this.data.PHI + "   " + "Defect Diameter, Defect Height, Euler Angles Phi and Theta (DA, DB, ETHA, PHI)");
        }

        if (this.data.LDTY == 5 || this.data.LDTY == 25) {
            writeArray.push(" " + this.data.A + " , " + this.data.B + " , " + this.data.PS + "   " + "Defect Length, Defect Parallel Length, Tilt of Crack (A, B, PS)");
        }

        if (this.data.LDTY == 7 || this.data.LDTY == 27) {
            writeArray.push(" " + this.data.DA + " , " + this.data.PS + "   " + "Defect Diameter, Tilt of Crack (DA, PS)");
        }

        if (this.data.LDTY == 8) {
            writeArray.push(" " + this.data.DA + "   " + "Defect Diameter (DA)");
        }

        if (this.data.LDTY == 15 || this.data.LDTY == 35) {
            writeArray.push(" " + this.data.A + " , " + this.data.B + " , " + this.data.PS + " , " + this.data.ET + "   " + 
            "Defect Length, Defect Parallel Length, Tilt of Crack, Tilt from Horizontal (A, B, PS, ET)");
        }

        if (this.data.LDTY == 17 || this.data.LDTY == 19 || this.data.LDTY == 37) {
            writeArray.push(" " + this.data.DA + " , " + this.data.PS + " , " + this.data.ET + "   " + "Defect Diameter, Tilt of Crack, Tilt from Horizontal (DA, PS, ET)");
        }

        if (this.data.DA < 0) { writeArray.push(" " + this.data.DEL); } // Can't find the point of this

        if ((this.data.LDTY > 10 && this.data.LDTY < 18) || this.data.LDTY == 37) {
            writeArray.push(" " + this.data.BZ + "   " + "Backwall Depth (BZ)");
        }

        if (this.data.LDTY >= 27) {
            writeArray.push(" " + this.data.EPSI + " , " + this.data.LZ + "   " + "RMS Height, Roughness Corr Length (PSI, LZ)");
        }

        writeArray.push(" " + this.data.LCTY + "   " + "Calibration Type (LCTY)");

        if (this.data.LCTY == 1 || this.data.LCTY == 2) {
            writeArray.push(" " + this.data.CA + " , " + this.data.CZ + "   " + "Calibration Diameter and Depth (CA, CZ)");
        }

        if (this.data.LCTY == 3) {
            writeArray.push(" " + this.data.CZ + "   " + "Calibration Depth (CZ)");
        }

        writeArray.push(" " + this.data.IA + "   " + "Accuracy Index (IACC)");
        writeArray.push(" " + this.data.XDEF + " , " + this.data.YDEF + "   " + "X/Y Position of the Defect (XDEF, YDEF)");

        writeArray.push(" " + this.data.WELD);

        if (this.data.WELD == "Welding_Parameters") {
            writeArray.push(" " + this.data.B1 + " , " + this.data.B2 + " , " + this.data.B3);
            writeArray.push(" " + this.data.T1 + " , " + this.data.T2);
            writeArray.push(" " + this.data.CALB2A + " , " + this.data.CALB2D + " , " + this.data.CALB2Z);
            writeArray.push(" " + this.data.LQ + " , " + this.data.T0 + " , " + this.data.NN);
            writeArray.push(" " + this.data.CC + " , " + this.data.D0 + " , " + this.data.RA + " , " + this.data.TMP);
            writeArray.push(" " + this.data.KK + " , " + this.data.Q + " , " + this.data.AA + " , " + this.data.K0);
        }
            
        if (this.data.WELD == "Hard_Measurement") {
            writeArray.push(" " + this.data.HMT0 + " , " + this.data.HMT1);
            writeArray.push(" " + this.data.HMX1 + " , " + this.data.HMX2 + " , " + this.data.HMY1 + " , " + this.data.HMY2);
            writeArray.push(" " + this.data.CALB2A + " , " + this.data.CALB2D + " , " + this.data.CALB2Z);
            writeArray.push(" " + this.data.HMD0 + " , " + this.data.HMD1);
        }

        if (pharr[0] != 0)
        {
            if (this.data.DET && !this.data.DER) {
                writeArray.push("Dead_Elements");
            } else if (this.data.DET && this.data.DER) {
                writeArray.push("Dead_Elements/T");
            }

            if (this.data.DET) {
                writeArray.push(" " + this.data.NDE[0]);

                let s = " ";

                for(let i = 0; i < (Math.ceil(this.data.DEIXYT.length/10))*10; i++) {
                    if (i % 10 == 0 && i != 0) {
                        writeArray.push(s);
                        s = " ";
                    } 
                    else {
                        try {
                            if (i % 10 == 0) {
                                s += " " + this.data.DEIXYT[i]; // , 5 , 5
                            } 
                            else {
                                s += " , " + this.data.DEIXYT[i];
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
            if (this.data.DER) {
                writeArray.push("Dead_Elements/R");

                writeArray.push(" " + this.data.NDE[1]);

                let s = " ";

                for (let i = 0; i < (Math.ceil(this.data.DEIXYR.length/10))*10; i++)
                {
                    if (i % 10 == 0 && i != 0) {
                        writeArray.push(s);
                        s = " ";
                    } else {
                        try {
                            if (i % 10 == 0)
                            {
                                s += " " + this.data.DEIXYR[i]; // , 5 , 5
                            }
                            else
                            {
                                s += " , " + this.data.DEIXYR[i];
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

        let output: string = ""

        writeArray.forEach((v) => {
            output += v + "\n"
        })

        await writeTextFile(dest, output, { dir: BaseDirectory.Document })
        
        return Promise.resolve()
    }
}