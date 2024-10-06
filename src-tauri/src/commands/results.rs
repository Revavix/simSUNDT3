use regex::Regex;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, fs, vec};

pub mod identifiers;
pub mod interfaces;

#[derive(Default, Deserialize, Serialize)]
pub struct Results {
    ultrasound: HashMap<usize, Vec<interfaces::Vector2>>,
    bscan: HashMap<usize, Vec<interfaces::Vector3>>,
    cscan: interfaces::Top,
    dscan: HashMap<usize, Vec<interfaces::Vector3>>,
}

impl Results {
    pub fn new() -> Results {
        Results {
            ultrasound: HashMap::new(),
            bscan: HashMap::new(),
            cscan: interfaces::Top::new(),
            dscan: HashMap::new(),
        }
    }

    pub fn clear(&mut self) {
        self.bscan = HashMap::new();
        self.cscan = interfaces::Top::new();
        self.dscan = HashMap::new();
    }
}

pub fn parse_metadata(path: String) -> Result<interfaces::Metadata, String> {
    let mut error: String = "None".to_string();
    let mut metadata: interfaces::Metadata = interfaces::Metadata::new();

    let mut identifiers: Vec<&interfaces::Identifier> = vec![];
    metadata.set_shared_identifiers(&mut identifiers).unwrap();
    metadata
        .set_probe_identifiers(&path, &mut identifiers)
        .unwrap();
    metadata
        .set_defect_identifiers(&path, &mut identifiers)
        .unwrap();

    match fs::read_to_string(path) {
        Ok(raw) => {
            for identifier in identifiers {
                let re_id = Regex::new(&identifier.id).unwrap();

                match re_id.find(&raw) {
                    Some(id_match) => {
                        let l_idx = id_match.range().start;
                        let r_idx = id_match.range().end;
                        let re = Regex::new(&identifier.regex).unwrap();
                        let matches: Vec<_> = re
                            .find_iter(&raw[l_idx..r_idx + identifier.max_offset])
                            .map(|m| m.as_str())
                            .collect();
                        let mut vec: Vec<&str> = vec!["0.0"; identifier.fields as usize];

                        if matches.len() != identifier.fields {
                            if identifier.optional {
                                continue;
                            } else {
                                error = format!(
                                    "Failed to match {} fields at '{}' with pattern '{}'",
                                    identifier.fields, &identifier.id, &identifier.regex
                                );
                                break;
                            }
                        } else {
                            for i in 0..identifier.fields {
                                vec[i] = matches[i as usize].trim();
                            }

                            (identifier.operation)(&mut metadata, &mut vec);
                        }
                    }
                    None => {
                        if !identifier.optional {
                            error = format!(
                                "Failed to find identifier '{}' in the provided path",
                                &identifier.id
                            );
                            break;
                        }
                    }
                }
            }
        }
        Err(_e) => {
            error = format!("Failed to find file, or file is invalid");
        }
    }

    if error == "None" {
        Ok(metadata)
    } else {
        Err(error)
    }
}

pub fn parse_top_view(result_data: &mut Results, path: String) -> Result<interfaces::Top, String> {
    let mut error = "".to_string();
    let mut data: interfaces::Top = interfaces::Top {
        columns: 0,
        rows: 0,
        samples: 0,
        amplitude: 0.0,
        content: Vec::new(),
    };

    // Clear A, B, C and D scan data
    result_data.clear();

    // Read C scan
    match std::fs::read(path.clone() + "\\utIndefa-C.dat") {
        Ok(bytes) => {
            unsafe {
                // Construct C scan and parse to Top struct
                let data_offset: usize = 10;
                let ret = std::slice::from_raw_parts(bytes.as_ptr() as *const f32, bytes.len() * 4);

                data.columns = ret[0] as usize;
                data.rows = ret[1] as usize;
                data.samples = ret[2] as usize;
                data.amplitude = ret[7] as f32;

                for y in 0..(ret[1] as usize) {
                    for x in 0..(ret[0] as usize) {
                        let idx = x + (y * (ret[0] as usize));
                        data.content.push(interfaces::Vector3 {
                            x: x as f64,
                            y: y as f64,
                            z: ret[data_offset + idx] as f64,
                        });
                    }
                }

                result_data.cscan = data.clone();
            };
        }
        Err(_e) => {
            error = "Failed to find file, or file is invalid".to_string();
        }
    }

    // Read or construct A, B and D scan data, A is organized as: columns + (rows * columns)
    match std::fs::read(path.clone() + "\\utIndefa-A.dat") {
        Ok(bytes) => {
            unsafe {
                let ret = std::slice::from_raw_parts(bytes.as_ptr() as *const f32, bytes.len() / 4);
                let mut ultrasound_vec: Vec<interfaces::Vector2> = Vec::new();

                for i in 0..(data.samples * data.columns * data.rows) {
                    ultrasound_vec.push(interfaces::Vector2 {
                        x: (i % data.samples as usize) as f64,
                        y: ret[i] as f64,
                    });

                    if (i + 1) % data.samples as usize == 0 {
                        result_data
                            .ultrasound
                            .insert(i / data.samples, ultrasound_vec.clone());
                        ultrasound_vec = Vec::new();
                    }
                }

                // Build B-scan
                for row in 0..data.rows as usize {
                    let mut bscan_vec: Vec<interfaces::Vector3> = Vec::new();

                    for col in 0..data.columns as usize {
                        let map = result_data
                            .ultrasound
                            .get(
                                &(col as usize
                                    + (row as usize * result_data.cscan.columns as usize)),
                            )
                            .unwrap();

                        for i in 0..map.len() {
                            bscan_vec.push(interfaces::Vector3 {
                                x: col as f64,
                                y: i as f64,
                                z: map[i].y,
                            });
                        }
                    }

                    result_data.bscan.insert(row, bscan_vec.clone());
                }

                // Build D-scan
                for col in 0..data.columns as usize {
                    let mut dscan_vec: Vec<interfaces::Vector3> = Vec::new();

                    for row in 0..data.rows as usize {
                        let map = result_data
                            .ultrasound
                            .get(
                                &(col as usize
                                    + (row as usize * result_data.cscan.columns as usize)),
                            )
                            .unwrap();

                        for i in 0..map.len() {
                            dscan_vec.push(interfaces::Vector3 {
                                x: row as f64,
                                y: i as f64,
                                z: map[i].y,
                            });
                        }
                    }

                    result_data.dscan.insert(col, dscan_vec.clone());
                }
            };
        }
        Err(_e) => {
            error = "Failed to find file, or file is invalid".to_string();
        }
    }

    if error == "" {
        Ok(data)
    } else {
        Err(error)
    }
}

pub fn parse_ultrasound(
    result_data: &Results,
    column: u32,
    row: u32,
) -> Vec<interfaces::Vector2> {
    let vec = result_data
        .ultrasound
        .get(&(column as usize + (row as usize * result_data.cscan.columns as usize)))
        .unwrap();

    return vec.clone();
}

pub fn parse_bscan(result_data: &Results, row: u32) -> Vec<interfaces::Vector3> {
    let vec = result_data.bscan.get(&(row as usize)).unwrap();

    return vec.clone();
}

pub fn parse_dscan(result_data: &Results, column: u32) -> Vec<interfaces::Vector3> {
    let vec = result_data.dscan.get(&(column as usize)).unwrap();

    return vec.clone();
}
