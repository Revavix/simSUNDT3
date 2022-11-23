/*class TreeParameters extends Array {};
class TreeSelect extends Array {};
class TreeNumber extends Number {};
class TreeBool extends Boolean {};*/

export class TreeExpandable {
    label: string;
    paddingOff: boolean;
    value: object;
    disabled: boolean;
    expanded: boolean;

    constructor(name: string, list: object, paddingOff: boolean)
    {
        this.label = name;
        this.value = list;
        this.paddingOff = paddingOff;
        this.disabled = false;
        this.expanded = false;
    }
}

export class TreeNumber {
    label: string;
    value: number;
    disabled: boolean;

    constructor(name: string, num: number) {
        this.label = name;
        this.value = num;
        this.disabled = false;
    }
}

export class TreeBool {
    label: string;
    value: boolean;
    disabled: boolean;

    constructor(name: string, val: boolean) {
        this.label = name;
        this.value = val;
        this.disabled = false;
    }
}

export class TreeSelect {
    label: string;
    value: object;
    disabled?: boolean;
    selectedItem?: string;
    filters?: object;

    constructor(name: string, selectables: object) {
        this.label = name;
        this.value = selectables;
        this.disabled = false;
    }

    // Filters eg: {optionName: 'Isotropic', [object, object]}
    updateFilters() {

    }
}