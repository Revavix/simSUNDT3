use crate::commands::results::interfaces;

fn set_probe_type(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut swl) = &mut metadata.probe.wave_properties {
        match data[0] {
            "SV" => swl.type_of_probe = 1,
            "SH" => swl.type_of_probe = 2,
            "L" => swl.type_of_probe = 3,
            _ => swl.type_of_probe = 0,
        }
    };
}

fn set_probe_nearfield(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut swl) = &mut metadata.probe.wave_properties {
        swl.nearfield.length = data[0].parse::<f64>().unwrap();
        swl.nearfield.wavelength = data[1].parse::<f64>().unwrap();
    };
}

fn set_probe_elements(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut swl) = &mut metadata.probe.wave_properties {
        swl.elements.x = data[0].parse::<f64>().unwrap();
        swl.elements.y = data[1].parse::<f64>().unwrap();
    }
}

fn set_probe_rotation(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut swl) = &mut metadata.probe.wave_properties {
        swl.rotation = data[0].parse::<f64>().unwrap();
    }
}

fn set_probe_size(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut swl) = &mut metadata.probe.wave_properties {
        swl.size.x = data[0].parse::<f64>().unwrap();
        swl.size.y = data[1].parse::<f64>().unwrap();
    };
}

fn set_probe_angle(metadata: &mut interfaces::Metadata, data: &mut Vec<&str>) -> () {
    if let &mut Some(ref mut swl) = &mut metadata.probe.wave_properties {
        swl.angle = data[0].parse::<f64>().unwrap()
    };
}

pub static SWL_IDENTIFIERS: &[interfaces::Identifier] = &[
    interfaces::Identifier {
        id: r"(SV type with beam angle:|SH type with beam angle:|L type with beam angle:)",
        operation: set_probe_type,
        regex: r"(SV|SH|L)",
        fields: 1,
        max_offset: 6,
        optional: false,
    },
    interfaces::Identifier {
        id: r"(SV type with beam angle:|SH type with beam angle:|L type with beam angle:)",
        operation: set_probe_angle,
        regex: r"-?\d+\.\d+",
        fields: 1,
        max_offset: 6,
        optional: false,
    },
    interfaces::Identifier {
        id: r"(Elliptic probe with axes in x and y dirs:|Rectangular probe with sides in x and y dirs:)",
        operation: set_probe_size,
        regex: r"-?\d+\.\d+",
        fields: 2,
        max_offset: 18,
        optional: false,
    },
    interfaces::Identifier {
        id: r"Probe rotation counterclockwise relative x direction:",
        operation: set_probe_rotation,
        regex: r"-?\d+\.\d+",
        fields: 1,
        max_offset: 6,
        optional: true,
    },
    interfaces::Identifier {
        id: r"Probe divided into nr of elements in x and y dir:",
        operation: set_probe_elements,
        regex: r"\d{1}",
        fields: 2,
        max_offset: 6,
        optional: true,
    },
    interfaces::Identifier {
        id: r"Near field length and wavelength:",
        operation: set_probe_nearfield,
        regex: r"-?\d+\.\d+",
        fields: 2,
        max_offset: 18,
        optional: true,
    },
];
