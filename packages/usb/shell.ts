#!/usr/bin/env -S node --loader ts-node/esm --no-warnings=ExperimentalWarning

import * as readline from 'node:readline';
import Uhk, { errorHandler, yargs } from './src/index.js';
import { Buffer } from 'uhk-common';

// Mirrors right/src/usb_protocol_handler.h.
const UsbCommandId_GetVariable = 0x12;
const UsbCommandId_SetVariable = 0x13;
const UsbCommandId_ExecShellCommand = 0x1e;
const UsbVariable_ShellEnabled = 0x07;
const UsbVariable_ShellBuffer = 0x08;

// UsbCommand_GetVariable answers into a USB_COMMAND_BUFFER_LENGTH (63) byte report with the
// payload at offset 1, so one read yields at most 62 bytes.
const CHUNK_SIZE = 62;

// UsbCommand_ExecShellCommand null-terminates at index USB_COMMAND_BUFFER_LENGTH - 1 (62), so
// the command plus its newline occupies bytes 1..61.
const MAX_COMMAND_LENGTH = 60;

// ShellUartTransport_InjectInput only appends the submitting newline when the device's
// StripVt100 flag happens to be set, so the command is typed but never executed otherwise.
// Sending our own is harmless either way - a second one just redraws the prompt.
const SUBMIT = '\n';

const argv = yargs
    .scriptName('./shell.ts')
    .usage('Device shell over USB: streams the firmware log to stdout and sends each line of '
        + 'stdin to the device shell.\n\n'
        + 'Examples:\n'
        + '  ./shell.ts                                  # just follow the log, Ctrl-C to stop\n'
        + '  ./shell.ts uhk uartStats                    # run that, then keep following\n'
        + '  ./shell.ts --exit-on-idle 500 uhk uartStats # ... and exit once the log goes quiet\n'
        + '  echo "uhk threads" | ./shell.ts --exit-on-idle 500')
    .option('idle-poll', {
        type: 'number',
        default: 20,
        description: 'Milliseconds to wait before re-reading once the device buffer runs dry',
    })
    .option('exit-on-idle', {
        type: 'number',
        default: 0,
        description: 'Once stdin is closed, exit after the log has been quiet this many ms. '
            + '0 keeps following forever.',
    })
    .option('enable-sink', {
        type: 'boolean',
        default: true,
        description: 'Turn the USB log sink on first. The setting is persistent, so '
            + '--no-enable-sink leaves it alone (and prints nothing if the sink is off).',
    })
    .option('color', {
        type: 'boolean',
        default: undefined,
        description: 'Keep the log\'s VT100 colouring. Defaults to on when stdout is a '
            + 'terminal and off when it is a pipe or a file.',
    })
    .argv;

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// A complete CSI sequence, and the longest prefix of one that could still be completed by
// bytes that have not arrived yet. Reads are 62 bytes wide, so a sequence can straddle two of
// them; an incomplete tail is carried over rather than printed as garbage.
const VT100_SEQUENCE = /\x1b\[[0-9;?]*[ -\/]*[@-~]/g;
const VT100_PARTIAL_TAIL = /\x1b(\[[0-9;?]*[ -\/]*)?$/;

// Longest sequence we are willing to hold back before deciding it is not an escape after all.
const VT100_MAX_CARRY = 16;

function makeVt100Stripper(): (chunk: Buffer) => Buffer {
    let carry = '';

    return chunk => {
        // latin1 round-trips bytes exactly, so anything that is not a CSI sequence - UTF-8
        // included - comes back out unchanged.
        const text = carry + chunk.toString('latin1');
        const partial = text.match(VT100_PARTIAL_TAIL);
        const holdBack = partial !== null && partial[0].length <= VT100_MAX_CARRY;

        carry = holdBack ? partial[0] : '';
        const body = holdBack ? text.slice(0, text.length - carry.length) : text;

        return Buffer.from(body.replace(VT100_SEQUENCE, ''), 'latin1');
    };
}

// UsbLogBuffer_Consume only writes a terminating zero when it had fewer than CHUNK_SIZE bytes
// to give, so a full chunk carries no terminator and every byte of it is log text.
function payloadLength(response: Buffer): number {
    let length = 0;
    while (length < CHUNK_SIZE && response[1 + length] !== 0) {
        length++;
    }
    return length;
}

try {
    const pending: string[] = [];
    let stdinClosed = false;
    let idleMs = 0;

    const initialCommand = argv._.map(arg => String(arg)).join(' ');
    if (initialCommand.length > 0) {
        pending.push(initialCommand);
    }

    // Line-buffered rather than raw, so a command only goes out once it is complete. Device
    // access all happens in the loop below, so nothing here touches the device directly.
    readline.createInterface({ input: process.stdin })
        .on('line', line => {
            if (line.trim().length > 0) {
                pending.push(line);
            }
        })
        .on('close', () => {
            stdinClosed = true;
        });

    const { device } = Uhk(argv);

    if (argv.enableSink) {
        await device.write(Buffer.from([UsbCommandId_SetVariable, UsbVariable_ShellEnabled, 1]));
    }

    const readCommand = Buffer.from([UsbCommandId_GetVariable, UsbVariable_ShellBuffer]);
    const keepColor = argv.color === undefined ? process.stdout.isTTY === true : argv.color;
    const stripVt100 = makeVt100Stripper();
    let running = true;

    while (running) {
        while (pending.length > 0) {
            const command = pending.shift() as string;
            const encoded = Buffer.from(command + SUBMIT, 'utf8');

            if (encoded.length > MAX_COMMAND_LENGTH) {
                process.stderr.write(`skipped: command is ${command.length} bytes, the device `
                    + `accepts at most ${MAX_COMMAND_LENGTH}\n`);
            } else {
                await device.write(
                    Buffer.concat([Buffer.from([UsbCommandId_ExecShellCommand]), encoded]));
            }
        }

        const response = await device.write(readCommand);
        const length = payloadLength(response);

        if (length > 0) {
            // Bytes rather than a decoded string, so the log passes through untouched when
            // colour is kept. (`uhk log stripVt100 1` strips on the device instead, for
            // consumers that cannot.)
            const payload = response.subarray(1, 1 + length);
            process.stdout.write(keepColor ? payload : stripVt100(payload));
            idleMs = 0;
        } else {
            await sleep(argv.idlePoll);
            idleMs += argv.idlePoll;
            running = !(stdinClosed && argv.exitOnIdle > 0 && idleMs >= argv.exitOnIdle);
        }
    }
} catch (error) {
    await errorHandler(error);
}
