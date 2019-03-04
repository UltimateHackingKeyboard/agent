export interface LastEditedKey {
    moduleId: number;
    key: string;
}

export const defaultLastEditKey = (): LastEditedKey => ({
    moduleId: -1,
    key: ''
});
