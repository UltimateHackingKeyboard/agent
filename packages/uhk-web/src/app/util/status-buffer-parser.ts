import { Macro } from 'uhk-common';
import { escapeHtml } from './escape-html';

export function parseStatusBuffer(macros: Macro[], statusBuffer: string): string {
    if (!statusBuffer) {
        return '';
    }

    return splitToErrorBlocks(statusBuffer)
        .map(block => transformToErrorBlock(macros, block))
        .join('');
}

function splitToErrorBlocks(text: string): string[] {
    const errorBlocks = [];
    const lines = text.split('\n');
    let block = '';

    function addToErrorBlocks() {
        if (block) {
            errorBlocks.push(block);
        }
        block = '';
    }

    for (const line of lines) {
        if (line.startsWith('Error at ') || line.startsWith('Warning at ')) {
            addToErrorBlocks();
        }
        block += line + '\n';
    }
    addToErrorBlocks();

    return errorBlocks;
}

function transformToErrorBlock(macros: Macro[], block: string): any {
    const lines = block.split('\n');
    if (lines.length < 4) {
        return escapeHtml(block);
    }

    const line0Result = /^(Error at |Warning at )(.*) (\d+)\/(\d+)\/(\d+):/.exec(lines[0]);
    if (!line0Result) {
        return escapeHtml(block);
    }

    const macroName = line0Result[2];

    if (!macroName) {
        return null;
    }

    const macro = macros.find(macro => macro.name === macroName);

    if (!macro)
        return escapeHtml(block);

    const macroActionIndex = parseInt(line0Result[3], 10) - 1;
    const lineNr = parseInt(line0Result[4], 10);
    const columnNr = parseInt(line0Result[5], 10);

    const line1Result = /^(> \d* \| )(.*)/.exec(lines[1]);

    if (!line1Result || line1Result.length < 3) {
        return escapeHtml(block);
    }

    const url = `#/macro/${macro.id}?actionIndex=${macroActionIndex}&lineNr=${lineNr}&columnNr=${columnNr}&inlineEdit=true`;
    const newLine2 = `${escapeHtml(line1Result[1])}<a href="${url}">${escapeHtml(line1Result[2])}</a>`;

    return `${escapeHtml(lines[0])}\n${newLine2}\n${escapeHtml(lines[2])}\n`;
}
