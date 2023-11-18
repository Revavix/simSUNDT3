use std::{fs::{ self, File}, io::{BufReader, Read}, str::from_boxed_utf8_unchecked};
use regex::Regex;
use serde::Serialize;
use serde_json::json;

#[derive(Serialize, Clone, Copy)]
struct Axis {
    start: f64,
    end: f64,
    increment: f64
}

#[derive(Serialize, Clone, Copy)]
struct Vector2Axis {
    x: Axis,
    y: Axis
}


#[derive(Serialize, Clone, Copy)]
pub struct Vector2 {
    x: f64,
    y: f64
}

#[derive(Serialize, Clone, Copy)]
pub struct Vector3 {
    x: f64,
    y: f64,
    z: f64
}


#[derive(Serialize, Clone, Copy)]
struct Wavespeeds {
    compressional: f64,
    shear: f64
}


#[derive(Serialize, Clone, Copy)]
struct Nearfield {
    length: f64,
    wavelength: f64
}


#[derive(Serialize, Clone, Copy)]
pub struct Probe {
    frequency: f64,
    bandwidth: f64,
    angle: f64,
    couplant: f64,
    size: Vector2,
    rotation: f64,
    elements: Vector2,
    nearfield: Nearfield,
    true_angle: f64
}


#[derive(Serialize, Clone, Copy)]
pub struct Defect {
    position: Vector2,
    depth: f64,
    diameter: f64
}


#[derive(Serialize, Clone, Copy)]
pub struct Calibration {
    diameter: f64,
    depth: f64
}


#[derive(Serialize, Clone, Copy)]
pub struct Timegate {
    start: f64,
    end: f64,
    increment: f64
}

#[derive(Serialize, Clone, Copy)]
pub struct Metadata {
    wavespeeds: Wavespeeds,
    coordinates: Vector2Axis,
    probe: Probe,
    defect: Defect,
    calibration: Calibration,
    frequencies: f64,
    timegate: Timegate,
    accuracy: f64,
    max_output: f64 
}

pub struct Identifier {
    id: String,
    operation: fn(&mut Metadata, &mut Vec<f64>) -> (),
    regex: String,
    fields: usize,
    max_offset: usize,
    optional: bool
}

#[derive(Serialize)]
pub struct Top {
    columns: usize,
    rows: usize,
    samples: u32,
    amplitude: f32,
    content: Vec<Vector3>
}

struct Side {

}

struct End {

}

fn set_max_output(metadata: &mut Metadata, data: &mut Vec<f64>) -> () {
    metadata.max_output = data[0] * f64::powf(10.0, data[1]);
}

fn set_probe_true_angle(metadata: &mut Metadata, data: &mut Vec<f64>) -> () {
    metadata.probe.true_angle = data[0];
}

fn set_accuracy(metadata: &mut Metadata, data: &mut Vec<f64>) -> () {
    metadata.accuracy = data[0];
}

fn set_timegate(metadata: &mut Metadata, data: &mut Vec<f64>) -> () {
    metadata.timegate.start = data[0];
    metadata.timegate.end = data[1];
    metadata.timegate.increment = data[2];
}

fn set_frequencies(metadata: &mut Metadata, data: &mut Vec<f64>) -> () {
    metadata.frequencies = data[0];
}

fn set_calibration(metadata: &mut Metadata, data: &mut Vec<f64>) -> () {
    metadata.calibration.diameter = data[0];
    metadata.calibration.depth = data[1];
}

fn set_defect_diameter(metadata: &mut Metadata, data: &mut Vec<f64>) -> () {
    metadata.defect.diameter = data[0];
}

fn set_defect_depth(metadata: &mut Metadata, data: &mut Vec<f64>) -> () {
    metadata.defect.depth = data[0];
}

fn set_defect_position(metadata: &mut Metadata, data: &mut Vec<f64>) -> () {
    metadata.defect.position.x = data[0];
    metadata.defect.position.y = data[1];
}

fn set_probe_nearfield(metadata: &mut Metadata, data: &mut Vec<f64>) -> () {
    metadata.probe.nearfield.length = data[0];
    metadata.probe.nearfield.wavelength = data[1];
}

fn set_probe_elements(metadata: &mut Metadata, data: &mut Vec<f64>) -> () {
    metadata.probe.elements.x = data[0];
    metadata.probe.elements.y = data[1];
}

fn set_probe_rotation(metadata: &mut Metadata, data: &mut Vec<f64>) -> () {
    metadata.probe.rotation = data[0];
}

fn set_probe_size(metadata: &mut Metadata, data: &mut Vec<f64>) -> () {
    metadata.probe.size.x = data[0];
    metadata.probe.size.y = data[1];
}

