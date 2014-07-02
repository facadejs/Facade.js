#Contributing

##Reporting Issues

If you have found a bug in Facade.js please consider the following when submitting an issue:

- **Search existing [GitHub Issues](https://github.com/facadejs/Facade.js/issues)** - The bug you are experiencing might have already been reported or even fixed in an unreleased version of Facade.js so be sure to review both [open](https://github.com/facadejs/Facade.js/issues?state=open) and [closed](https://github.com/facadejs/Facade.js/issues?state=closed) issues.
- **Create a reproducible test case** - To make it easier for maintainers to validate the issue please include a live demo on either [JSFiddle](http://jsfiddle.net/) or [jsbin](http://jsbin.com/).
- **Include relevant information** - Include clear steps to reproduce the issue as well as your browser and OS.

##Pull Requests

Before submitting a pull request, be sure that the following requirements are meet:

- The pull request aligns with the [goals](#goals) of core Facade.js.
- Additional tests have been added to validate the changes.
- Relevant documentation has been added.
- The build passes.
- There are no jslint errors using the included `.jslintrc` configuration.
- Pull Requests are sent to the `edge` branch.
- No minified code has been committed.

##Goals

- The first and foremost goal of Facade.js is to provide a simple API for making reusable shape, text and image objects for use within HTML5 canvas.
- Second is for this library to have a very small footprint.
- Third is that the codebase should be easily digestible for referential and educational purposes.
- Fourth is that Facade.js is easily extensible through the use of third party built plugins. These plugins should fill in the gaps that aren't covered by core functionality.

##Code Style

- Use semicolons.
- Soft indent with 4 spaces.
- Always use camelCase.
- Prefer `'` over `"`.
- `'use strict';`
- Prefer strict equals `===` unless type coercion is needed.
- No trailing whitespace.
- Maintain newline at EOF.

##License

By contributing to Facade.js or any of it's sibling projects you agree that your contributions fall under the same license, [The MIT License (MIT)](LICENSE).
