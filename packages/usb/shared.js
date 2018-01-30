require('shelljs/global');

function getBlhostCmd(pid) {
    let blhostPath;
    switch (process.platform) {
        case 'linux':
            const arch = exec('uname -m', {silent:true}).stdout.trim();
            blhostPath = `linux/${arch}/blhost`;
            break;
        case 'darwin':
            blhostPath = 'mac/blhost';
            break;
        case 'win32':
            blhostPath = 'win/blhost.exe';
            break;
        default:
            echo('Your operating system is not supported.');
            exit(1);
            break;
    }

    return `${__dirname}/blhost/${blhostPath} --usb 0x1d50,0x${pid.toString(16)}`;
}

function execRetry(command) {
    let firstRun = true;
    let remainingRetries = 3;
    let code;
    do {
        if (!firstRun) {
            console.log(`Retrying ${command}`)
        }
        config.fatal = !remainingRetries;
        code = exec(command).code;
        config.fatal = true;
        firstRun = false;
    } while(code && --remainingRetries);
}

const exp = {
    getBlhostCmd,
    execRetry,
}

Object.keys(exp).forEach(function (cmd) {
  global[cmd] = exp[cmd];
});
