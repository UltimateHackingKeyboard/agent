export interface LayerOption {
    id: number;
    name: string;
    order: number;
    selected: boolean;
    /**
     * Allowed to set as LayerSwitcher
     */
    allowed: boolean;
}
