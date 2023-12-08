use regex::Regex;
use serde::Serialize;

use super::identifiers::defects;
use super::identifiers::shared;
use super::identifiers::probes;

#[derive(Serialize, Clone, Copy, Default)]
pub struct Axis {
    pub start: f64,
    pub end: f64,
    pub increment: f64
}

#[derive(Serialize, Clone, Copy, Default)]
pub struct Vector2Axis {
    pub x: Axis,
    pub y: Axis
}

#[derive(Serialize, Clone, Copy, Default)]
pub struct Vector2 {
    pub x: f64,
    pub y: f64
}

#[derive(Serialize, Clone, Copy, Default)]
pub struct Vector3 {
    pub x: f64,
    pub y: f64,
    pub z: f64
}


#[derive(Serialize, Clone, Copy, Default)]
pub struct Wavespeeds {
    pub compressional: f64,
    pub shear: f64
}


#[derive(Serialize, Clone, Copy, Default)]
pub struct Nearfield {
    pub length: f64,
    pub wavelength: f64
}

#[derive(Serialize, Clone, Copy, Default)]
pub struct ShearWavesAndLongitudinalProperties {
    pub angle: f64,
    pub elements: Vector2,
    pub size: Vector2,
    pub rotation: f64,
    pub nearfield: Nearfield
}

#[derive(Serialize, Clone, Copy, Default)]
pub struct ImmersionProperties {
    pub fluid_wavespeed: f64,
    pub density_ratio: f64,
    pub distance: f64,
    pub eulers: Vector3
}

#[derive(Serialize, Clone, Copy, Default)]
pub struct Probe {
    pub frequency: f64,
    pub bandwidth: f64,
    pub couplant: f64,
    pub true_angle: f64,
    pub wave_properties: Option<ShearWavesAndLongitudinalProperties>,
    pub immersion_properties: Option<ImmersionProperties>,
    pub focal_distance: Option<f64>
}

#[derive(Serialize, Clone, Copy, Default)]
pub struct SphericalCavity {
    pub position: Vector2,
    pub depth: f64,
    pub diameter: f64
}

#[derive(Serialize, Clone, Copy, Default)]
pub struct SphericalInclusion {
    pub position: Vector2,
    pub depth: f64,
    pub diameter: f64,
    pub density: f64,
    pub wavespeed_compressional: f64,
    pub wavespeed_shear: f64
}

#[derive(Serialize, Clone, Copy, Default)]
pub struct CircularCrack {
    pub position: Vector2,
    pub depth: f64,
    pub diameter: f64,
    pub eulers: Vector2
}

#[derive(Serialize, Clone, Copy, Default)]
pub struct SpheroidalCavity {
    pub position: Vector2,
    pub depth: f64,
    pub axes: Vector2,
    pub eulers: Vector2
}

#[derive(Serialize, Clone, Copy, Default)]
pub struct Defect {
    pub spherical_cavity: Option<SphericalCavity>,
    pub spherical_inclusion: Option<SphericalInclusion>,
    pub circular_crack: Option<CircularCrack>,
    pub spheroidal_cavity: Option<SpheroidalCavity>
}


#[derive(Serialize, Clone, Copy, Default)]
pub struct Calibration {
    pub diameter: f64,
    pub depth: f64
}


#[derive(Serialize, Clone, Copy, Default)]
pub struct Timegate {
    pub start: f64,
    pub end: f64,
    pub increment: f64
}

#[derive(Serialize)]
pub struct Top {
    pub columns: usize,
    pub rows: usize,
    pub samples: u32,
    pub amplitude: f32,
    pub content: Vec<Vector3>
}

#[derive(Serialize, Clone, Copy, Default)]
pub struct Metadata {
    pub wavespeeds: Wavespeeds,
    pub coordinates: Vector2Axis,
    pub probe: Probe,
    pub defect: Defect,
    pub calibration: Calibration,
    pub frequencies: f64,
    pub timegate: Timegate,
    pub accuracy: f64,
    pub max_output: f64 
}

impl Metadata {
    pub fn new() -> Self {
        Default::default()
    }

    pub fn set_shared_identifiers(&mut self, identifiers: &mut Vec<&Identifier>) -> Result<(), ()>  {
        shared::SHARED_IDENTIFIERS.iter().for_each(|i| identifiers.push(i));
        Ok(())
    }

