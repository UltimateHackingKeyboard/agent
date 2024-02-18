export enum LayerName {
    // base,
    mod,
    fn,
    mouse,
    fn2,
    fn3,
    fn4,
    fn5,
    shift,
    control,
    alt,
    super,
    // User config 5 extended layers. For backward compatibility, the base layer was 255 because mod was 1.
    // User config 7 reorganized the layers and the base layer is now 0.
    // We keep the old base layer for migration.
    base = 255
}
