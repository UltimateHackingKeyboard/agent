# Signing the CLA

Before contributing to this project, you must sign [the CLA](/cla/cla-1.0.0.md).

To sign the CLA, add your GitHub username to the end of the CLA. Make sure that the usernames remain alphabetically sorted.

Then create a pull request with the title:

> Sign CLA

and with the body:

> I have read the Agreement, and fully agree to it by signing it with my GitHub username.

# Bug reports

If the build process fails, please open a [new issue](https://github.com/UltimateHackingKeyboard/agent/issues/new) containing the complete build log.

If the build process succeeds but Agent fails at runtime, it's most likely due to a JavaScript error. In this case, please open a [new issue](https://github.com/UltimateHackingKeyboard/agent/issues/new) containing the error displayed by the JavaScript console.

# Contributing instructions

Contributors are most welcome and appreciated beyond words!

1. Please pick an [issue](https://github.com/UltimateHackingKeyboard/agent/issues) of your interest, or open a new one.
2. Let us know in the issue what you're about to do.
3. We let you know if somebody is already working on the issue, and thank you for being awesome for considering to contribute.
4. Send a pull request of your contribution. You're welcome to send the PR early on even if it's incomplete. This way, we'll be able to provide early feedback which will save time for everyone involved.
5. Fix your PR if needed, and make sure that it passes continuous integration tests. If everything looks good we'll merge your PR, and pop a bottle of champagne to celebrate you!

## Add icon to uhk-icon set

1. Copy svg file(s) to packages/uhk-web/src/svgs/icons folder
2. run `$ npm run sprites`

The icon available as .uhk-icon-<filename without extension> css selector.

