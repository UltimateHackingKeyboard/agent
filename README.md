![Agent logo & text](https://raw.githubusercontent.com/UltimateHackingKeyboard/agent-mockup/master/images/agent-logo-with-text.png)

Agent is the configuration application of the [Ultimate Hacking Keyboard](https://ultimatehackingkeyboard.com/).

Agent is in a preliminary state. You can click around, and most interactions will loosely work, but the application is not production ready yet. Agent is being ported to Angular 2 after which its features will actually fully work as expected.

[Give it a whirl!](http://ultimatehackingkeyboard.github.io/agent/)

## Set up instructions

```
git clone git@github.com:UltimateHackingKeyboard/agent.git
cd agent
npm install
```

In the repository you can find a `gulpfile.js` for running [browsersync](https://www.browsersync.io/), which speeds up the development process. You can fire it up with `gulp serve`.

## Contribute

Contributions are most welcome! Please always try to be as consistent as possible. Always run `npm run lint` and resolve lint warnings before every commit.
