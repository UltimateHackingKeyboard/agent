/**
 * Render a chunk so every control/whitespace byte is visible in the log. Printable chars pass
 * through; common controls get named escapes (\r \n \t \e), everything else control-range
 * becomes \xNN, and the chunk is wrapped in ⟦…⟧ so leading/trailing spaces are obvious.
 */
export function escapeZephyrControlChars(input: string): string {
    let out = '';
    for (const ch of input) {
        const code = ch.charCodeAt(0);
        switch (ch) {
            case '\x1b': out += '\\e'; break;
            case '\r': out += '\\r'; break;
            case '\n': out += '\\n'; break;
            case '\t': out += '\\t'; break;
            case '\\': out += '\\\\'; break;
            default:
                out += code < 0x20 || code === 0x7f
                    ? '\\x' + code.toString(16).padStart(2, '0')
                    : ch;
        }
    }

    return out;
}
