import { tree } from "./tree"
import { convertAutoElementsToISHA, convertFocusAndTechniqueToIMODE, convertNFRToLP } from "./utDefUtils"

export function constructTransversalyIsoData(data, misc) {

}

export function constructOrthotropicData(data, misc) {

}

export function constructIsoSaveData(data, misc) {
    let obj = {}

    // Automatic assignment using tree
    const recurse = async(t, d) => {
        for (const [k, v] of Object.entries(t)) { 
            if (v.type == "Expandable") { 
                recurse(v.children, d[k])
            } else {
                let identityType = v.identity[0]
                let identityIdx = v.identity[1]
                
                if (identityType != null && identityIdx == null) {
                    assignDataValueFromTree(v.type, d[k].value, v.divisor, obj, v.identity)
                } else if (identityType != null && identityIdx != null) {
                    if (typeof obj[identityType] != 'object') {
                        obj[identityType] = [null, null]
                    } 

                    assignArrayDataFromTree(v.type, d[k].value, v.divisor, obj, v.identity)
                }
            }
        }
    }
    recurse(tree.children, data)

    // Manual definition(s) requiring explicit conversions
    obj["LP"] = convertNFRToLP(data.transmitter.spectrum.stype.value)
    obj["IMODE"] = [
        convertFocusAndTechniqueToIMODE(data.transmitter.focus.ftype.value, data.method.utTechnique.transmitter.value),
        convertFocusAndTechniqueToIMODE(data.receiver.focus.ftype.value, data.method.utTechnique.receiver.value)
    ]
    obj["ISHA"] = [
        convertAutoElementsToISHA(data.transmitter.shapeAndElements.autoNumElements.value,
            data.transmitter.shapeAndElements.shape.value), 
        convertAutoElementsToISHA(data.receiver.shapeAndElements.autoNumElements.value,
            data.receiver.shapeAndElements.shape.value)
    ]

    let isBackwallEnabled = data.defect.surfaces.backwall.enabled.value
    let isRoughnessEnabled = data.defect.surfaces.roughness.enabled.value

    if (isBackwallEnabled && isRoughnessEnabled && (obj["LDTY"] == 5 || obj["LDTY"] == 7)) {
        obj["LDTY"] += 30
    } else if (!isBackwallEnabled && isRoughnessEnabled && (obj["LDTY"] == 5 || obj["LDTY"] == 7)) {
        obj["LDTY"] += 20
    } else if (isBackwallEnabled && (obj["LDTY"] >= 1 && obj["LDTY"] <= 7)) {
        obj["LDTY"] += 10
    }

    if (obj["LDTY"] == 1 || obj["LDTY"] == 2 || obj["LDTY"] == 3 || obj["LDTY"] == 8 ||
        obj["LDTY"] == 11 || obj["LDTY"] == 12 || obj["LDTY"] == 13) {
        obj["DA"] = data.defect.specification.measurement.diameter.value
    } else if (obj["LDTY"] == 7 || obj["LDTY"] == 17 || obj["LDTY"] == 19 || obj["LDTY"] == 27 ||
        obj["LDTY"] == 37) {
        obj["DA"] = data.defect.specification.measurement.height.value
    } else if (obj["LDTY"] == 4 || obj["LDTY"] == 14) {
        obj["DA"] = data.defect.specification.measurement.diameterParallel.value
    }

    obj["NDE"] = [0, 0]
    obj["DEIXYT"] = []
    obj["DEIXYR"] = []
    obj["DET"] = false
    obj["DER"] = false

    // Misc data
    obj["IA"] = misc.accuracy

    return obj
}

function assignDataValueFromTree(type, value, divisor, obj, identity) {
    if (type == 'Number') {
        obj[identity[0]] = value / divisor
    } else if (type == 'Checkbox') {
        obj[identity[0]] = value == true ? 1 : 0
    } else if (type == 'Dropdown') {
        obj[identity[0]] = value
    }
}

function assignArrayDataFromTree(type, value, divisor, obj, identity) {
    if (type == 'Number') {
        obj[identity[0]][identity[1]] = value / divisor
    } else if (type == 'Checkbox') {
        obj[identity[0]][identity[1]] = value == true ? 1 : 0
    } else if (type == 'Dropdown') {
        obj[identity[0]][identity[1]] = value
    }
}