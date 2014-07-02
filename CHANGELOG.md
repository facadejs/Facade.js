#Changelog

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
