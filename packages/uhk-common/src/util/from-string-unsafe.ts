/**
 * Looks up an enum member by its name, e.g. fromStringUnsafe(MouseActionParam, 'leftClick') === MouseActionParam.leftClick.
 * Unchecked: returns undefined for an unknown name.
 */
export function fromStringUnsafe<E extends object>(enumObject: E, name: unknown): E[keyof E] | undefined {
    return enumObject[name as keyof E];
}
