use crate::commands::results::interfaces;

fn set_position(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    if let &mut Some(ref mut sphc) = &mut metadata.defect.spheroidal_cavity {
        sphc.position.x = data[0];
        sphc.position.y = data[1];
    };
}

fn set_depth(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    if let &mut Some(ref mut sphc) = &mut metadata.defect.spheroidal_cavity {
        sphc.depth = data[0];
    };
}

fn set_axes(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    if let &mut Some(ref mut sphc) = &mut metadata.defect.spheroidal_cavity {
        sphc.axes.x = data[0];
        sphc.axes.y = data[1];
    };
}

fn set_eulers(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    if let &mut Some(ref mut cc) = &mut metadata.defect.circular_crack {
        cc.eulers.x = data[0];
        cc.eulers.y = data[1];
    };
}

pub static DEFECT_SPHC_IDENTIFIERS: &[interfaces::Identifier] = &[
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
        max_offset: 9,
        optional: false
    },
    interfaces::Identifier { 
        id: r"Defect is a spheroidal cavity with axes:", 
        operation: set_axes,
        regex: r"-?\d+\.\d+",
        fields: 2,
        max_offset: 18,
        optional: false
    },
    interfaces::Identifier { 
        id: r"Euler angles for defect tilt and skew, etha, phi:", 
        operation: set_eulers,
        regex: r"-?\d+\.\d+",
        fields: 2,
        max_offset: 18,
        optional: false
    }
];