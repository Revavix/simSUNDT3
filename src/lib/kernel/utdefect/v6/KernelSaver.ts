import { BaseDirectory, writeTextFile } from "@tauri-apps/api/fs"
import { Saver } from "../../../models/Kernel"
import type TreeNode from "../../../models/tree/TreeNode"
import KernelSaverData from "./KernelSaverData"


export class KernelSaver extends Saver {
    rootNode: TreeNode | null = null

    constructor()
    {
        super()
        this.rootNode = {} as TreeNode
    }

    async Save(dest: string): Promise<void> {
        if (this.rootNode === null) return Promise.reject("No valid root node found")
        
        // Check if folder exists under saves
        let pharr = [0, 0]
        const data = new KernelSaverData(this.rootNode)

        let writeArray = []
        writeArray.push("Indefa")
        writeArray.push(" 1" + "   " + "Mode")
        writeArray.push(" " + (10 * data.LS + data.LP) + "   " + "UT Technique (LSTY)")
        writeArray.push(" " + data.XS + " , " + data.XE + " , " + data.XI + "   " + "X Start, X End, X Increment (XS, XE, XI)");
        writeArray.push(" " + data.YS + " , " + data.YE + " , " + data.YI + "   " + "Y Start, Y End, Y Increment (YS, YE, YI)");
        writeArray.push(" " + data.CP + " , " + data.CS + "   " + "Longitudinal Wavespeed & Transversal Wavespeed (CP, CS)")

        if (data.CP < 0) {
            writeArray.push(" " + data.DBA + "   " + "Dampening (DBA)");
        }

        writeArray.push(" " + data.NFR + "   " + "Spectrum (NFR)");

        if (data.NFR < 0 || data.NFR == 1) {
            writeArray.push(" " + data.FREQ + " , " + data.BANDW + "   " + "Frequency & Bandwidth (FREQ, BANDW)");
        } else {
            writeArray.push(" " + data.F1 + " , " + data.F2 + " , " + data.F3 + " , " + data.F4 + "   " + "Frequencies (F1, F2, F3, F4)");
            writeArray.push(" " + data.AF + " , " + data.BF + "   " + "Height of F2 and F3 (AF, BF)");
        }

        if (data.NFR != 1 && data.LS != 0) {
            writeArray.push(" " + data.LTTY + "   " + "Time Window Type (LTTY)");

            if (data.LTTY == 2) { 
                writeArray.push(" " + data.TS + " , " + data.TE + " , " + data.TI + "   " + 
                "Time Window: Start, End, and Increment (TS, TE, TI)"); 
            }

            if (data.LTTY == 3) { 
                writeArray.push(" " + data.XD + " , " + data.YD + " , " + data.ZD + "   " + "Time Window: X Depth, Y Depth, Depth of Diffraction (XD, YD, ZD)");
                writeArray.push(" " + data.TS + " , " + data.TI + "   " + "Time Window: Start and Increment (TS, TI)");
            }
        }
        
        if (data.IMODE[0] == 4 || data.IMODE[0] == 24){
            writeArray.push(" " + data.IMODE[0] + " , " + data.ISHA[0] + " , " + data.COUP[0] + "   " + "Focus, Shape and Coupling (IMODE, ISHA, COUP)");
        } else {
            writeArray.push(" " + data.IMODE[0] + " , " + data.INSTY[0] + " , " + data.COUP[0] + "   " + "Focus, Suppression and Coupling (IMODE, INSTY, COUP)");
        }

        if (data.IMODE[0] < 0) { pharr[0] = 2; data.IMODE[0] = -data.IMODE[0]; }

        if (data.IMODE[0] != 4 && data.IMODE[0] != 24) {
            writeArray.push(" " + data.PGA[0] + " , " + data.PSI[0] + "   " + "Probe Angle and Skew (PGA, PSI)");
            writeArray.push(" " + data.ISHA[0] + " , " + data.PA[0] + " , " + data.PB[0] + "   " + "Probe Type, Length in X, and Y Direction (ISHA, PA, PB)");

            if (data.ISHA[0] < 0) {
                writeArray.push(" " + data.NAWX[0] + " , " + data.NAWY[0] + "   " + "Probe Separation (NAWX, NAWY)");

                if (pharr[0] != 0) {
                    writeArray.push(" " + data.GAPX[0] + " , " + data.GAPY[0] + " , " + data.RHOW[0] + "   " + "Gap of X, Y and Density (GAPX, GAPY, RHOW)");

                    if (data.RHOW[0] > 0) {
                        writeArray.push(" " + data.CPW[0] + " , " + data.CSW[0] + "   " + "Wedge Longitudinal and Transversal (CPW, CSW)");
                        writeArray.push(" " + data.PCW[0] + " , " + data.GW[0] + "   " + "Wedge Width and Gradient (PCW, GW)");
                    }
                }
            }

            if (data.IMODE[0] > 10) {
                writeArray.push(" " + data.FOC[0] + "   " + "Focus (FOC)");
            }

            if (pharr[0] != 0 && data.LP == 1) {
                data.XSEP = 0;
                data.YSEP = 0;
                data.NAWX[1] = data.NAWX[0];
                data.NAWY[1] = data.NAWY[0];
                data.GAPX[1] = data.GAPX[0];
                data.GAPY[1] = data.GAPY[0];
                data.RHOW[1] = data.RHOW[0];

                if (data.RHOW[0] > 0) {
                    data.CPW[1] = data.CPW[0];
                    data.CSW[1] = data.CSW[0];
                    data.PCW[1] = data.PCW[0];
                    data.GW[1] = data.GW[0];
                }

                if (data.IMODE[0] > 10) {
                    data.FOC[1] = data.FOC[0];
                }
            }
        } else {
            // ISHA[0] = INSTY[0]; In immersion mode, it seems that INSTY is overwritten to be ISHA?

            if (data.ISHA[0] < 0) {
                writeArray.push(" " + data.NAWX[0] + " , " + data.NAWY[0] + "   " + "Probe Separation (NAWX, NAWY)");
            }

            writeArray.push(" " + data.PD[0] + " , " + data.PA[0] + " , " + data.PB[0] + "   " + "Height, Shape X, Shape Y (PD, PA, PB)");
            writeArray.push(" " + data.RF + " , " + data.CF + "   " + "Immersion Density and Wavespeed (RF, CF)");
            writeArray.push(" " + data.FPHI[0] + " , " + data.FTHE[0] + " , " + data.FPSI[0] + "   " + "Immersion Euler Angles, Phi, Theta and Psi (FPHI, FTHE, FPSI)");

            if (data.CF < 0) {
                writeArray.push(" " + data.DBF);
            }

            if (data.IMODE[0] > 10) {
                writeArray.push(" " + data.FOC[0] + "   " + "Focus (FOC)");
            }
        }

        // LP in fortran. TODO: Investigate that this.data.is correct
        if (data.LS >= 2) {
            writeArray.push(" " + data.IMODE[1] + " , " + data.INSTY[1] + " , " + data.COUP[1] + "   " + "Focus, Suppression and Coupling for Receiver (IMODE, INSTY, COUP)");

            pharr[1] = 0;

            if (data.IMODE[1] < 0) {
                data.IMODE[1] = -data.IMODE[1];
                pharr[1] = 1;
            }

            if ((data.IMODE[1] - (10 * (data.IMODE[1] / 10))) != 4) {
                writeArray.push(" " + data.PGA[1] + " , " + data.PSI[1] + " , ");
                writeArray.push(" " + data.ISHA[1] + " , " + data.PA[1] + " , " + " , " + data.PB[1]);

                if (data.ISHA[1] < 0) {
                    writeArray.push(" " + data.NAWX[1] + " , " + data.NAWY[1]);

                    if (pharr[1] != 0) {
                        writeArray.push(" " + data.GAPX[1] + " , " + data.GAPY[1] + " , " + data.RHOW[1]);

                        if (data.RHOW[1] > 0) {
                            writeArray.push(" " + data.CPW[1] + " , " + data.CSW[1]);
                            writeArray.push(" " + data.PCW[1] + " , " + data.GW[1]);
                        }
                    }
                }

                if (data.IMODE[1] > 10) {
                    writeArray.push(" " + data.FOC[1]);
                }
            } else {
                data.ISHA[1] = data.INSTY[1];

                if (data.ISHA[1] < 0) {
                    writeArray.push(" " + data.NAWX[1] + " , " + data.NAWY[1]);
                }

                writeArray.push(" " + data.PD[1] + " , " + data.PA[1] + " , " + data.PB[1]);
                writeArray.push(" " + data.FPHI[1] + " , " + data.FTHE[1] + " , " + data.FPSI[1]);

                if (data.IMODE[1] == 24) {
                    writeArray.push(" " + data.FOC[1]);
                }
            }

            writeArray.push(" " + data.XSEP + " , " + data.YSEP);

            if (pharr[0] != 0 && data.LS == 1) {
                data.LS = 2;
            }
        }
        else {
            data.XSEP = 0;
            data.YSEP = 0;
        }

        writeArray.push(" " + data.LDTY + " , " + data.DZ + "   " + "Defect Type and Centre Depth (LDTY, DZ)");

        if (data.LDTY == 1 || data.LDTY == 11) {
            writeArray.push(" " + data.DA + "   " + "Defect Diameter (DA)");
        }

        if (data.LDTY == 2 || data.LDTY == 12) {
            writeArray.push(" " + data.DA + " , " + data.DRR + " , " +  data.CPI + " , " + data.CSI + "   " + 
            "Defect Diameter, Relative Density, Inclusion Longitudinal and Inclusion Transversal Wavespeed (DA, DRR, CPI, CSI)");
        }

        if (data.CPI < 0) {
            writeArray.push(" " + data.DBI + "   " + "Inclusion Dampening (DBI)");
        }

        if (data.LDTY == 3 || data.LDTY == 13) {
            writeArray.push(" " + data.DA + " , " + data.ETHA + " , " + data.PHI + "   " + "Defect Diameter, Euler Angles Phi and Theta (DA, ETHA, PHI)");
            writeArray.push(" " + data.LDC + "   " + "Circular variant (LDC)");

            if (data.LDC == 3)
            {
                writeArray.push(" " + data.DC + " , " + data.DAC + "   " + "Stress Quotient, Contact Diameter (DC, DAC)");
            }
        }

        if (data.LDTY == 4 || data.LDTY == 14) {
            writeArray.push(" " + data.DA + " , " + data.DB + " , " + data.ETHA + " , " + data.PHI + "   " + "Defect Diameter, Defect Height, Euler Angles Phi and Theta (DA, DB, ETHA, PHI)");
        }

        if (data.LDTY == 5 || data.LDTY == 25) {
            writeArray.push(" " + data.A + " , " + data.B + " , " + data.PS + "   " + "Defect Length, Defect Parallel Length, Tilt of Crack (A, B, PS)");
        }

        if (data.LDTY == 7 || data.LDTY == 27) {
            writeArray.push(" " + data.DA + " , " + data.PS + "   " + "Defect Diameter, Tilt of Crack (DA, PS)");
        }

        if (data.LDTY == 8) {
            writeArray.push(" " + data.DA + "   " + "Defect Diameter (DA)");
        }

        if (data.LDTY == 15 || data.LDTY == 35) {
            writeArray.push(" " + data.A + " , " + data.B + " , " + data.PS + " , " + data.ET + "   " + 
            "Defect Length, Defect Parallel Length, Tilt of Crack, Tilt from Horizontal (A, B, PS, ET)");
        }

        if (data.LDTY == 17 || data.LDTY == 19 || data.LDTY == 37) {
            writeArray.push(" " + data.DA + " , " + data.PS + " , " + data.ET + "   " + "Defect Diameter, Tilt of Crack, Tilt from Horizontal (DA, PS, ET)");
        }

        if (data.DA < 0) { writeArray.push(" " + data.DEL); } // Can't find the point of this

        if ((data.LDTY > 10 && data.LDTY < 18) || data.LDTY == 37) {
            writeArray.push(" " + data.BZ + "   " + "Backwall Depth (BZ)");
        }

        if (data.LDTY >= 27) {
            writeArray.push(" " + data.EPSI + " , " + data.LZ + "   " + "RMS Height, Roughness Corr Length (PSI, LZ)");
        }

        writeArray.push(" " + data.LCTY + "   " + "Calibration Type (LCTY)");

        if (data.LCTY == 1 || data.LCTY == 2) {
            writeArray.push(" " + data.CA + " , " + data.CZ + "   " + "Calibration Diameter and Depth (CA, CZ)");
        }

        if (data.LCTY == 3) {
            writeArray.push(" " + data.CZ + "   " + "Calibration Depth (CZ)");
        }

        writeArray.push(" " + data.IA + "   " + "Accuracy Index (IACC)");
        writeArray.push(" " + data.XDEF + " , " + data.YDEF + "   " + "X/Y Position of the Defect (XDEF, YDEF)");

        writeArray.push(" " + data.WELD);

        if (data.WELD == "Welding_Parameters") {
            writeArray.push(" " + data.B1 + " , " + data.B2 + " , " + data.B3);
            writeArray.push(" " + data.T1 + " , " + data.T2);
            writeArray.push(" " + data.CALB2A + " , " + data.CALB2D + " , " + data.CALB2Z);
            writeArray.push(" " + data.LQ + " , " + data.T0 + " , " + data.NN);
            writeArray.push(" " + data.CC + " , " + data.D0 + " , " + data.RA + " , " + data.TMP);
            writeArray.push(" " + data.KK + " , " + data.Q + " , " + data.AA + " , " + data.K0);
        }
            
        if (data.WELD == "Hard_Measurement") {
            writeArray.push(" " + data.HMT0 + " , " + data.HMT1);
            writeArray.push(" " + data.HMX1 + " , " + data.HMX2 + " , " + data.HMY1 + " , " + data.HMY2);
            writeArray.push(" " + data.CALB2A + " , " + data.CALB2D + " , " + data.CALB2Z);
            writeArray.push(" " + data.HMD0 + " , " + data.HMD1);
        }

        if (pharr[0] != 0)
        {
            if (data.DET && !data.DER) {
                writeArray.push("Dead_Elements");
            } else if (data.DET && data.DER) {
                writeArray.push("Dead_Elements/T");
            }

            if (data.DET) {
                writeArray.push(" " + data.NDE[0]);

                let s = " ";

                for(let i = 0; i < (Math.ceil(data.DEIXYT.length/10))*10; i++) {
                    if (i % 10 == 0 && i != 0) {
                        writeArray.push(s);
                        s = " ";
                    } 
                    else {
                        try {
                            if (i % 10 == 0) {
                                s += " " + data.DEIXYT[i]; // , 5 , 5
                            } 
                            else {
                                s += " , " + data.DEIXYT[i];
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
            if (data.DER) {
                writeArray.push("Dead_Elements/R");

                writeArray.push(" " + data.NDE[1]);

                let s = " ";

                for (let i = 0; i < (Math.ceil(data.DEIXYR.length/10))*10; i++)
                {
                    if (i % 10 == 0 && i != 0) {
                        writeArray.push(s);
                        s = " ";
                    } else {
                        try {
                            if (i % 10 == 0)
                            {
                                s += " " + data.DEIXYR[i]; // , 5 , 5
                            }
                            else
                            {
                                s += " , " + data.DEIXYR[i];
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