use crate::commands::results::interfaces;

fn set_position(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    if let &mut Some(ref mut sdh) = &mut metadata.defect.side_drilled_hole {
        sdh.position.x = data[0];
        sdh.position.y = data[1];
    };
}

fn set_depth(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    if let &mut Some(ref mut sdh) = &mut metadata.defect.side_drilled_hole {
        sdh.depth = data[0];
    };
}

fn set_diameter(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    if let &mut Some(ref mut sdh) = &mut metadata.defect.side_drilled_hole {
        sdh.diameter = data[0];
    };
}


pub static DEFECT_SDH_IDENTIFIERS: &[interfaces::Identifier] = &[
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
        id: r"Defect is a side-drilled hole with diameter:", 
        operation: set_diameter,
        regex: r"-?\d+\.\d+",
        fields: 1,
        max_offset: 10,
        optional: false
    }
];