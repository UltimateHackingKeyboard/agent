class TypeChecker {

    static firstValidScancode = 1;
    static lastValidScancode = 231;

    static isUInt8Valid(uint8: number): boolean {
        return 0 <= uint8 && uint8 <= 255;
    }

    static isScancodeValid(scancode: number): boolean {
        return TypeChecker.firstValidScancode <= scancode && scancode <= TypeChecker.lastValidScancode;
    }
}
