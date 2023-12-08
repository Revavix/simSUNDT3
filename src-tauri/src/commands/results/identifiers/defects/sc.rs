use crate::commands::results::interfaces;

fn set_position(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    if let &mut Some(ref mut sc) = &mut metadata.defect.spherical_cavity {
        sc.position.x = data[0];
        sc.position.y = data[1];
    };
}

fn set_diameter(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    if let &mut Some(ref mut sc) = &mut metadata.defect.spherical_cavity {
        sc.diameter = data[0];
    };
}

fn set_depth(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    if let &mut Some(ref mut sc) = &mut metadata.defect.spherical_cavity {
        sc.depth = data[0];
    };
}

pub static DEFECT_SC_IDENTIFIERS: &[interfaces::Identifier] = &[
    interfaces::Identifier { 
        id: r"The x- and y- coordinates of the defect centre are:", 
        operation: set_position,
        regex: r"-?\d+\.\d+",
        fields: 2,
        max_offset: 14,
        optional: false
    },
    interfaces::Identifier { 
        id: r"The depth to the centre of the defect is:", 
        operation: set_depth,
        regex: r"-?\d+\.\d+",
        fields: 1,
        max_offset: 9,
        optional: false
    },
    interfaces::Identifier { 
        id: r"Defect is .+ with diameter:", 
        operation: set_diameter,
        regex: r"-?\d+\.\d+",
        fields: 1,
        max_offset: 9,
        optional: false
    }
];