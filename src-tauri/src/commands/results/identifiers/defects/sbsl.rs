use crate::commands::results::interfaces;

fn set_position(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut sbsl) = &mut metadata.defect.surface_breaking_strip_like_crack {
        sbsl.position.x = data[0].parse::<f64>().unwrap();
        sbsl.position.y = data[1].parse::<f64>().unwrap();
    };
}

fn set_depth(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut sbsl) = &mut metadata.defect.surface_breaking_strip_like_crack {
        sbsl.depth = data[0].parse::<f64>().unwrap();
    };
}

fn set_width(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut sbsl) = &mut metadata.defect.surface_breaking_strip_like_crack {
        sbsl.width = data[0].parse::<f64>().unwrap();
    };
}

fn set_vertical_tilt(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut sbsl) = &mut metadata.defect.surface_breaking_strip_like_crack {
        sbsl.vertical_tilt = data[0].parse::<f64>().unwrap();
    };
}

fn set_horizontal_tilt(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut sbsl) = &mut metadata.defect.surface_breaking_strip_like_crack {
        sbsl.horizontal_tilt = data[0].parse::<f64>().unwrap();
    };
}


pub static DEFECT_SBSL_IDENTIFIERS: &[interfaces::Identifier] = &[
    interfaces::Identifier { 
        id: r"The x- and y- coordinates of the defect centre are:", 
        operation: set_position,
        regex: r"-?\d+\.\d+",
        fields: 2,
        max_offset: 18,
        optional: false
    },
    interfaces::Identifier { 
        id: r"The depth to the back surface is:", 
        operation: set_depth,
        regex: r"-?\d+\.\d+",
        fields: 1,
        max_offset: 10,
        optional: false
    },
    interfaces::Identifier { 
        id: r"The width of the crack is:", 
        operation: set_width,
        regex: r"-?\d+\.\d+",
        fields: 1,
        max_offset: 10,
        optional: false
    },
    interfaces::Identifier { 
        id: r"The crack is tilted from the vertical with the angle:", 
        operation: set_vertical_tilt,
        regex: r"-?\d+\.\d+",
        fields: 1,
        max_offset: 10,
        optional: false
    },
    interfaces::Identifier { 
        id: r"The back surface is tilted from the horisontal with the angle:", 
        operation: set_horizontal_tilt,
        regex: r"-?\d+\.\d+",
        fields: 1,
        max_offset: 10,
        optional: false
    }
];