#Changelog

##0.3.0-beta.7 (December 8, 2014)

- Updated JSDoc notation for optional parameters/properties.
- Added protection for NaN values passed through setOptions.
- Switched to console.error for error reporting.
- Added support for additive inverse operations.
- Switched to jshint.
- Added window, document and undefined to the function declaration.
- Updated packages.

##0.3.0-beta.6 (October 2, 2014)

- Fixed issue when clearing a canvas with no width/height attributes.
- Updated documentation to work with latest version of doxdox.

##0.3.0-beta.5 (July 24, 2014)

- Fix for offsetX/offsetY regression bug.
- Improved image offset support with regards to sprite wrapping.

##0.3.0-beta.4 (July 2, 2014)

- Fixed bug introduced in 0.3.0-beta.3 with text wrapping in Facade.Text.

##0.3.0-beta.3 (July 2, 2014)

- Performance updates.
- Documentation updates.

###Bug Fixes

- Fixed issue found in Firefox where drawImage would scale to fill if offsetX or offsetY cropped the image to only render a subset of the image's width and/or height.
- Fixed issue where fillStyle would be applied to Facade.Text even when empty.
- Fixed issue where Facade.Text.setText wouldn't store the new value in the `value` property.

###New Features

- Facade.Image: Added sprite wrapping.

###Deprecated

- Facade.Entity: `shadowBlur`, `shadowColor`, `shadowOffsetX`, `shadowOffsetY`.

##0.3.0-beta.2 (June 15, 2014)

- Fixed issues with importing through [requirejs](http://requirejs.org/) and [node](http://nodejs.org/).

##0.3.0-beta (June 9, 2014)

- Initial public release.
