import zlib from 'node:zlib';

export function createPNG(width: number, height: number, pixelData: Buffer<ArrayBuffer>): Buffer {
    // PNG signature
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    // IHDR chunk
    const ihdr = Buffer.alloc(25);
    ihdr.writeUInt32BE(13, 0); // Length
    ihdr.write('IHDR', 4);
    ihdr.writeUInt32BE(width, 8);
    ihdr.writeUInt32BE(height, 12);
    ihdr.writeUInt8(8, 16); // Bit depth
    ihdr.writeUInt8(2, 17); // Color type (RGB)
    ihdr.writeUInt8(0, 18); // Compression
    ihdr.writeUInt8(0, 19); // Filter
    ihdr.writeUInt8(0, 20); // Interlace

    // Calculate CRC for IHDR
    const ihdrCrc = crc32(ihdr.slice(4, 21));
    ihdr.writeUInt32BE(ihdrCrc, 21);

    // Prepare image data with filter bytes
    const scanlineLength = width * 3 + 1; // 3 bytes per pixel + 1 filter byte
    const imageData = Buffer.alloc(height * scanlineLength);

    for (let y = 0; y < height; y++) {
        const offset = y * scanlineLength;
        imageData[offset] = 0; // Filter type: None

        for (let x = 0; x < width; x++) {
            const pixelOffset = offset + 1 + x * 3;
            const dataOffset = (y * width + x) * 3;

            imageData[pixelOffset] = pixelData[dataOffset];     // R
            imageData[pixelOffset + 1] = pixelData[dataOffset + 1]; // G
            imageData[pixelOffset + 2] = pixelData[dataOffset + 2]; // B
        }
    }

    const compressed = zlib.deflateSync(imageData);

    // IDAT chunk
    const idat = Buffer.alloc(compressed.length + 12);
    idat.writeUInt32BE(compressed.length, 0);
    idat.write('IDAT', 4);
    compressed.copy(idat, 8);
    const idatCrc = crc32(idat.slice(4, 8 + compressed.length));
    idat.writeUInt32BE(idatCrc, 8 + compressed.length);

    // IEND chunk
    const iend = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);

    return Buffer.concat([signature, ihdr, idat, iend]);
}

function crc32(data: any): number {
    return zlib.crc32(data) >>> 0; // Convert to unsigned 32-bit
}