    pub fn set_probe_identifiers(&mut self, data_path: &String, identifiers: &mut Vec<&Identifier>) -> Result<(), String> {
        let mut error: String = "None".to_string();

        match std::fs::read_to_string(&data_path) {
            Ok(contents) => {
                let swl_regex = Regex::new(r"(SV type with beam angle:|SH type with beam angle:|L type with beam angle:)").unwrap();
                let imm_regex = Regex::new(r"Immersion probe in a fluid with wave speed:").unwrap();

                match swl_regex.find(&contents) {
                    Some(_hit) => {
                        self.probe.wave_properties = Some(Default::default());
                        probes::swl::SWL_IDENTIFIERS.iter().for_each(|i| identifiers.push(i));
                    }
                    None => {}
                };

                match imm_regex.find(&contents) {
                    Some(_hit) => {
                        self.probe.immersion_properties = Some(Default::default());
                        probes::immersion::IMMERSION_IDENTIFIERS.iter().for_each(|i| identifiers.push(i));
                    }
                    None => {}
                };
            }
            Err(_e) => {
                error = "Failed to find file, or file is invalid".to_string();
            }
        }

        if error == "None" {
            Ok(())
        } else {
            Err(error)
        }
    }

    pub fn set_defect_identifiers(&mut self, data_path: &String, identifiers: &mut Vec<&Identifier>) -> Result<(), String> {
        let mut error: String = "None".to_string();

        match std::fs::read_to_string(&data_path) {
            Ok(contents) => {
                let spherical_cavity = Regex::new(r"Defect is a spherical cavity").unwrap().find(&contents);
                let elastic_sphere = Regex::new(r"Defect is an elastic sphere").unwrap().find(&contents);
                let circular_crack = Regex::new(r"Defect is a penny-shaped crack").unwrap().find(&contents);
                let spheroidal_cavity = Regex::new(r"Defect is a spheroidal cavity").unwrap().find(&contents);
                let rectangular_open_crack = Regex::new(r"Defect is a rectangular open crack").unwrap().find(&contents);
                let strip_like_open_crack = Regex::new(r"Defect is a strip-like open crack").unwrap().find(&contents);
                let strip_like_open_rough_crack = Regex::new(r"Defect is a strip-like open rough crack").unwrap().find(&contents);
                let side_drilled_hole = Regex::new(r"Defect is a side-drilled hole").unwrap().find(&contents);
                let surface_breaking_strip_like_open_crack = Regex::new(r"Defect is a surface-breaking strip-like open crack").unwrap().find(&contents);

                if spherical_cavity.is_some() {
                    self.defect.spherical_cavity = Some(Default::default());
                    defects::sc::DEFECT_SC_IDENTIFIERS.iter().for_each(|i| identifiers.push(i));
                }

                if elastic_sphere.is_some() {
                    self.defect.spherical_inclusion = Some(Default::default());
                    defects::esi::DEFECT_ESI_IDENTIFIERS.iter().for_each(|i| identifiers.push(i));
                }

                if circular_crack.is_some() {
                    self.defect.circular_crack = Some(Default::default());
                    defects::cc::DEFECT_CC_IDENTIFIERS.iter().for_each(|i| identifiers.push(i));
                }

                if spheroidal_cavity.is_some() {
                    self.defect.spheroidal_cavity = Some(Default::default());
                    defects::sphc::DEFECT_SPHC_IDENTIFIERS.iter().for_each(|i| identifiers.push(i));
                }

                if rectangular_open_crack.is_some() {

                }

                if strip_like_open_crack.is_some() {

                }

                if strip_like_open_rough_crack.is_some() {

                }

                if side_drilled_hole.is_some() {

                }

                if surface_breaking_strip_like_open_crack.is_some() {

                }
            }
            Err(_e) => {
                error = "Failed to find file, or file is invalid".to_string();
            }
        }

        if error == "None" {
            Ok(())
        } else {
            Err(error)
        }
    }
}

pub struct Identifier<'a> {
    pub id: &'a str,
    pub operation: fn(&mut Metadata, &mut Vec<f64>) -> (),
    pub regex: &'a str,
    pub fields: usize,
    pub max_offset: usize,
    pub optional: bool
}