fn set_probe_couplant(metadata: &mut Metadata, data: &mut Vec<f64>) -> () {
    metadata.probe.couplant = data[0];
}

fn set_probe_angle(metadata: &mut Metadata, data: &mut Vec<f64>) -> () {
    metadata.probe.angle = data[0];
}

fn set_signal(metadata: &mut Metadata, data: &mut Vec<f64>) -> () {
    metadata.probe.frequency = data[0];
    metadata.probe.bandwidth = data[1];
}

fn set_y_axis(metadata: &mut Metadata, data: &mut Vec<f64>) -> () {
    metadata.coordinates.y.start = data[0];
    metadata.coordinates.y.end = data[1];
    metadata.coordinates.y.increment = data[2];
}

fn set_x_axis(metadata: &mut Metadata, data: &mut Vec<f64>) -> () {
    metadata.coordinates.x.start = data[0];
    metadata.coordinates.x.end = data[1];
    metadata.coordinates.x.increment = data[2];
}

fn set_wavespeeds(metadata: &mut Metadata, data: &mut Vec<f64>) -> () {
    metadata.wavespeeds.compressional = data[0];
    metadata.wavespeeds.shear = data[1];
}

pub fn parse_metadata(path: String) -> Result<Metadata, String> {
    let mut error: String = "None".to_string();
    let mut metadata: Metadata = Metadata {
        wavespeeds: Wavespeeds { 
            compressional: 0.0, 
            shear: 0.0 
        },
        coordinates: Vector2Axis {
            x: Axis {
                start: 0.0,
                end: 0.0,
                increment: 0.0
            },
            y: Axis {
                start: 0.0,
                end: 0.0,
                increment: 0.0
            }
        },
        probe: Probe {
            frequency: 0.0,
            bandwidth: 0.0,
            angle: 0.0,
            couplant: 0.0,
            size: Vector2 {
                x: 0.0,
                y: 0.0
            },
            rotation: 0.0,
            elements: Vector2 {
                x: 0.0,
                y: 0.0
            },
            nearfield: Nearfield { 
                length:  0.0, 
                wavelength: 0.0 
            },
            true_angle: 0.0
        },
        defect: Defect {
            position: Vector2 { 
                x: 0.0, 
                y: 0.0 
            },
            depth: 0.0,
            diameter: 0.0
        },
        calibration: Calibration {
            depth: 0.0,
            diameter: 0.0
        },
        frequencies: 0.0,
        timegate: Timegate {
            start: 0.0,
            end: 0.0,
            increment: 0.0
        },
        accuracy: 0.0,
        max_output: 0.0
    };

    let identifiers: Vec<Identifier> = vec![
        Identifier { 
            id: r"The component's compressional and shear wavespeeds are:".to_string(), 
            operation: set_wavespeeds,
            regex: r"-?\d+\.\d+".to_string(),
            fields: 2,
            max_offset: 17,
            optional: false
        },
        Identifier { 
            id: r"Scan along x axis, start, end and increment\r\n.+\(0 is above the defect\):".to_string(), 
            operation: set_x_axis,
            regex: r"-?\d+\.\d+".to_string(),
            fields: 3,
            max_offset: 25,
            optional: false
        },
        Identifier { 
            id: r"Scan along y axis, start, end and increment\r\n.+\(0 is above the defect\):".to_string(), 
            operation: set_y_axis,
            regex: r"-?\d+\.\d+".to_string(),
            fields: 3,
            max_offset: 25,
            optional: false
        },
        Identifier { 
            id: r"Frequency and bandwidth:".to_string(), 
            operation: set_signal,
            regex: r"-?\d+\.\d+".to_string(),
            fields: 2,
            max_offset: 15,
            optional: false
        },
        Identifier { 
            id: r"The probe is of SV type with beam angle:".to_string(), 
            operation: set_probe_angle,
            regex: r"-?\d+\.\d+".to_string(),
            fields: 1,
            max_offset: 6,
            optional: false
        },
        Identifier { 
            id: r"Couplant \(0=fluid, 1=glued\):".to_string(), 
            operation: set_probe_couplant,
            regex: r"-?\d+\.\d+".to_string(),
            fields: 1,
            max_offset: 6,
            optional: false
        },
        Identifier { 
            id: r"Elliptic probe with axes in x and y dirs:".to_string(), 
            operation: set_probe_size,
            regex: r"-?\d+\.\d+".to_string(),
            fields: 2,
            max_offset: 18,
            optional: false
        },
        Identifier { 
            id: r"Probe rotation counterclockwise relative x direction:".to_string(), 
            operation: set_probe_rotation,
            regex: r"-?\d+\.\d+".to_string(),
            fields: 1,
            max_offset: 6,
            optional: false
        },
        Identifier { 
            id: r"Probe divided into nr of elements in x and y dir:".to_string(), 
            operation: set_probe_elements,
            regex: r"\d{1}".to_string(),
            fields: 2,
            max_offset: 6,
            optional: false
        },
        Identifier { 
            id: r"Near field length and wavelength:".to_string(), 
            operation: set_probe_nearfield,
            regex: r"-?\d+\.\d+".to_string(),
            fields: 2,
            max_offset: 18,
            optional: false
        },
        Identifier { 
            id: r"The x- and y- coordinates of the defect centre are:".to_string(), 
            operation: set_defect_position,
            regex: r"-?\d+\.\d+".to_string(),
            fields: 2,
            max_offset: 14,
            optional: false
        },
        Identifier { 
            id: r"The depth to the centre of the defect is:".to_string(), 
            operation: set_defect_depth,
            regex: r"-?\d+\.\d+".to_string(),
            fields: 1,
            max_offset: 9,
            optional: false
        },
        Identifier { 
            id: r"Defect is .+ with diameter:".to_string(), 
            operation: set_defect_diameter,
            regex: r"-?\d+\.\d+".to_string(),
            fields: 1,
            max_offset: 9,
            optional: false
        },
        Identifier { 
            id: r"Calibration by.+with diameter and depth:".to_string(), 
            operation: set_calibration,
            regex: r"-?\d+\.\d+".to_string(),
            fields: 2,
            max_offset: 16,
            optional: true
        },
        Identifier { 
            id: r"The number of frequencies used are:".to_string(), 
            operation: set_frequencies,
            regex: r"\d+{1,4}".to_string(),
            fields: 1,
            max_offset: 4,
            optional: false
        },
        Identifier { 
            id: r"The time start, end, and increment:".to_string(), 
            operation: set_timegate,
            regex: r"-?\d+\.\d+".to_string(),
            fields: 3,
            max_offset: 24,
            optional: false
        },
        Identifier { 
            id: r"The accuracy index is:".to_string(), 
            operation: set_accuracy,
            regex: r"\d+{1}".to_string(),
            fields: 1,
            max_offset: 2,
            optional: false
        },
        Identifier { 
            id: r".True. probe angle:".to_string(), 
            operation: set_probe_true_angle,
            regex: r"-?\d+\.\d+".to_string(),
            fields: 1,
            max_offset: 8,
            optional: true
        },
        Identifier { 
            id: r"Uncalibrated maximum output signal in dB:".to_string(), 
            operation: set_max_output,
            regex: r"-?\d?\.?\d+".to_string(),
            fields: 2,
            max_offset: 12,
            optional: true
        }
    ];

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
        Err(e) => {
            error = format!("Failed to find file, or file is invalid");
        }
    }

    if error == "None" {
        Ok(metadata)
    } else {
        Err(error)
    }
}

