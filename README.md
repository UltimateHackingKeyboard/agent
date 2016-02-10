# Ultimate Hacking Keyboard - Agent mockups

Contains HTML, CSS and JS source of the Agent mockups.

They serve a double purpose:
1. easy and flexible usage of the actual Bootstrap components
2. test some basic interaction patterns by clicking around the main UI elements.

## See it!
* [Key action editor](http://ultimatehackingkeyboard.github.io/agent-mockup/index.html)
* [Macro editor](http://ultimatehackingkeyboard.github.io/agent-mockup/macro.html)
* [Application UI](http://ultimatehackingkeyboard.github.io/agent-mockup/app.html)

## Try it!
If you want to see it on your screen follow this guide:

Clone this repository
```
git clone git@github.com:UltimateHackingKeyboard/agent-mockup.git
cd agent-mockup
```

Install bower
```
npm install -g bower
```

Get libraries used by the project
```
bower install
```

### Additional information
In the repository you find a `gulpfile.js` for running [browsersync](https://www.browsersync.io/), which speeds up our prototyping process. If you want to use it just run `npm install` in the project directory, then you can fire it up with `gulp serve`.
