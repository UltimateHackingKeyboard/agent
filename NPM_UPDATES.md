We get requests from time to time to update our NPM dependencies because they contain vulnerabilities according to `npm audit`. Such issues will be closed without further consideration due to the following reasons:

1. Usually, the affected packages are not runtime dependencies of Agent, but devDependencies which are only needed for developing Agent.
2. Often times, 3rd party packages are affected by vulnerabilities which we cannot fix.
3. We can't just blindly update all of the packages because that'd likely break Agent as it has happened in the past. Each of the updates must be carefully tested, and we don't have the manpower to do it on a daily basis.
4. Sometimes `npm audit` signals false vulnerabilities.

We routinely update our dependencies on a best effort basis.
