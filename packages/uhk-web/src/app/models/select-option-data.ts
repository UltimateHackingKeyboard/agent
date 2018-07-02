export interface SelectOptionData {
    id: string;
    text: string;
    disabled?: boolean;
    children?: Array<SelectOptionData>;
    additional?: any;
}
