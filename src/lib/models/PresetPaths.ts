import { documentDir } from "@tauri-apps/api/path";

export const DOCUMENT_DIR = await documentDir()
export const SIMSUNDT_FOLDER = await documentDir() + "\\SimSUNDT"
export const SIMSUNDT_PROJECT_FOLDER = await documentDir() + "\\SimSUNDT\\Projects"
export const SIMSUNDT_SIMULATION_FOLDER = await documentDir() + "\\SimSUNDT\\Simulations"
