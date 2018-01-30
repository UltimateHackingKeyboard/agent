require('shelljs/global');

const exp = {
}

Object.keys(exp).forEach(function (cmd) {
  global[cmd] = exp[cmd];
});
