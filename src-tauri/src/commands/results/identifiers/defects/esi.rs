use crate::commands::results::interfaces;

fn set_defect_position(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut esi) = &mut metadata.defect.spherical_inclusion {
        esi.position.x = data[0].parse::<f64>().unwrap();
        esi.position.y = data[1].parse::<f64>().unwrap();
    };
}

fn set_defect_depth(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut esi) = &mut metadata.defect.spherical_inclusion {
        esi.depth = data[0].parse::<f64>().unwrap();
    };
}

fn set_esi_properties(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut esi) = &mut metadata.defect.spherical_inclusion {
        esi.diameter = data[0].parse::<f64>().unwrap();
        esi.density = data[1].parse::<f64>().unwrap();
        esi.wavespeed_compressional = data[2].parse::<f64>().unwrap();
        esi.wavespeed_shear = data[3].parse::<f64>().unwrap();
    };
}

pub static DEFECT_ESI_IDENTIFIERS: &[interfaces::Identifier] = &[
    interfaces::Identifier { 
        id: r"The x- and y- coordinates of the defect centre are:", 
        operation: set_defect_position,
        regex: r"-?\d+\.\d+",
        fields: 2,
        max_offset: 18,
        optional: false
    },
    interfaces::Identifier { 
        id: r"The depth to the centre of the defect is:", 
        operation: set_defect_depth,
        regex: r"-?\d+\.\d+",
        fields: 1,
        max_offset: 10,
        optional: false
    },
    interfaces::Identifier { 
        id: r"Defect is an elastic sphere with diameter, rel. density, and compressional\r\nand shear wavespeeds:", 
        operation: set_esi_properties,
        regex: r"-?\d+\.\d{3}",
        fields: 4,
        max_offset: 32,
        optional: false
    }
];