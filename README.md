![Agent logo & text](https://raw.githubusercontent.com/UltimateHackingKeyboard/agent/master/packages/uhk-web/src/assets/images/agent-logo-with-text.png)

[![Build Status](https://travis-ci.org/UltimateHackingKeyboard/agent.svg?branch=master)](https://travis-ci.org/UltimateHackingKeyboard/agent)
[![Build status](https://ci.appveyor.com/api/projects/status/4flvi969t4lgwwk6?svg=true)](https://ci.appveyor.com/project/mondalaci/agent)

Agent is the configuration application of the [Ultimate Hacking Keyboard](https://ultimatehackingkeyboard.com/).

[Give it a whirl!](http://ultimatehackingkeyboard.github.io/agent/)

## Two builds to rule them all

It's worth mentioning that Agent has two builds.

The **electron build** is the desktop application which is meant to be used if you have an actual UHK at hand. It starts with an opening screen which detects your UHK. You cannot get past this screen without connecting a UHK via USB.

The **web build** is meant to be used for demonstation purposes, so people who don't yet own a UHK can get a feel of Agent and its capabilities in their browser. Eventually, WebUSB support will be added to the web build, making it able to communicate with the UHK. Given the sandboxed nature of browers, the web build will always lack features that the electron build offers, so this won't make the electron build obsolete.

The two builds share code as much as possible.

## Building the electron application

First up, make sure that node >=8.1.x and npm >=5.1.x are installed on your system. Next up:

```
# Execute the following line on Linux. Use relevant package manager and package names on non-Debian based distros.
apt-get install libusb-dev libudev-dev g++

git clone git@github.com:UltimateHackingKeyboard/agent.git
cd agent
npm install
npm run build:electron
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
