// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use commands::results::{Metadata, Top, Vector2, Vector3};
use tauri::Manager;
use window_shadows::set_shadow;

mod commands;

#[tauri::command(async, rename_all = "snake_case")]
fn commands_results_parse_metadata(path: String) -> Result<Metadata, String> {
  return crate::commands::results::parse_metadata(path);
}

#[tauri::command(async, rename_all = "snake_case")]
fn commands_results_parse_top_view(path: String) -> Result<Top, String> {
  return crate::commands::results::parse_top_view(path);
}

#[tauri::command(async, rename_all = "snake_case")]
fn commands_results_parse_point_view(path: String, index: usize, samples: usize) -> Result<Vec<Vector2>, String>  {
  return crate::commands::results::parse_point_view(path, index, samples);
}

#[tauri::command(async, rename_all = "snake_case")]
fn commands_results_parse_side_view(path: String, indicies: Vec<usize>, samples: usize) -> Result<Vec<Vector3>, String>  {
  return crate::commands::results::parse_side_view(path, indicies, samples);
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      commands_results_parse_metadata, 
      commands_results_parse_top_view, 
      commands_results_parse_point_view,
      commands_results_parse_side_view
    ])
    .setup(|app| {
        let window = app.get_window("main").unwrap();
        set_shadow(&window, true).expect("Unsupported platform!");
        Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
