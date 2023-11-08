// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::Manager;
use window_shadows::set_shadow;

mod commands;

fn main() {
  tauri::Builder::default()
    .setup(|app| {
        let window = app.get_window("main").unwrap();
        set_shadow(&window, true).expect("Unsupported platform!");
        Ok(())
    })
    .invoke_handler(tauri::generate_handler![commands::results::parse_metadata])
    .invoke_handler(tauri::generate_handler![commands::results::parse_top_view])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}