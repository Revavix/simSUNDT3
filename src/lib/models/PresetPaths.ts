import { homeDir } from "@tauri-apps/api/path";

export const SIMSUNDT_FOLDER = await homeDir() + "Documents/SimSUNDT"
export const SIMSUNDT_PROJECT_FOLDER = await homeDir() + "Documents/SimSUNDT/Projects"
