#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::panic::{self, PanicHookInfo};
use std::time::SystemTime;
use commands::results::interfaces::{Metadata, Top};
use tauri_plugin_dialog::{DialogExt, MessageDialogButtons};
use std::sync::Mutex;
use tauri::ipc::Response;
use tauri::{Manager, State};

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

fn write_crash_log(info: &PanicHookInfo<'_>) {
    let mut log = format!("{:?}\n", info.location().unwrap());
    log += &format!("{:?}", info.payload().downcast_ref::<&str>());
    let document_dir = dirs::document_dir().expect("Could not find document directory");
    match std::fs::create_dir_all(format!("{}\\simSUNDT\\logs", document_dir.display())) {
        Ok(_) => {}
        Err(_) => {}
    }
    std::fs::write(format!("{}\\simSUNDT\\logs\\crash_{}.log", document_dir.display(), SystemTime::now().duration_since(SystemTime::UNIX_EPOCH).unwrap().as_secs()), log).unwrap();
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
            let app_handle = app.handle().clone();
            panic::set_hook(Box::new(move |info: &PanicHookInfo<'_> | {
                if let Some(window) = app_handle.get_webview_window("main") {
                    let _ = window.hide();
                }
                write_crash_log(info);
                let app_handle = app_handle.clone();
                app_handle.dialog()
                .message("An unexpected error occured, please visit https://github.com/Revavix/simSUNDT3/issues to report an issue. Crash log has been saved to your documents/simSUNDT folder.") 
                .title("Critical error")
                .buttons(MessageDialogButtons::OkCustom("Ok".to_owned()))
                .blocking_show();
                app_handle.exit(1)
            }));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
