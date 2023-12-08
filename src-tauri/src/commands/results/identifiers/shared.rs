use crate::commands::results::interfaces;

fn set_max_output(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    metadata.max_output = data[0] * f64::powf(10.0, data[1]);
}

fn set_probe_true_angle(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    metadata.probe.true_angle = data[0];
}

fn set_accuracy(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    metadata.accuracy = data[0];
}

fn set_timegate(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    metadata.timegate.start = data[0];
    metadata.timegate.end = data[1];
    metadata.timegate.increment = data[2];
}

fn set_frequencies(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    metadata.frequencies = data[0];
}

fn set_calibration(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    metadata.calibration.diameter = data[0];
    metadata.calibration.depth = data[1];
}

fn set_probe_couplant(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    metadata.probe.couplant = data[0];
}

fn set_signal(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    metadata.probe.frequency = data[0];
    metadata.probe.bandwidth = data[1];
}

fn set_y_axis(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    metadata.coordinates.y.start = data[0];
    metadata.coordinates.y.end = data[1];
    metadata.coordinates.y.increment = data[2];
}

fn set_x_axis(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    metadata.coordinates.x.start = data[0];
    metadata.coordinates.x.end = data[1];
    metadata.coordinates.x.increment = data[2];
}

fn set_wavespeeds(metadata: &mut interfaces::Metadata, data: &mut Vec<f64>) -> () {
    metadata.wavespeeds.compressional = data[0];
    metadata.wavespeeds.shear = data[1];
}

pub static SHARED_IDENTIFIERS: &[interfaces::Identifier] = &[
    interfaces::Identifier { 
        id: r"The component's compressional and shear wavespeeds are:", 
        operation: set_wavespeeds,
        regex: r"-?\d+\.\d+",
        fields: 2,
        max_offset: 17,
        optional: false
    },
    interfaces::Identifier { 
        id: r"Scan along x axis, start, end and increment\r\n.+\(0 is above the defect\):", 
        operation: set_x_axis,
        regex: r"-?\d+\.\d+",
        fields: 3,
        max_offset: 25,
        optional: false
    },
    interfaces::Identifier { 
        id: r"Scan along y axis, start, end and increment\r\n.+\(0 is above the defect\):", 
        operation: set_y_axis,
        regex: r"-?\d+\.\d+",
        fields: 3,
        max_offset: 25,
        optional: false
    },
    interfaces::Identifier { 
        id: r"Frequency and bandwidth:", 
        operation: set_signal,
        regex: r"-?\d+\.\d+",
        fields: 2,
        max_offset: 15,
        optional: false
    },
    interfaces::Identifier { 
        id: r"Couplant \(0=fluid, 1=glued\):", 
        operation: set_probe_couplant,
        regex: r"-?\d+\.\d+",
        fields: 1,
        max_offset: 6,
        optional: true
    },
    interfaces::Identifier { 
        id: r"Calibration by.+with diameter and depth:", 
        operation: set_calibration,
        regex: r"-?\d+\.\d+",
        fields: 2,
        max_offset: 16,
        optional: true
    },
    interfaces::Identifier { 
        id: r"The number of frequencies used are:", 
        operation: set_frequencies,
        regex: r"\d+{1,4}",
        fields: 1,
        max_offset: 4,
        optional: false
    },
    interfaces::Identifier { 
        id: r"The time start, end, and increment:", 
        operation: set_timegate,
        regex: r"-?\d+\.\d+",
        fields: 3,
        max_offset: 24,
        optional: false
    },
    interfaces::Identifier { 
        id: r"The accuracy index is:", 
        operation: set_accuracy,
        regex: r"\d+{1}",
        fields: 1,
        max_offset: 2,
        optional: false
    },
    interfaces::Identifier { 
        id: r".True. probe angle:", 
        operation: set_probe_true_angle,
        regex: r"-?\d+\.\d+",
        fields: 1,
        max_offset: 8,
        optional: true
    },
    interfaces::Identifier { 
        id: r"Uncalibrated maximum output signal in dB:", 
        operation: set_max_output,
        regex: r"-?\d?\.?\d+",
        fields: 2,
        max_offset: 12,
        optional: true
    }
];