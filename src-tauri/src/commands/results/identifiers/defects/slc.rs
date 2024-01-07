use crate::commands::results::interfaces;

fn set_position(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    if let &mut Some(ref mut ssc) = &mut metadata.defect.strip_like_crack {
        ssc.position.x = data[0];
        ssc.position.y = data[1];
    };
}

fn set_depth(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    if let &mut Some(ref mut ssc) = &mut metadata.defect.strip_like_crack {
        ssc.depth = data[0];
    };
}

fn set_width_and_tilt(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    if let &mut Some(ref mut ssc) = &mut metadata.defect.strip_like_crack {
        ssc.width= data[0];
        ssc.tilt = data[1];
    };
}


pub static DEFECT_SLC_IDENTIFIERS: &[interfaces::Identifier] = &[
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
        id: r"Defect is a strip-like open crack with width and tiltfrom vertical:", 
        operation: set_width_and_tilt,
        regex: r"-?\d+\.\d+",
        fields: 2,
        max_offset: 18,
        optional: false
    }
];