use std::{fs::{ self}};

use serde::Serialize;

#[derive(Serialize)]
struct Axis {
    start: f64,
    end: f64,
    increment: f64
}

#[derive(Serialize)]
struct Coordinates {
    x: Axis,
    y: Axis
}

#[derive(Serialize)]
struct Wavespeeds {
    compressional: f64,
    shear: f64
}

#[derive(Serialize)]
pub struct Metadata {
    wavespeeds: Wavespeeds,
    coordinates: Coordinates
}

struct Top {

}

struct Side {

}

struct End {

}

#[tauri::command(rename_all = "snake_case")]
pub fn parse_metadata(path: String) -> Metadata {
    let metadata: Metadata = Metadata {
        wavespeeds: Wavespeeds { 
            compressional: 0.0, 
            shear: 0.0 
        },
        coordinates: Coordinates {
            x: Axis {
                start: 0.0,
                end: 0.0,
                increment: 0.0
            },
            y: Axis {
                start: 0.0,
                end: 0.0,
                increment: 0.0
            },
        }
    };

    let raw: Result<String, std::io::Error> = fs::read_to_string(path);

    return metadata
}

#[tauri::command(rename_all = "snake_case")]
pub fn parse_top_view(path: String)  {

}

#[tauri::command(rename_all = "snake_case")]
pub fn parse_point_view(x: i64, y: i64) {
    
}

#[tauri::command(rename_all = "snake_case")]
pub fn parse_side_view(y: i64) {

}

#[tauri::command(rename_all = "snake_case")]
pub fn parse_end_view(x: i64) {

}