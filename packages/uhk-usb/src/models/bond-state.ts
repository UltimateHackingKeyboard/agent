export interface BondState {
    isPaired: boolean;
    /**
     * The peer rejected the bond (IsPaired response byte 2).
     */
    isBondBroken: boolean;
}
