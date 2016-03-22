![Agent logo & text](https://raw.githubusercontent.com/UltimateHackingKeyboard/agent-mockup/master/images/agent-logo-with-text.png)

Agent is the configuration application of the [Ultimate Hacking Keyboard](https://ultimatehackingkeyboard.com/).

Right now, Agent is in a mockup state, which basically means that you can click around, and most interactions will loosely work, but the application is not production ready yet. We're experimenting with the UI, and UX until the imminent Angular 2 port.

What are you waiting for? [Give it a whirl](http://ultimatehackingkeyboard.github.io/agent-mockup/)!

## Set up instructions

Clone this repository:

```
git clone git@github.com:UltimateHackingKeyboard/agent-mockup.git
cd agent-mockup
```

Install bower:

```
npm install -g bower
```

Get libraries used by the project:

```
bower install
```

### Additional information

In the repository you find a `gulpfile.js` for running [browsersync](https://www.browsersync.io/), which speeds up our development process. If you want to use it just run `npm install` in the project directory, then you can fire it up with `gulp serve`.
