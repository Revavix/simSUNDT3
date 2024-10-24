// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use commands::results;
use commands::results::interfaces::{Metadata, Top, Vector2, Vector3};
use std::sync::Mutex;
use tauri::ipc::Response;
use tauri::{Manager, State};
use window_shadows::set_shadow;

mod commands;

#[derive(Default)]
struct AppState {
    results: commands::results::Results,
}

#[tauri::command(async, rename_all = "snake_case")]
fn commands_results_parse_metadata(path: String) -> Result<Metadata, String> {
    return crate::commands::results::parse_metadata(path);
}

#[tauri::command(async, rename_all = "snake_case")]
fn commands_results_parse_top_view(
    state: State<'_, Mutex<AppState>>,
    path: String,
) -> Result<Top, String> {
    let mut state = state.lock().unwrap();
    return crate::commands::results::parse_top_view(&mut state.results, path);
}

#[tauri::command(async, rename_all = "snake_case")]
fn cmd_parse_bscan(state: State<'_, Mutex<AppState>>, row: u32) -> Response {
    let mut state = state.lock().unwrap();
    let result = crate::commands::results::parse_bscan(&mut state.results, row);
    return tauri::ipc::Response::new(serde_json::to_string(&result).unwrap());
}

#[tauri::command(async, rename_all = "snake_case")]
fn cmd_parse_dscan(state: State<'_, Mutex<AppState>>, col: u32) -> Response {
    let mut state = state.lock().unwrap();
    let result = crate::commands::results::parse_dscan(&mut state.results, col);
    return tauri::ipc::Response::new(serde_json::to_string(&result).unwrap());
}

#[tauri::command(async, rename_all = "snake_case")]
fn cmd_parse_ultrasound(
    state: State<'_, Mutex<AppState>>,
    column: u32,
    row: u32,
) -> Response {
    let mut state = state.lock().unwrap();
    let result = crate::commands::results::parse_ultrasound(&mut state.results, column, row);
    return tauri::ipc::Response::new(serde_json::to_string(&result).unwrap());
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_process::init())
        .manage(Mutex::new(AppState::default()))
        .invoke_handler(tauri::generate_handler![
            commands_results_parse_metadata,
            commands_results_parse_top_view,
            cmd_parse_bscan,
            cmd_parse_dscan,
            cmd_parse_ultrasound
        ])
        .setup(|app| {
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
