export function convertNFRToLP(n) {
    switch(n)
    {
        case 0:
        case -1:
            return 1
        case 1: 
            return 3
    }

    return 0
}

export function convertFocusAndTechniqueToIMODE(focusType, technique) {
    if (technique < 0) {
        return technique + focusType
    } else {
        return technique - focusType
    }
}

export function convertAutoElementsToISHA(autoNumElements, isha) {
    if (!autoNumElements) {
        return isha
    } else {
        return -isha
    }
}