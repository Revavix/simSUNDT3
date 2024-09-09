use crate::commands::results::interfaces::{self};

fn set_density_ratio(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut imm) = &mut metadata.probe.immersion_properties {
        imm.density_ratio = data[0].parse::<f64>().unwrap();
    }
}

fn set_wavespeed(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut imm) = &mut metadata.probe.immersion_properties {
        imm.fluid_wavespeed = data[0].parse::<f64>().unwrap();
    }
}

fn set_distance(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut imm) = &mut metadata.probe.immersion_properties {
        imm.distance = data[0].parse::<f64>().unwrap();
    }
}

fn set_eulers(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut imm) = &mut metadata.probe.immersion_properties {
        imm.eulers.x = data[0].parse::<f64>().unwrap();
        imm.eulers.y = data[1].parse::<f64>().unwrap();
        imm.eulers.z = data[2].parse::<f64>().unwrap();
    }
}

pub static IMMERSION_IDENTIFIERS: &[interfaces::Identifier] = &[
    interfaces::Identifier { 
        id: r"Immersion probe in a fluid with wave speed:", 
        operation: set_wavespeed,
        regex: r"-?\d+\.\d+",
        fields: 1,
        max_offset: 12,
        optional: false
    },
    interfaces::Identifier { 
        id: r"and density ratio to the solid component:", 
        operation: set_density_ratio,
        regex: r"-?\d+\.\d+",
        fields: 1,
        max_offset: 12,
        optional: false
    },
    interfaces::Identifier { 
        id: r"Distance between probe and component:", 
        operation: set_distance,
        regex: r"-?\d+\.\d+",
        fields: 1,
        max_offset: 12,
        optional: false
    },
    interfaces::Identifier { 
        id: r"Euler angles \(zyz\) of probe orientation:", 
        operation: set_eulers,
        regex: r"-?\d+\.\d+",
        fields: 3,
        max_offset: 24,
        optional: false
    },
];