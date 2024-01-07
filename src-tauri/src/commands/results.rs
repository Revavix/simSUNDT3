use std::fs;
use regex::Regex;

pub mod identifiers;
pub mod interfaces;

pub fn parse_metadata(path: String) -> Result<interfaces::Metadata, String> {
    let mut error: String = "None".to_string();
    let mut metadata: interfaces::Metadata = interfaces::Metadata::new();

    let mut identifiers: Vec<&interfaces::Identifier> = vec![];
    metadata.set_shared_identifiers(&mut identifiers).unwrap();
    metadata.set_probe_identifiers(&path, &mut identifiers).unwrap();
    metadata.set_defect_identifiers(&path, &mut identifiers).unwrap();

    match fs::read_to_string(path) {
        Ok(raw) => {
            for identifier in identifiers {
                let re_id = Regex::new(&identifier.id).unwrap();
        
                match re_id.find(&raw) {
                    Some(id_match) => {
                        let l_idx = id_match.range().start;
                        let r_idx = id_match.range().end;
                        let re = Regex::new(&identifier.regex).unwrap();
                        let matches: Vec<_> = re.find_iter(&raw[l_idx..r_idx+identifier.max_offset]).map(|m| m.as_str()).collect();
                        let mut vec: Vec<f64> = vec![0.0; identifier.fields as usize];
                        
                        if matches.len() != identifier.fields {
                            if identifier.optional {
                                continue;
                            } else {
                                error = format!("Failed to match {} fields at '{}' with pattern '{}'", identifier.fields, &identifier.id, &identifier.regex);
                                break;
                            }
                        } else {
                            for i in 0..identifier.fields {
                                vec[i] = matches[i as usize].trim().parse::<f64>().unwrap();
                            }
            
                            (identifier.operation)(&mut metadata, &mut vec);
                        }
                    }
                    None => {
                        if !identifier.optional {
                            error = format!("Failed to find identifier '{}' in the provided path", &identifier.id);
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

pub fn parse_top_view(path: String) -> Result<interfaces::Top, String> {
    let mut error = "".to_string();
    let mut data: interfaces::Top = interfaces::Top {
        columns: 0,
        rows: 0,
        samples: 0,
        amplitude: 0.0,
        content: Vec::new()
    };

    match std::fs::read(&path) {
        Ok(bytes) => { 
            unsafe {
                let data_offset: usize = 10;
                let ret = std::slice::from_raw_parts(bytes.as_ptr() as *const f32, bytes.len() * 4);

                data.columns = ret[0] as usize;
                data.rows = ret[1] as usize;
                data.samples = ret[2] as u32;
                data.amplitude = ret[7] as f32;

                for y in 0..(ret[1] as usize) {
                    for x in 0..(ret[0] as usize) {
                        let idx = x + (y * (ret[0] as usize));
                        data.content.push(interfaces::Vector3 {
                            x: x as f64,
                            y: y as f64,
                            z: ret[data_offset+idx] as f64
                        });
                    }
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

pub fn parse_point_view(path: String, index: usize, samples: usize) -> Result<Vec<interfaces::Vector2>, String> {
    let mut error = "".to_string();
    let mut data: Vec<interfaces::Vector2> = Vec::new();

    match std::fs::read(&path) {
        Ok(bytes) => { 
            unsafe {
                let ret = std::slice::from_raw_parts(bytes.as_ptr() as *const f32, bytes.len() / 4);

                if ret.len() < (index+1)*samples {
                    error = "Data missing, A is probably not from the same test as chosen C test, or an invalid file was chosen".to_string();
                } else {
                    for i in ((index*samples) as usize)..(((index+1)*samples) as usize) {
                        data.push(interfaces::Vector2 {
                            x: (i % samples) as f64,
                            y: ret[i] as f64
                        });
                    }
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

pub fn parse_side_view(path: String, indicies: Vec<usize>, samples: usize) -> Result<Vec<interfaces::Vector3>, String> {
    let mut error = "".to_string();
    let mut data: Vec<interfaces::Vector3> = Vec::new();
    let mut x: usize = 0;

    match std::fs::read(&path) {
        Ok(bytes) => { 
            unsafe {
                let ret = std::slice::from_raw_parts(bytes.as_ptr() as *const f32, bytes.len() / 4);

                for index in indicies {
                    if ret.len() < (index+1)*samples {
                        error = format!("Index {} exceeds data length", index);
                    } else {
                        for i in ((index*samples) as usize)..(((index+1)*samples) as usize) {
                            data.push(interfaces::Vector3 {
                                x: x as f64,
                                y: (i % samples) as f64,
                                z: ret[i] as f64
                            })
                        }
                    }
                    x += 1;
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