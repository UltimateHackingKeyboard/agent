export function isBitSet(value: number, bitPosition: number): boolean {
    return (value & (1 << bitPosition)) !== 0;
}
