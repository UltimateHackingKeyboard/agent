import { Macro } from 'uhk-common';

export function parseStatusBuffer(macros: Macro[], statusBuffer: string): string {
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
    if (lines.length !== 4) {
        return block;
    }

    const line0Result = /^(Error at |Warning at )(.*) (\d+)\/(\d+)\/(\d+):/.exec(lines[0]);
    const macroName = line0Result[2];

    if (!macroName) {
        return null;
    }

    const macro = macros.find(macro => macro.name === macroName);

    if (!macro)
        return block;

    const macroActionIndex = parseInt(line0Result[3], 10);
    const lineNr = parseInt(line0Result[4], 10);
    const columnNr = parseInt(line0Result[5], 10);

    const line1Result = /^(> \d* \| )(.*)/.exec(lines[1]);
    const url = `#/macro/${macro.id}?actionIndex=${macroActionIndex}&lineNr=${lineNr}&columnNr=${columnNr}`;
    const newLine2 = `${line1Result[1]}<a href="${url}">${line1Result[2]}</a>`;

    return `${lines[0]}\n${newLine2}\n${lines[2]}\n`;
}
