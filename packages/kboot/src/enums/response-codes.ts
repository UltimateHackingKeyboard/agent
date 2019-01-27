export enum ResponseCodes {
    // Generic status codes.
    Success = 0,
    Fail = 1,
    ReadOnly = 2,
    OutOfRange = 3,
    InvalidArgument = 4,

    // Flash driver errors.
    FlashSizeError = 100,
    FlashAlignmentError = 101,
    FlashAddressError = 102,
    FlashAccessError = 103,
    FlashProtectionViolation = 104,
    FlashCommandFailure = 105,
    FlashUnknownProperty = 106,

    // I2C driver errors.
    I2C_SlaveTxUnderrun = 200,
    I2C_SlaveRxOverrun = 201,
    I2C_AribtrationLost = 202,

    // SPI driver errors.
    SPI_SlaveTxUnderrun = 300,
    SPI_SlaveRxOverrun = 301,

    // QuadSPI driver errors
    QSPI_FlashSizeError = 400,
    QSPI_FlashAlignmentError = 401,
    QSPI_FlashAddressError = 402,
    QSPI_FlashCommandFailure = 403,
    QSPI_FlashUnknownProperty = 404,
    QSPI_NotConfigured = 405,
    QSPI_CommandNotSupported = 406,

    // Bootloader errors.
    UnknownCommand = 10000,
    SecurityViolation = 10001,
    AbortDataPhase = 10002,
    PingError = 10003,
    NoResponse = 10004,
    NoResponseExpected = 10005,

    // SB loader errors.
    RomLdrSectionOverrun = 10100,
    RomLdrSignature = 10101,
    RomLdrSectionLength = 10102,
    RomLdrUnencryptedOnly = 10103,
    RomLdrEOFReached = 10104,
    RomLdrChecksum = 10105,
    RomLdrCrc32Error = 10106,
    RomLdrUnknownCommand = 10107,
    RomLdrIdNotFound = 10108,
    RomLdrDataUnderrun = 10109,
    RomLdrJumpReturned = 10110,
    RomLdrCallFailed = 10111,
    RomLdrKeyNotFound = 10112,
    RomLdrSecureOnly = 10113,

    // Memory interface errors.
    MemoryRangeInvalid = 10200,
    MemoryReadFailed = 10201,
    MemoryWriteFailed = 10202,

    // Property store errors.
    UnknownProperty = 10300,
    ReadOnlyProperty = 10301,
    InvalidPropertyValue = 10302,

    // Property store errors.
    AppCrcCheckPassed = 10400,
    AppCrcCheckFailed = 10401,
    AppCrcCheckInactive = 10402,
    AppCrcCheckInvalid = 10403,
    AppCrcCheckOutOfRange = 10404,
}
