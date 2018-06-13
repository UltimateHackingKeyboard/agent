import { isEqual } from 'lodash';

export const isEqualArray = (arr1: Array<any>, arr2: Array<any>): boolean => {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (const a of arr1) {
        if (!arr2.some(b => isEqual(a, b))) {
            return false;
        }
    }

    return true;
};
