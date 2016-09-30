/*!
 * Facade.js v0.4.0-edge
 * https://github.com/facadejs/facade.js
 *
 * Copyright (c) 2015 Scott Doxey
 * Released under the MIT license
 */



/**
 * Creates a new Facade.js object with either a preexisting canvas tag or a unique name, width, and height.
 *
 * @example var stage = new Facade(document.querySelector('canvas'));
 * @example var stage = new Facade('stage', 500, 300);
 * @param {Object|String} [canvas] Reference to an HTML canvas element or a unique name.
 * @param {Integer} [width] Width of the canvas.
 * @param {Integer} [height] Height of the canvas.
 * @return {Object} New Facade.js object.
 * @public
 */

function Facade(canvas, width, height) {

    if (!(this instanceof Facade)) {

        return new Facade(canvas, width, height);

    }

}
