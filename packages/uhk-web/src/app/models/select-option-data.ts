export interface SelectOptionData {
    id?: string;
    text: string;
    disabled?: boolean;
    children?: Array<SelectOptionData>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    additional?: any;
}