pub fn parse_top_view(path: String) -> Result<Top, String> {
    let mut error = "".to_string();
    let mut data: Top = Top {
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
                        data.content.push(Vector3 {
                            x: x as f64,
                            y: y as f64,
                            z: ret[data_offset+idx] as f64
                        });
                    }
                }
            };
        }
        Err(e) => {
            error = "Failed to find file, or file is invalid".to_string();
        }
    }

    if error == "" {
        Ok(data)
    } else {
        Err(error)
    }
}

pub fn parse_point_view(path: String, index: usize, samples: usize) -> Result<Vec<Vector2>, String> {
    let mut error = "".to_string();
    let mut data: Vec<Vector2> = Vec::new();

    match std::fs::read(&path) {
        Ok(bytes) => { 
            unsafe {
                let ret = std::slice::from_raw_parts(bytes.as_ptr() as *const f32, bytes.len() / 4);

                if ret.len() < (index+1)*samples {
                    error = "Data missing, A is probably not from the same test as chosen C test, or an invalid file was chosen".to_string();
                } else {
                    for i in ((index*samples) as usize)..(((index+1)*samples) as usize) {
                        data.push(Vector2 {
                            x: (i % samples) as f64,
                            y: ret[i] as f64
                        });
                    }
                }
            };
        }
        Err(e) => {
            error = "Failed to find file, or file is invalid".to_string();
        }
    }

    if error == "" {
        Ok(data)
    } else {
        Err(error)
    }
}

pub fn parse_side_view(path: String, indicies: Vec<usize>, samples: usize) -> Result<Vec<Vector3>, String> {
    let mut error = "".to_string();
    let mut data: Vec<Vector3> = Vec::new();
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
                            data.push(Vector3 {
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
        Err(e) => {
            error = "Failed to find file, or file is invalid".to_string();
        }
    }

    if error == "" {
        Ok(data)
    } else {
        Err(error)
    }
}