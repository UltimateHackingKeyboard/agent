![Agent logo & text](https://raw.githubusercontent.com/UltimateHackingKeyboard/agent-mockup/master/images/agent-logo-with-text.png)

[![Build Status](https://travis-ci.org/UltimateHackingKeyboard/agent.svg?branch=master)](https://travis-ci.org/UltimateHackingKeyboard/agent)

Agent is the configuration application of the [Ultimate Hacking Keyboard](https://ultimatehackingkeyboard.com/).

Agent is in a preliminary state. You can click around, and most interactions will loosely work, but the application is not production ready yet. Agent is being ported to Angular 2 after which its features will actually fully work as expected.

[Give it a whirl!](http://ultimatehackingkeyboard.github.io/agent/)

## Set up instructions

Prerequisite: Install Node.js <br/>
Verify that you are running at least node v4.x.x and npm 3.x.x by running node -v and npm -v in a terminal/console window. Older versions produce errors.

```
git clone git@github.com:UltimateHackingKeyboard/agent.git
cd agent
npm install
npm run build
npm run webpack-dev-server
```

The agent will be hosted on `localhost:8080`.

## Contribute

Contributions are most welcome! Please always try to be as consistent as possible. Always run `npm run lint` and resolve lint warnings before every commit.
