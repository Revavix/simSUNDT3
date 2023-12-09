use crate::commands::results::interfaces;

fn set_position(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    if let &mut Some(ref mut cc) = &mut metadata.defect.rectangular_crack {
        cc.position.x = data[0];
        cc.position.y = data[1];
    };
}

fn set_depth(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    if let &mut Some(ref mut cc) = &mut metadata.defect.rectangular_crack {
        cc.depth = data[0];
    };
}

fn set_properties(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () { 
    if let &mut Some(ref mut cc) = &mut metadata.defect.rectangular_crack {
        cc.sides.x = data[0];
        cc.sides.y = data[1];
        cc.tilt = data[2];
    };
}


pub static DEFECT_RC_IDENTIFIERS: &[interfaces::Identifier] = &[
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
        id: r"Defect is a rectangular open crack with sides and tilt from vertical:", 
        operation: set_properties,
        regex: r"-?\d+\.\d+",
        fields: 3,
        max_offset: 30,
        optional: false
    }
];