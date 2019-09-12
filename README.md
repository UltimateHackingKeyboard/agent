![Agent logo & text](https://raw.githubusercontent.com/UltimateHackingKeyboard/agent/master/packages/uhk-web/src/assets/images/agent-logo-with-text.png)

[![Build Status](https://travis-ci.org/UltimateHackingKeyboard/agent.svg?branch=master)](https://travis-ci.org/UltimateHackingKeyboard/agent)
[![Build status](https://ci.appveyor.com/api/projects/status/4flvi969t4lgwwk6?svg=true)](https://ci.appveyor.com/project/mondalaci/agent)

Agent is the configuration application of the [Ultimate Hacking Keyboard](https://ultimatehackingkeyboard.com/).

* Try out the [web build of Agent](http://ultimatehackingkeyboard.github.io/agent/) in your browser. This is meant to be used for demonstration purposes.
* Download the [desktop build of Agent](https://github.com/UltimateHackingKeyboard/agent/releases) from our releases page. Use this if you have an actual UHK at hand, or else you won't get past the opening screen!

## Building the electron application

### Step 1: Build Dependencies

You'll need Node.js 12. Use your OS package manager to install it. [Check the NodeJS site for more info.](https://nodejs.org/en/download/package-manager/ "Installing Node.js via package manager") Mac OS users can simply `brew install node` to get both. Should you need multiple Node.js versions on the same computer, use Node Version Manager for [Mac/Linux](https://github.com/creationix/nvm) or for [Windows](https://github.com/coreybutler/nvm-windows)

You'll also need `libusb`.
On debian-based linux distros, `apt-get install libusb-dev libudev-dev g++` is sufficient.
On Mac OS, use `brew install libusb libusb-compat`.
For everyone else, use the appropriate package manager for your OS.

### Step 2: Build Environment

```
git clone git@github.com:UltimateHackingKeyboard/agent.git
cd agent
npm install
npm run build
npm run electron
```

At this point, Agent should be running on your machine.

## Developing the web application

- The frontend code is located in `packages/uhk-web/`
- Run the project locally with `npm run server:web`
- View the app at `http://localhost:8080`
- The app will automatically reload when you make changes

## Contributing

Wanna contribute? Please let us show you [how](CONTRIBUTING.md).
