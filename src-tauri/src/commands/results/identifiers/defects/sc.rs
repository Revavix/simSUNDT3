use crate::commands::results::interfaces;

fn set_position(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut sc) = &mut metadata.defect.spherical_cavity {
        sc.position.x = data[0].parse::<f64>().unwrap();
        sc.position.y = data[1].parse::<f64>().unwrap();
    };
}

fn set_diameter(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut sc) = &mut metadata.defect.spherical_cavity {
        sc.diameter = data[0].parse::<f64>().unwrap();
    };
}

fn set_depth(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut sc) = &mut metadata.defect.spherical_cavity {
        sc.depth = data[0].parse::<f64>().unwrap();
    };
}

pub static DEFECT_SC_IDENTIFIERS: &[interfaces::Identifier] = &[
    interfaces::Identifier { 
        id: r"The x- and y- coordinates of the defect centre are:", 
        operation: set_position,
        regex: r"-?\d+\.\d+",
        fields: 2,
        max_offset: 18,
        optional: false
    },
    interfaces::Identifier { 
        id: r"The depth to the centre of the defect is:", 
        operation: set_depth,
        regex: r"-?\d+\.\d+",
        fields: 1,
        max_offset: 10,
        optional: false
    },
    interfaces::Identifier { 
        id: r"Defect is .+ with diameter:", 
        operation: set_diameter,
        regex: r"-?\d+\.\d+",
        fields: 1,
        max_offset: 10,
        optional: false
    }
];