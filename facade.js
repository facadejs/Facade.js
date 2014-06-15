/*!
 * Facade.js v0.3.0-beta
 * https://github.com/facadejs/facade.js
 *
 * Copyright (c) 2014 Scott Doxey
 * Released under the MIT license
 */

(function () {

    'use strict';

    var _requestAnimationFrame,
        _cancelAnimationFrame,
        _context,
        _contextProperties = [ 'fillStyle', 'font', 'globalAlpha', 'globalCompositeOperation', 'lineCap', 'lineJoin', 'lineWidth', 'miterLimit', 'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'strokeStyle', 'textAlign', 'textBaseline' ],
        _TO_RADIANS = Math.PI / 180,
        _OPERATOR_TEST = new RegExp('^[-+]=');

    if (String(typeof window) !== 'undefined') {

        _context = document.createElement('canvas').getContext('2d');

        /*!
         * requestAnimationFrame Support
         */

        ['webkit', 'moz'].forEach(function (key) {
            _requestAnimationFrame = _requestAnimationFrame || window.requestAnimationFrame || window[key + 'RequestAnimationFrame'] || null;
            _cancelAnimationFrame = _cancelAnimationFrame || window.cancelAnimationFrame || window[key + 'CancelAnimationFrame'] || null;
        });

    }

    /**
     * Checks an object to see if it's an array. Returns a boolean result.
     *
     *     console.log(isArray([1, 2, 3, 4, 5])); // true
     *     console.log(isArray({ x: 0, y: 0, width: 100, height: 100 })); // false
     *
     * @param {Object} obj The object to be tested.
     * @return {Boolean} Result of the test.
     * @api private
     */

    function isArray(obj) {

        return Object.prototype.toString.call(obj) === '[object Array]' ? true : false;

    }

    /**
     * Checks an object to see if it's a function. Returns a boolean result.
     *
     *     console.log(isFunction(this._draw)); // true
     *
     * @param {Object} obj The object to be tested.
     * @return {Boolean} Result of the test.
     * @api private
     */

    function isFunction(obj) {

        return Object.prototype.toString.call(obj) === '[object Function]' ? true : false;

    }

    /**
     * Creates a new Facade.js object with either a preexisting canvas tag or a unique name, width, and height.
     *
     *     var stage = new Facade(document.querySelector('canvas'));
     *     var stage = new Facade('stage', 500, 300);
     *
     * @property {Object} canvas Reference to the canvas element.
     * @property {Object} context Reference to the <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D" target="_blank">CanvasRenderingContext2D</a> object.
     * @property {Integer} dt Current time in milliseconds since last canvas draw.
     * @property {Integer} fps Current frames per second.
     * @property {Integer} ftime Time of last canvas draw.
     * @param {Object|String?} canvas Reference to an HTML canvas element or a unique name.
     * @param {Integer?} width Width of the canvas.
     * @param {Integer?} height Height of the canvas.
     * @return {Object} New Facade.js object.
     * @api public
     */

    function Facade(canvas, width, height) {

        if (!(this instanceof Facade)) {

            return new Facade(canvas, width, height);

        }

        this.dt = null;
        this.fps = null;
        this.ftime = null;

        this._callback = null;

        this._requestAnimation = null;

        this._width = null;
        this._height = null;

        if (canvas && typeof canvas === 'object' && canvas.nodeType === 1) {

            this.canvas = canvas;

        } else {

            this.canvas = document.createElement('canvas');

            if (typeof canvas === 'string') {

                this.canvas.setAttribute('id', canvas);

            }

        }

        if (width && height) {

            this.width(width);
            this.height(height);

        } else {

            this._width = parseInt(this.canvas.getAttribute('width'), 10);
            this._height = parseInt(this.canvas.getAttribute('height'), 10);

        }

        try {

            this.context = this.canvas.getContext('2d');

        } catch (e) {

            throw new Error('Object passed to Facade.js was not a valid canvas element.');

        }

    }

    /**
     * Draws a Facade.js entity (or multiple entities) to the stage.
     *
     *     stage.addToStage(circle);
     *
     * @param {Object|Array} obj Facade.js entity or an array of entities.
     * @param {Object} options Temporary options for rendering a Facade.js entity (or multiple entities).
     * @return {Object} Facade.js object.
     * @api public
     */

    Facade.prototype.addToStage = function (obj, options) {

        var i,
            length;

        if (obj instanceof Facade.Entity) {

            obj.draw(this, options);

        } else if (isArray(obj)) {

            for (i = 0, length = obj.length; i < length; i = i + 1) {

                this.addToStage(obj[i], options);

            }

        } else {

            throw new Error('Object passed to Facade.addToStage is not a valid Facade.js entity.');

        }

        return this;

    };

    /**
     * Clears the canvas.
     *
     *      stage.clear();
     *
     * @return {Object} Facade.js object.
     * @api public
     */

    Facade.prototype.clear = function () {

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        return this;

    };

    /**
     * Sets a callback function to run in a loop using <a href="https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame" target="_blank">requestAnimationFrame</a> or available polyfill.
     *
     *     stage.draw(function () {
     *
     *         this.clear();
     *
     *         this.addToStage(circle, { x: 100, y: 100 });
     *
     *     });
     *
     * @param {Function} callback Function callback.
     * @return {Object} Facade.js object.
     * @api public
     */

    Facade.prototype.draw = function (callback) {

        if (typeof callback === 'function') {

            this._callback = callback;

            this.start();

        } else {

            throw new Error('Parameter passed to Facade.draw is not a valid function');

        }

        return this;

    };

    /**
     * Exports a base64 encoded representation of the current rendered canvas.
     *
     *     console.log(stage.exportBase64('image/png', 100));
     *
     * @param {String?} type Image format: <code>image/png</code> (Default), <code>image/jpeg</code>, <code>image/webp</code> (Google Chrome Only)
     * @param {Integer?} quality Number between 0 and 100.
     * @return {String} Base64 encoded string.
     * @api public
     */

    Facade.prototype.exportBase64 = function (type, quality) {

        if (!type) {

            type = 'image/png';

        }

        if (typeof quality === 'number') {

            quality = quality / 100;

        } else {

            quality = 1;

        }

        return this.canvas.toDataURL(type, quality);

    };

    /**
     * Gets and sets the canvas height.
     *
     *     console.log(stage.height()); // 300
     *     console.log(stage.height(600)); // 600
     *
     * @param {Integer?} height Height in pixels.
     * @return {Integer} Height in pixels.
     * @api public
     */

    Facade.prototype.height = function (height) {

        if (height) {

            this._height = parseInt(height, 10);

            if (this.canvas.hasAttribute('data-resized-for-hdpi')) {

                this.resizeForHDPI();

            } else {

                this.canvas.setAttribute('height', this._height);

            }

        }

        return this._height;

    };

    /**
     * Applies key-value pairs to appropriate <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D" target="_blank">CanvasRenderingContext2D</a> properties and methods.
     *
     *     stage.renderWithContext({ fillStyle: '#f00', globalAlpha: 0.5, fillRect: [ 0, 0, 100, 100 ]});
     *
     * @param {Object} options Object containing context property and/or method names with corresponding values.
     * @param {Function?} callback Function to be called when context options have been rendered to the canvas.
     * @return {void}
     * @api public
     */

    Facade.prototype.renderWithContext = function (options, callback) {

        var key;

        this.context.save();

        for (key in options) {

            if (options[key] !== undefined) {

                if (isArray(options[key]) && isFunction(this.context[key])) {

                    this.context[key].apply(this.context, options[key]);

                } else if (_contextProperties.indexOf(key) !== -1) {

                    this.context[key] = options[key];

                }

            }

        }

        if (callback) {

            callback.call(null, this);

        }

        this.context.restore();

    };

    /**
     * Resizes the canvas width and height to be multiplied by the pixel ratio of the device to allow for sub-pixel aliasing. Canvas tag maintains original width and height through CSS. Must be called before creating/adding any Facade entities as scaling is applied to the canvas context.
     *
     *     stage.resizeForHDPI();
     *     stage.resizeForHDPI(2);
     *
     * @param {Integer?} ratio Ratio to scale the canvas.
     * @return {Object} Facade.js object.
     * @api public
     */

    Facade.prototype.resizeForHDPI = function (ratio) {

        if (ratio === undefined) {

            ratio = window.devicePixelRatio;

        } else {

            ratio = parseFloat(ratio);

        }

        if (ratio > 1) {

            this.canvas.setAttribute('style', 'width: ' + this.width() + 'px; height: ' + this.height() + 'px;');

            this.canvas.setAttribute('width', this.width() * ratio);
            this.canvas.setAttribute('height', this.height() * ratio);

            this.context.scale(ratio, ratio);

            this.canvas.setAttribute('data-resized-for-hdpi', true);

        }

        return this;

    };

    /**
     * Starts the callback supplied in <code>Facade.draw</code>.
     *
     *     stage.start();
     *
     * @return {Object} Facade.js object.
     * @api public
     */

    Facade.prototype.start = function () {

        this._requestAnimation = _requestAnimationFrame(this._animate.bind(this));

        return this;

    };

    /**
     * Stops the callback supplied in <code>Facade.draw</code>.
     *
     *     stage.stop();
     *
     * @return {Object} Facade.js object.
     * @api public
     */

    Facade.prototype.stop = function () {

        this.dt = null;
        this.fps = null;
        this.ftime = null;

        _cancelAnimationFrame(this._requestAnimation);

        this._requestAnimation = null;

        return this;

    };

    /**
     * Gets and sets the canvas width.
     *
     *     console.log(stage.width()); // 400
     *     console.log(stage.width(800)); // 800
     *
     * @param {Integer?} width Width in pixels.
     * @return {Integer} Width in pixels.
     * @api public
     */

    Facade.prototype.width = function (width) {

        if (width) {

            this._width = parseInt(width, 10);

            if (this.canvas.hasAttribute('data-resized-for-hdpi')) {

                this.resizeForHDPI();

            } else {

                this.canvas.setAttribute('width', this._width);

            }

        }

        return this._width;

    };

    /**
     * Method called by <a href="https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame" target="_blank">requestAnimationFrame</a>. Sets <code>Facade.dt</code>, <code>Facade.fps</code> and  <code>Facade.ftime</code>.
     *
     *     this._requestAnimation = _requestAnimationFrame(this._animate.bind(this));
     *
     * @param {Integer} time <a href="https://developer.mozilla.org/en-US/docs/Web/API/DOMTimeStamp" target="_blank">DOMTimeStamp</a> or <a href="https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp" target="_blank">DOMHighResTimeStamp</a> (Google Chrome Only)
     * @return {Object} Facade.js object.
     * @api private
     */

    Facade.prototype._animate = function (time) {

        if (typeof this._callback === 'function') {

            if (this.ftime) {

                this.dt = time - this.ftime;

                this.fps = (1000 / this.dt).toFixed(2);

            }

            this.ftime = time;

            this._requestAnimation = _requestAnimationFrame(this._animate.bind(this));

            this.context.save();

            this._callback();

            this.context.restore();

        } else {

            this.stop();

        }

        return this;

    };

    /**
     * The constructor for all Facade.js shape, image and text objects.
     *
     * @return {Object} New Facade.Entity object.
     * @api private
     */

    Facade.Entity = function () { return undefined; };

    /**
     * Returns a default set of options common to all Facade.js entities.
     *
     *     console.log(Facade.Entity.prototype._defaultOptions());
     *     console.log(Facade.Entity.prototype._defaultOptions({ lineWidth: 0 }));
     *
     * @param {Object} updated Additional options as key-value pairs.
     * @return {Object} Default set of options.
     * @api private
     */

    Facade.Entity.prototype._defaultOptions = function (updated) {

        var options,
            key;

        options = {
            x: 0,
            y: 0,
            anchor: 'top/left',
            rotate: 0,
            scale: 1
        };

        for (key in updated) {

            if (updated[key] !== undefined) {

                options[key] = updated[key];

            }

        }

        return options;

    };

    /**
     * Returns a default set of metrics common to all Facade.js entities.
     *
     *     console.log(Facade.Entity.prototype._defaultMetrics());
     *     console.log(Facade.Entity.prototype._defaultMetrics({ scale: null }));
     *
     * @param {Object} updated Additional metrics as key-value pairs.
     * @return {Object} Default set of metrics.
     * @api private
     */

    Facade.Entity.prototype._defaultMetrics = function (updated) {

        var metrics = { x: null, y: null, width: null, height: null },
            key;

        for (key in updated) {

            if (updated[key] !== undefined) {

                metrics[key] = updated[key];

            }

        }

        return metrics;

    };

    /**
     * Returns an array of the x and y anchor positions based on given options and metrics.
     *
     *     console.log(rect._getAnchorPoint(options, metrics));
     *
     * @param {Object} options Facade.Entity options.
     * @param {Object} metrics Facade.Entity metrics.
     * @return {Array} Array with the x and y anchor positions.
     * @api private
     */

    Facade.Entity.prototype._getAnchorPoint = function (options, metrics) {

        var pos = [0, 0],
            strokeWidthOffset;

        if (options.anchor.match(/center$/)) {

            pos[0] = -metrics.width / 2;

        } else if (options.anchor.match(/right$/)) {

            pos[0] = -metrics.width;

        }

        if (options.anchor.match(/^center/)) {

            pos[1] = -metrics.height / 2;

        } else if (options.anchor.match(/^bottom/)) {

            pos[1] = -metrics.height;

        }

        if (this instanceof Facade.Polygon) {

            strokeWidthOffset = this._getStrokeWidthOffset(options);

            pos[0] = pos[0] + strokeWidthOffset;
            pos[1] = pos[1] + strokeWidthOffset;

        }

        return pos;

    };

    /**
     * Returns an integer for the stroke width offset. Used to calculate metrics.
     *
     *     console.log(rect._getStrokeWidthOffset(options));
     *
     * @param {Object} options Facade.Entity options.
     * @return {Integer} Integer representing the stroke width offset.
     * @api private
     */

    Facade.Entity.prototype._getStrokeWidthOffset = function (options) {

        var strokeWidthOffset = 0;

        if (options.lineWidth !== undefined) {

            strokeWidthOffset = options.lineWidth / 2;

        }

        return strokeWidthOffset;

    };

    /**
     * Applies transforms (translate, rotate and scale) to an entity.
     *
     *     console.log(rect._applyTransforms(context, options, metrics));
     *
     * @param {Object} context Reference to the <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D" target="_blank">CanvasRenderingContext2D</a> object.
     * @param {Object} options Facade.Entity options.
     * @param {Object} metrics Facade.Entity metrics.
     * @return {void}
     * @api private
     */

    Facade.Entity.prototype._applyTransforms = function (context, options, metrics) {

        var anchor = this._getAnchorPoint(options, {
            x: metrics.x,
            y: metrics.y,
            width: metrics.width / options.scale,
            height: metrics.height / options.scale
        });

        context.translate.apply(context, anchor);

        if (options.rotate) {

            context.translate(-anchor[0], -anchor[1]);
            context.rotate(options.rotate * _TO_RADIANS);
            context.translate(anchor[0], anchor[1]);

        }

        if (options.scale !== 1) {

            context.translate(-anchor[0], -anchor[1]);
            context.scale(options.scale, options.scale);
            context.translate(anchor[0], anchor[1]);

        }

    };

    /**
     * Retrieves the value of a given option. Only retrieves options set when creating a new Facade.js entity or <a href="#facade.entity.prototype.setoptions"><code>setOptions</code></a> not through temporary options set when using <a href="#facade.addtostage"><code>Facade.addToStage</code></a>.
     *
     *     console.log(text.getOption('value'));
     *
     * @param {String} key The name of the option.
     * @return {Object|Function|String|Integer} Value of the option requested.
     * @api public
     */

    Facade.Entity.prototype.getOption = function (key) {

        if (this._options[key] !== undefined) {

            return this._options[key];

        }

        return undefined;

    };

    /**
     * Retrieves the value of all options. Only retrieves options set when creating a new Facade.js entity or <a href="#facade.entity.prototype.setoptions"><code>setOptions</code></a> not through temporary options set when using <a href="#facade.addtostage"><code>Facade.addToStage</code></a>.
     *
     *     console.log(text.getAllOptions());
     *
     * @return {Object} Object containing all options.
     * @api public
     */

    Facade.Entity.prototype.getAllOptions = function () {

        var options = {},
            key;

        for (key in this._options) {

            if (this._options[key] !== undefined) {

                options[key] = this._options[key];

            }

        }

        return options;

    };

    /**
     * Sets an option for a given object.
     *
     *     console.log(text._setOptions('value', 'Hello world!'));
     *
     * @param {String} key The option to update.
     * @param {Object|Function|String|Integer} value The new value of the specified option.
     * @param {Boolean} test Flag to determine if options are to be persisted in the entity or just returned.
     * @return {Object|Function|String|Integer} Returns value of the updated option.
     * @api private
     */

    Facade.Entity.prototype._setOption = function (key, value, test) {

        if (this._options[key] !== undefined) {

            if (typeof this._options[key] === 'number' && typeof value === 'string') {

                if (value.match(_OPERATOR_TEST)) {

                    value = this._options[key] + parseFloat(value.replace('=', ''));

                } else {

                    value = parseFloat(value);

                }

            }

            if (String(typeof this._options[key]) === String(typeof value)) {

                if (!test) {

                    this._options[key] = value;

                }

            } else {

                throw new Error('The value for ' + key + ' (' + value + ') was a ' + String(typeof value) + ' not a ' + String(typeof this._options[key]) + '.');

            }

            return value;

        }

        return undefined;

    };

    /**
     * Sets a group of options as key-value pairs to an object.
     *
     *     console.log(text.setOptions({ value: 'Hello world!', fontFamily: 'Georgia' }));
     *
     * @param {Object} updated The options to update. Does not need to be entire set of options.
     * @param {Boolean} test Flag to determine if options are to be persisted in the entity or just returned.
     * @return {Object} Updated options.
     * @api public
     */

    Facade.Entity.prototype.setOptions = function (updated, test) {

        var options = this.getAllOptions(),
            key;

        if (updated) {

            for (key in updated) {

                if (updated[key] !== undefined && options[key] !== undefined) {

                    options[key] = this._setOption(key, updated[key], test);

                }

            }

            if (!test) {

                this._setMetrics();

            }

        }

        return options;

    };

    /**
     * Retrieves the value of a given metric. Only retrieves metrics set when creating a new Facade.js entity object or <a href="#facade.entity.prototype.setmetrics"><code>setMetrics</code></a> not through temporary metrics set when using <a href="#facade.addtostage"><code>Facade.addToStage</code></a>.
     *
     *     console.log(text.getMetric('width'));
     *
     * @param {String} key The name of the metric.
     * @return {Integer} Value of the metric requested.
     * @api public
     */

    Facade.Entity.prototype.getMetric = function (key) {

        if (this._metrics[key] !== undefined) {

            return this._metrics[key];

        }

        return undefined;

    };

    /**
     * Retrieves the value of all metrics. Only retrieves metrics set when creating a new Facade.js entity object or <a href="#facade.entity.prototype.setmetrics"><code>setMetrics</code></a> not through temporary metrics set when using <a href="#facade.addtostage"><code>Facade.addToStage</code></a>.
     *
     *     console.log(text.getAllMetrics());
     *
     * @return {Object} Object containing all metrics.
     * @api public
     */

    Facade.Entity.prototype.getAllMetrics = function () {

        var metrics = {},
            key;

        for (key in this._metrics) {

            if (this._metrics[key] !== undefined) {

                metrics[key] = this._metrics[key];

            }

        }

        return metrics;

    };

    /**
     * Renders an entity to a canvas.
     *
     *     entity.draw(stage);
     *     entity.draw(stage, options);
     *
     * @param {Object} facade Facade.js object.
     * @return {void}
     * @api public
     */

    Facade.Entity.prototype.draw = function (facade, updated) {

        var options = this.setOptions(updated, true);

        if (isFunction(this._configOptions)) {

            options = this._configOptions(options);

        }

        if (isFunction(this._draw)) {

            facade.renderWithContext(options, this._draw.bind(this, facade, options));

        }

    };

    /**
     * Create a polygon object. Inherits all methods from <b>Facade.Entity</b>.
     *
     *     var polygon = new Facade.Polygon({
     *         x: 0,
     *         y: 0,
     *         points: [ [100, 0], [200, 100], [100, 200], [0, 100] ],
     *         lineWidth: 10,
     *         strokeStyle: '#333E4B',
     *         fillStyle: '#1C73A8',
     *         anchor: 'top/left'
     *     });
     *
     * @options {Integer?} x X coordinate to position the polygon. <i>Default:</i> 0
     * @options {Integer?} y Y coordinate to position the polygon. <i>Default:</i> 0
     * @options {String?} anchor Position to anchor the polygon. <i>Default:</i> "top/left"<br><ul><li>top/left</li><li>top/center</li><li>top/right</li><li>center/left</li><li>center</li><li>center/right</li><li>bottom/left</li><li>bottom/center</li><li>bottom/right</li></ul>
     * @options {Integer?} rotate Degrees to rotate the polygon. <i>Default:</i> 0
     * @options {Integer?} scale A float representing the scale of a polygon. <i>Default:</i> 1
     * @options {Integer?} opacity Opacity of the polygon. Integer between 0 and 100. <i>Default:</i> 100
     * @options {String?} shadowColor Can be a text representation of a color, HEX, RGB(a), HSL(a).  <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
     * @options {Integer?} shadowOffsetX X offset of drop shadow. <i>Default:</i> 0
     * @options {Integer?} shadowOffsetY Y offset of drop shadow. <i>Default:</i> 0
     * @options {Array?} points Multi-dimensional array of points used to render a polygon. Point arrays with 2 values is rendered as a line, 5 values is rendered as an arc and 6 values is rendered as a bezier curve.
     * @options {String?} fillStyle Fill color for the polygon. Can be a text representation of a color, HEX, RGB(a), HSL(a).  <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
     * @options {String?} strokeStyle Color of a polygon's stroke. Can be a text representation of a color, HEX, RGB(a), HSL(a).  <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
     * @options {Integer?} lineWidth Width of the stroke. <i>Default:</i> 0
     * @options {String?} lineCap The style of line cap. <i>Default:</i> "butt"<br><ul><li>butt</li><li>round</li><li>square</li></ul>
     * @options {String?} lineJoin The style of line join. <i>Default:</i> "miter"<br><ul><li>miter</li><li>round</li><li>bevel</li></ul>
     * @options {Boolean?} closePath Boolean to determine if the polygon should be self closing or not. <i>Default:</i> true
     * @param {Object?} options Options to create the polygon with.
     * @return {Object} New Facade.Polygon object.
     * @api public
     */

    Facade.Polygon = function (options) {

        if (!(this instanceof Facade.Polygon)) {

            return new Facade.Polygon(options);

        }

        this._options = this._defaultOptions();
        this._metrics = this._defaultMetrics();

        this.setOptions(options);

    };

    /*!
     * Extend from Facade.Entity
     */

    Facade.Polygon.prototype = Object.create(Facade.Entity.prototype);
    Facade.Polygon.constructor = Facade.Entity;

    /**
     * Returns a default set of options common to all Facade.js polygon entities.
     *
     *     console.log(Facade.Polygon.prototype._defaultOptions());
     *
     * @param {Object} updated Additional options as key-value pairs.
     * @return {Object} Default set of options.
     * @api private
     */

    Facade.Polygon.prototype._defaultOptions = function (updated) {

        var options,
            key;

        options = Facade.Entity.prototype._defaultOptions({
            opacity: 100,
            shadowBlur: 0,
            shadowColor: '#000',
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            points: [],
            fillStyle: '#000',
            strokeStyle: '',
            lineWidth: 0,
            lineCap: 'butt',
            lineJoin: 'miter',
            closePath: true
        });

        for (key in updated) {

            if (updated[key] !== undefined) {

                options[key] = updated[key];

            }

        }

        return options;

    };

    /**
     * Renders a polygon entity to a canvas.
     *
     *     polygon.draw(stage);
     *     polygon.draw(stage, options);
     *
     * @param {Object} facade Facade.js object.
     * @param {Object} updated Additional options as key-value pairs.
     * @return {void}
     * @api private
     */

    Facade.Polygon.prototype._draw = function (facade, options) {

        var context = facade.context,
            metrics = options ? this._setMetrics(options, true) : this.getAllMetrics(),
            i,
            length;

        this._applyTransforms(context, options, metrics);

        if (options.points.length) {

            context.beginPath();

            for (i = 0, length = options.points.length; i < length; i = i + 1) {

                if (options.points[i].length === 6) {

                    context.bezierCurveTo.apply(context, options.points[i]);

                } else if (options.points[i].length === 5) {

                    context.arc.apply(context, options.points[i]);

                } else if (options.points[i].length === 2) {

                    context.lineTo.apply(context, options.points[i]);

                }

            }

            if (options.closePath) {

                context.closePath();

            } else {

                context.moveTo.apply(context, options.points[length - 1]);

            }

            if (options.fillStyle) {
                context.fill();
            }

            if (options.lineWidth > 0) {
                context.stroke();
            }

        }

    };

    /**
     * Custom configuration for options specific to a polygon entity.
     *
     *     console.log(polygon._configOptions(options));
     *
     * @param {Object} options Complete set of polygon specific options.
     * @return {Object} Converted options.
     * @api private
     */

    Facade.Polygon.prototype._configOptions = function (options) {

        options.translate = [ options.x, options.y ];
        options.globalAlpha = options.opacity / 100;

        return options;

    };

    /**
     * Set metrics based on the polygon's options.
     *
     *     console.log(polygon._setMetrics());
     *     console.log(polygon._setMetrics(options));
     *
     * @param {Object} updated Additional options as key-value pairs.
     * @return {Object} Object with metrics as key-value pairs.
     * @api private
     */

    Facade.Polygon.prototype._setMetrics = function (updated) {

        var metrics = this._defaultMetrics(),
            options = this.setOptions(updated, true),
            bounds = { top: null, right: null, bottom: null, left: null },
            point,
            i,
            length,
            anchor,
            strokeWidthOffset = this._getStrokeWidthOffset(options);

        if (isFunction(this._configOptions)) {

            options = this._configOptions(options);

        }

        for (i = 0, length = options.points.length; i < length; i = i + 1) {

            if (options.points[i].length === 2) { // Rect

                point = { x: options.points[i][0], y: options.points[i][1] };

            } else if (options.points[i].length === 5) { // Circle

                metrics.width = options.points[i][2] * 2;
                metrics.height = options.points[i][2] * 2;

                point = {
                    x: options.points[i][0] - options.points[i][2],
                    y: options.points[i][1] - options.points[i][2]
                };

            }

            if (point.x < bounds.left || bounds.left === null) {

                bounds.left = point.x;

            }

            if (point.y < bounds.top || bounds.top === null) {

                bounds.top = point.y;

            }

            if (point.x > bounds.right || bounds.right === null) {

                bounds.right = point.x;

            }

            if (point.y > bounds.bottom || bounds.bottom === null) {

                bounds.bottom = point.y;

            }

        }

        metrics.x = options.x + bounds.left;
        metrics.y = options.y + bounds.top;

        if (metrics.width === null && metrics.height === null) {

            metrics.width = bounds.right - bounds.left;
            metrics.height = bounds.bottom - bounds.top;

        }

        metrics.width = (metrics.width + strokeWidthOffset * 2) * options.scale;
        metrics.height = (metrics.height + strokeWidthOffset * 2) * options.scale;

        anchor = this._getAnchorPoint(options, metrics);

        metrics.x = metrics.x + anchor[0] - strokeWidthOffset;
        metrics.y = metrics.y + anchor[1] - strokeWidthOffset;

        if (this instanceof Facade.Circle) {

            metrics.x = metrics.x + options.radius;
            metrics.y = metrics.y + options.radius;

        }

        if (!updated) {

            this._metrics = metrics;

        }

        return metrics;

    };

    /**
     * Create a circle object. Inherits all methods from <b>Facade.Polygon</b>.
     *
     *     var circle = new Facade.Circle({
     *         x: 0,
     *         y: 0,
     *         radius: 100,
     *         lineWidth: 10,
     *         strokeStyle: '#333E4B',
     *         fillStyle: '#1C73A8',
     *         anchor: 'top/left'
     *     });
     *
     * @options {Integer?} x X coordinate to position the circle. <i>Default:</i> 0
     * @options {Integer?} y Y coordinate to position the circle. <i>Default:</i> 0
     * @options {String?} anchor Position to anchor the circle. <i>Default:</i> "top/left"<br><ul><li>top/left</li><li>top/center</li><li>top/right</li><li>center/left</li><li>center</li><li>center/right</li><li>bottom/left</li><li>bottom/center</li><li>bottom/right</li></ul>
     * @options {Integer?} rotate Degrees to rotate the circle. <i>Default:</i> 0
     * @options {Integer?} scale A float representing the scale of a circle. <i>Default:</i> 1
     * @options {Integer?} opacity Opacity of the circle. Integer between 0 and 100. <i>Default:</i> 100
     * @options {String?} shadowColor Can be a text representation of a color, HEX, RGB(a), HSL(a).  <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
     * @options {Integer?} shadowOffsetX X offset of drop shadow. <i>Default:</i> 0
     * @options {Integer?} shadowOffsetY Y offset of drop shadow. <i>Default:</i> 0
     * @options {Array?} points Multi-dimensional array of points used to render a polygon. Point arrays with 2 values is rendered as a line, 5 values is rendered as an arc and 6 values is rendered as a bezier curve.
     * @options {String?} fillStyle Fill color for the circle. Can be a text representation of a color, HEX, RGB(a), HSL(a).  <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
     * @options {String?} strokeStyle Color of a circle's stroke. Can be a text representation of a color, HEX, RGB(a), HSL(a).  <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
     * @options {Integer?} lineWidth Width of the stroke. <i>Default:</i> 0
     * @options {String?} lineCap The style of line cap. <i>Default:</i> "butt"<br><ul><li>butt</li><li>round</li><li>square</li></ul>
     * @options {String?} lineJoin The style of line join. <i>Default:</i> "miter"<br><ul><li>miter</li><li>round</li><li>bevel</li></ul>
     * @options {Boolean?} closePath Boolean to determine if the polygon should be self closing or not. <i>Default:</i> true
     * @options {Integer?} radius Radius of the circle. <i>Default:</i> 0
     * @options {Integer?} start Degree at which the circle begins. <i>Default:</i> 0
     * @options {Integer?} end Degree at which the circle ends. <i>Default:</i> 360
     * @options {Boolean?} counterclockwise Determines if the circle will be drawn in a counter clockwise direction. <i>Default:</i> false
     * @param {Object?} options Options to create the circle with.
     * @return {Object} New Facade.Circle object.
     * @api public
     */

    Facade.Circle = function (options) {

        if (!(this instanceof Facade.Circle)) {

            return new Facade.Circle(options);

        }

        this._options = this._defaultOptions({ radius: 0, begin: 0, end: 360, counterclockwise: false });
        this._metrics = this._defaultMetrics();

        this.setOptions(options);

    };

    /*!
     * Extend from Facade.Polygon
     */

    Facade.Circle.prototype = Object.create(Facade.Polygon.prototype);
    Facade.Circle.constructor = Facade.Polygon;

    /**
     * Custom configuration for options specific to a circle entity.
     *
     *     console.log(circle._configOptions(options));
     *
     * @param {Object} options Complete set of circle specific options.
     * @return {Object} Converted options.
     * @api private
     */

    Facade.Circle.prototype._configOptions = function (options) {

        options.translate = [ options.x, options.y ];
        options.globalAlpha = options.opacity / 100;

        if (options.counterclockwise) {

            options.points = [ [ 0, 0, options.radius, options.end * _TO_RADIANS, options.begin * _TO_RADIANS ] ];

        } else {

            options.points = [ [ 0, 0, options.radius, options.begin * _TO_RADIANS, options.end * _TO_RADIANS ] ];

        }

        return options;

    };

    /**
     * Returns an array of the x and y anchor positions based on given options and metrics.
     *
     *     console.log(circle._getAnchorPoint(options, metrics));
     *
     * @param {Object} options Facade.Circle options.
     * @param {Object} metrics Facade.Circle metrics.
     * @return {Array} Array with the x and y anchor positions.
     * @api private
     */

    Facade.Circle.prototype._getAnchorPoint = function (options, metrics) {

        var pos = Facade.Polygon.prototype._getAnchorPoint.call(this, options, metrics);

        pos[0] = pos[0] + options.radius;
        pos[1] = pos[1] + options.radius;

        return pos;

    };

    /**
     * Set metrics based on the circle's options.
     *
     *     console.log(circle._setMetrics());
     *     console.log(circle._setMetrics(options));
     *
     * @param {Object} updated Additional options as key-value pairs.
     * @return {Object} Object with metrics as key-value pairs.
     * @api private
     */

    Facade.Circle.prototype._setMetrics = function (updated) {

        var metrics = Facade.Polygon.prototype._setMetrics.call(this, updated),
            options = this.getAllOptions(updated);

        metrics.x = metrics.x - options.radius;
        metrics.y = metrics.y - options.radius;

        if (!updated) {

            this._metrics = metrics;

        }

        return metrics;

    };

    /**
     * Create a line object. Inherits all methods from <b>Facade.Polygon</b>.
     *
     *     var line = new Facade.Line({
     *         x: 0,
     *         y: 0,
     *         x2: 200,
     *         lineWidth: 10,
     *         strokeStyle: '#333E4B',
     *         anchor: 'top/left'
     *     });
     *
     * @options {Integer?} x X coordinate to position the line. <i>Default:</i> 0
     * @options {Integer?} y Y coordinate to position the line. <i>Default:</i> 0
     * @options {String?} anchor Position to anchor the line. <i>Default:</i> "top/left"<br><ul><li>top/left</li><li>top/center</li><li>top/right</li><li>center/left</li><li>center</li><li>center/right</li><li>bottom/left</li><li>bottom/center</li><li>bottom/right</li></ul>
     * @options {Integer?} rotate Degrees to rotate the line. <i>Default:</i> 0
     * @options {Integer?} scale A float representing the scale of a line. <i>Default:</i> 1
     * @options {Integer?} opacity Opacity of the line. Integer between 0 and 100. <i>Default:</i> 100
     * @options {String?} shadowColor Can be a text representation of a color, HEX, RGB(a), HSL(a).  <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
     * @options {Integer?} shadowOffsetX X offset of drop shadow. <i>Default:</i> 0
     * @options {Integer?} shadowOffsetY Y offset of drop shadow. <i>Default:</i> 0
     * @options {Array?} points Multi-dimensional array of points used to render a polygon. Point arrays with 2 values is rendered as a line, 5 values is rendered as an arc and 6 values is rendered as a bezier curve.
     * @options {String?} fillStyle Fill color for the polygon. Can be a text representation of a color, HEX, RGB(a), HSL(a).  <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
     * @options {String?} strokeStyle Color of a line's stroke. Can be a text representation of a color, HEX, RGB(a), HSL(a).  <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
     * @options {Integer?} lineWidth Width of the stroke. <i>Default:</i> 0
     * @options {String?} lineCap The style of line cap. <i>Default:</i> "butt"<br><ul><li>butt</li><li>round</li><li>square</li></ul>
     * @options {String?} lineJoin The style of line join. <i>Default:</i> "miter"<br><ul><li>miter</li><li>round</li><li>bevel</li></ul>
     * @options {Boolean?} closePath Boolean to determine if the polygon should be self closing or not. <i>Default:</i> true
     * @options {Integer?} x1 X coordinate where line begins. <i>Default:</i> 0
     * @options {Integer?} y1 Y coordinate where line begins. <i>Default:</i> 0
     * @options {Integer?} x2 X coordinate where line ends. <i>Default:</i> 0
     * @options {Integer?} y2 Y coordinate where line ends. <i>Default:</i> 0
     * @param {Object?} options Options to create the line with.
     * @return {Object} New Facade.Line object.
     * @api public
     */

    Facade.Line = function (options) {

        if (!(this instanceof Facade.Line)) {

            return new Facade.Line(options);

        }

        this._options = this._defaultOptions({ x1: 0, y1: 0, x2: 0, y2: 0, lineWidth: 1 });
        this._metrics = this._defaultMetrics();

        this.setOptions(options);

    };

    /*!
     * Extend from Facade.Polygon
     */

    Facade.Line.prototype = Object.create(Facade.Polygon.prototype);
    Facade.Line.constructor = Facade.Polygon;

    /**
     * Custom configuration for options specific to a line entity.
     *
     *     console.log(line._configOptions(options));
     *
     * @param {Object} options Complete set of line specific options.
     * @return {Object} Converted options.
     * @api private
     */

    Facade.Line.prototype._configOptions = function (options) {

        options.translate = [ options.x, options.y ];
        options.globalAlpha = options.opacity / 100;
        options.closePath = false;

        options.points = [ [ options.x1, options.y1 ], [ options.x2, options.y2 ] ];

        return options;

    };

    /**
     * Returns an array of the x and y anchor positions based on given options and metrics.
     *
     *     console.log(line._getAnchorPoint(options, metrics));
     *
     * @param {Object} options Facade.Line options.
     * @param {Object} metrics Facade.Line metrics.
     * @return {Array} Array with the x and y anchor positions.
     * @api private
     */

    Facade.Line.prototype._getAnchorPoint = function (options, metrics) {

        var pos = [0, 0];

        if (options.anchor.match(/center$/)) {

            pos[0] = -(metrics.width / 2 - options.lineWidth / 2);

        } else if (options.anchor.match(/right$/)) {

            pos[0] = -(metrics.width - options.lineWidth);

        }

        if (options.anchor.match(/^center/)) {

            pos[1] = -(metrics.height / 2 - options.lineWidth / 2);

        } else if (options.anchor.match(/^bottom/)) {

            pos[1] = -(metrics.height - options.lineWidth);

        }

        return pos;

    };

    /**
     * Create a rectangle object. Inherits all methods from <b>Facade.Polygon</b>.
     *
     *     var rect = new Facade.Rect({
     *         x: 0,
     *         y: 0,
     *         width: 200,
     *         height: 200,
     *         lineWidth: 10,
     *         strokeStyle: '#333E4B',
     *         fillStyle: '#1C73A8',
     *         anchor: 'top/left'
     *     });
     *
     * @options {Integer?} x X coordinate to position the rectangle. <i>Default:</i> 0
     * @options {Integer?} y Y coordinate to position the rectangle. <i>Default:</i> 0
     * @options {String?} anchor Position to anchor the rectangle. <i>Default:</i> "top/left"<br><ul><li>top/left</li><li>top/center</li><li>top/right</li><li>center/left</li><li>center</li><li>center/right</li><li>bottom/left</li><li>bottom/center</li><li>bottom/right</li></ul>
     * @options {Integer?} rotate Degrees to rotate the rectangle. <i>Default:</i> 0
     * @options {Integer?} scale A float representing the scale of a rectangle. <i>Default:</i> 1
     * @options {Integer?} opacity Opacity of the rectangle. Integer between 0 and 100. <i>Default:</i> 100
     * @options {String?} shadowColor Can be a text representation of a color, HEX, RGB(a), HSL(a).  <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
     * @options {Integer?} shadowOffsetX X offset of drop shadow. <i>Default:</i> 0
     * @options {Integer?} shadowOffsetY Y offset of drop shadow. <i>Default:</i> 0
     * @options {Array?} points Multi-dimensional array of points used to render a polygon. Point arrays with 2 values is rendered as a line, 5 values is rendered as an arc and 6 values is rendered as a bezier curve.
     * @options {String?} fillStyle Fill color for the rectangle. Can be a text representation of a color, HEX, RGB(a), HSL(a).  <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
     * @options {String?} strokeStyle Color of a rectangle's stroke. Can be a text representation of a color, HEX, RGB(a), HSL(a).  <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
     * @options {Integer?} lineWidth Width of the stroke. <i>Default:</i> 0
     * @options {String?} lineCap The style of rectangle cap. <i>Default:</i> "butt"<br><ul><li>butt</li><li>round</li><li>square</li></ul>
     * @options {String?} lineJoin The style of rectangle join. <i>Default:</i> "miter"<br><ul><li>miter</li><li>round</li><li>bevel</li></ul>
     * @options {Boolean?} closePath Boolean to determine if the polygon should be self closing or not. <i>Default:</i> true
     * @options {Integer?} width Width of the rectangle. <i>Default:</i> 0
     * @options {Integer?} height Height of the rectangle. <i>Default:</i> 0
     * @param {Object?} options Options to create the rectangle with.
     * @return {Object} New Facade.Rect object.
     * @api public
     */

    Facade.Rect = function (options) {

        if (!(this instanceof Facade.Rect)) {

            return new Facade.Rect(options);

        }

        this._options = this._defaultOptions({ width: 0, height: 0 });
        this._metrics = this._defaultMetrics();

        this.setOptions(options);

    };

    /*!
     * Extend from Facade.Polygon
     */

    Facade.Rect.prototype = Object.create(Facade.Polygon.prototype);
    Facade.Rect.constructor = Facade.Polygon;

    /**
     * Custom configuration for options specific to a rectangle entity.
     *
     *     console.log(rect._configOptions(options));
     *
     * @param {Object} options Complete set of rectangle specific options.
     * @return {Object} Converted options.
     * @api private
     */

    Facade.Rect.prototype._configOptions = function (options) {

        options.translate = [ options.x, options.y ];
        options.globalAlpha = options.opacity / 100;

        options.points = [ [ 0, 0 ], [ options.width, 0 ], [ options.width, options.height ], [ 0, options.height ] ];

        return options;

    };

    /**
     * Create an image object. Inherits all methods from <b>Facade.Entity</b>.
     *
     *     var image = new Facade.Image('images/sprite.png', {
     *         x: 0,
     *         y: 0,
     *         width: 100,
     *         height: 200,
     *         anchor: 'top/left'
     *     });
     *
     * @options {Integer?} x X coordinate to position an image. <i>Default:</i> 0
     * @options {Integer?} y Y coordinate to position an image. <i>Default:</i> 0
     * @options {String?} anchor Position to anchor the image. <i>Default:</i> "top/left"<br><ul><li>top/left</li><li>top/center</li><li>top/right</li><li>center/left</li><li>center</li><li>center/right</li><li>bottom/left</li><li>bottom/center</li><li>bottom/right</li></ul>
     * @options {Integer?} rotate Degrees to rotate the image. <i>Default:</i> 0
     * @options {Integer?} scale A float representing the scale of an image. <i>Default:</i> 1
     * @options {Integer?} width Width of the image. <i>Default:</i> 0
     * @options {Integer?} height Height of the image. <i>Default:</i> 0
     * @options {Integer?} tileX Number of times to tile the image horizontally. <i>Default:</i> 1
     * @options {Integer?} tileY Number of times to tile the image vertically. <i>Default:</i> 1
     * @options {Integer?} offsetX Starting X coordinate within the image. <i>Default:</i> 0
     * @options {Integer?} offsetY Starting Y coordinate within the image. <i>Default:</i> 0
     * @options {Array?} frames Array of frame numbers (integers starting at 0) for sprite animation. <i>Default:</i> []
     * @options {Integer?} speed Speed of sprite animation. <i>Default:</i> 120
     * @options {Boolean?} loop Determines if the animation should loop. <i>Default:</i> true
     * @options {Function?} callback Function called for every frame of a sprite animation. <i>Default:</i> `function (frame) { };`
     * @property {image} image Reference to the image element.
     * @property {animating} animating Boolean state of animation.
     * @property {currentFrame} currentFrame Current frame of animation.
     * @param {Object|String} source Local image file or reference to an HTML image element.
     * @param {Object?} options Options to create the image with.
     * @return {Object} New Facade.Image object.
     * @api public
     */

    Facade.Image = function (img, options) {

        if (!(this instanceof Facade.Image)) {

            return new Facade.Image(img, options);

        }

        this._options = this._defaultOptions({
            width: 0,
            height: 0,
            tileX: 1,
            tileY: 1,
            offsetX: 0,
            offsetY: 0,
            frames: [0],
            speed: 120,
            loop: true,
            callback: function () { return undefined; }
        });
        this._metrics = this._defaultMetrics();

        this.animating = false;
        this.currentFrame = 0;

        this.setOptions(options);

        this.load(img);

    };

    /*!
     * Extend from Facade.Entity
     */

    Facade.Image.prototype = Object.create(Facade.Entity.prototype);
    Facade.Image.constructor = Facade.Entity;

    /**
     * Loads either a reference to an image tag or an image URL into a Facade.Image entity.
     *
     *     console.log(image.load(document.querySelector('img')));
     *     console.log(image.load('images/sprite.png'));
     *
     * @param {Object|String} source A reference to an image tag or an image URL.
     * @return {void}
     * @api public
     */

    Facade.Image.prototype.load = function (source) {

        if (typeof source === 'object' && source.nodeType === 1) {

            this.image = source;

        } else {

            this.image = document.createElement('img');
            this.image.setAttribute('src', source);

        }

        if (this.image.complete) {

            this._setMetrics();

        } else {

            this.image.addEventListener('load', this._setMetrics.bind(this, null));

        }

    };

    /**
     * Starts an image sprite animation.
     *
     *  image.play();
     *
     * @return {Object} Facade.js image object.
     * @api public
     */

    Facade.Image.prototype.play = function () {

        this.animating = true;

        return this;

    };

    /**
     * Pauses an image sprite animation.
     *
     *  image.pause();
     *
     * @return {Object} Facade.js image object.
     * @api public
     */

    Facade.Image.prototype.pause = function () {

        this.animating = false;

        return this;

    };

    /**
     * Resets an image sprite animation to the first frame.
     *
     *  image.reset();
     *
     * @return {Object} Facade.js image object.
     * @api public
     */

    Facade.Image.prototype.reset = function () {

        this.currentFrame = 0;

        return this;

    };

    /**
     * Stops and resets an image sprite animation.
     *
     *  image.stop();
     *
     * @return {Object} Facade.js image object.
     * @api public
     */

    Facade.Image.prototype.stop = function () {

        this.currentFrame = 0;

        this.animating = false;

        return this;

    };

    /**
     * Custom configuration for options specific to a image entity.
     *
     *     console.log(image._configOptions(options));
     *
     * @param {Object} options Complete set of image specific options.
     * @return {Object} Converted options.
     * @api private
     */

    Facade.Image.prototype._configOptions = function (options) {

        options.translate = [ options.x, options.y ];

        if (this.image && this.image.complete) {

            if (!options.width) {

                options.width = this.image.width;

            }

            if (!options.height) {

                options.height = this.image.height;

            }

        }

        return options;

    };

    /**
     * Set metrics based on the image's options.
     *
     *     console.log(image._setMetrics());
     *
     * @return {Object} Object with metrics as key-value pairs.
     * @api private
     */

    Facade.Image.prototype._setMetrics = function (updated) {

        var metrics = this._defaultMetrics(),
            options = this.setOptions(updated, true),
            anchor;

        if (isFunction(this._configOptions)) {

            options = this._configOptions(options);

        }

        metrics.width = options.width * options.tileX * options.scale;
        metrics.height = options.height * options.tileY * options.scale;

        anchor = this._getAnchorPoint(options, metrics);

        metrics.x = options.x + anchor[0];
        metrics.y = options.y + anchor[1];

        if (!updated) {

            this._metrics = metrics;

        }

        return metrics;

    };

    /**
     * Renders an image entity to a canvas.
     *
     *     image.draw(stage);
     *     image.draw(stage, options);
     *
     * @param {Object} facade Facade.js object.
     * @return {void}
     * @api private
     */

    Facade.Image.prototype._draw = function (facade, options) {

        var context = facade.context,
            metrics = options ? this._setMetrics(options, true) : this.getAllMetrics(),
            currentOffsetX = 0,
            currentOffsetY = 0,
            x,
            y;

        if (this.image.complete) {

            this._applyTransforms(context, options, metrics);

            if (options.frames.length) {

                currentOffsetX = options.frames[this.currentFrame] || 0;

            }

            for (x = 0; x < options.tileX; x += 1) {

                for (y = 0; y < options.tileY; y += 1) {

                    context.drawImage(
                        this.image,
                        (options.width * currentOffsetX) + options.offsetX,
                        (options.height * currentOffsetY) + options.offsetY,
                        options.width,
                        options.height,
                        options.width * x,
                        options.height * y,
                        options.width,
                        options.height
                    );

                }

            }

            if (this.animating) {

                if (!this.ftime) {

                    this.ftime = facade.ftime;

                    if (typeof options.callback === 'function') {

                        options.callback.call(this, options.frames[this.currentFrame]);

                    }

                }

                if (facade.ftime - this.ftime >= options.speed) {

                    this.ftime = facade.ftime;

                    this.currentFrame += 1;

                    if (this.currentFrame >= options.frames.length) {

                        if (options.loop) {

                            this.currentFrame = 0;

                        } else {

                            this.currentFrame = options.frames.length - 1;

                            this.isAnimating = false;

                        }

                    }

                    if (typeof options.callback === 'function') {

                        options.callback.call(this, options.frames[this.currentFrame]);

                    }

                }

            }

        }

    };

    /**
     * Create a text object. Inherits all methods from <b>Facade.Entity</b>.
     *
     *     var text = new Facade.Text('Hello World!', {
     *         x: 0,
     *         y: 0,
     *         fontFamily: 'Helvetica',
     *         fontSize: 40,
     *         fillStyle: '#333',
     *         anchor: 'top/left'
     *     });
     *
     * @options {Integer?} x X coordinate to position a text object. <i>Default:</i> 0
     * @options {Integer?} y Y coordinate to position a text object. <i>Default:</i> 0
     * @options {String?} anchor Position to anchor the text object. <i>Default:</i> "top/left"<br><ul><li>top/left</li><li>top/center</li><li>top/right</li><li>center/left</li><li>center</li><li>center/right</li><li>bottom/left</li><li>bottom/center</li><li>bottom/right</li></ul>
     * @options {Integer?} rotate Degrees to rotate the text object. <i>Default:</i> 0
     * @options {Integer?} scale A float representing the scale of a text object. <i>Default:</i> 1
     * @options {Integer?} opacity Opacity of the text object. Integer between 0 and 100. <i>Default:</i> 100
     * @options {Integer?} width Max width of the text object. Will cause text to wrap onto a new line if necessary. No wrapping will occur if the value is set to 0. <i>Default:</i> 0
     * @options {String?} fontFamily Sets the font family of the text. Only one font can be specified at a time. <i>Default:</i> "Arial"
     * @options {String?} fontStyle Font style of the text. <i>Default:</i> "normal"<br><ul><li>normal</li><li>bold</li><li>italic</li></ul>
     * @options {Integer?} fontSize Font size in pixels. <i>Default:</i> 30
     * @options {String?} lineHeight Line height of the text. <i>Default:</i> 1
     * @options {String?} textAlign Horizontal alignment of the text. <i>Default:</i> "left"<br><ul><li>left</li><li>center</li><li>right</li></ul>
     * @options {String?} textBaseline Baseline to set the vertical alignment of the text drawn. <i>Default:</i> "top"<br><ul><li>top</li><li>hanging</li><li>middle</li><li>alphabetic</li><li>ideographic</li><li>bottom</li></ul>
     * @options {String?} fillStyle Fill color for the text object. Can be a text representation of a color, HEX, RGB(a), HSL(a).  <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
     * @options {String?} strokeStyle Color of a text object's stroke. Can be a text representation of a color, HEX, RGB(a), HSL(a).  <i>Default:</i> "#000"<br><ul><li>HTML Colors: red, green, blue, etc.</li><li>HEX: #f00, #ff0000</li><li>RGB(a): rgb(255, 0, 0), rgba(0, 255, 0, 0.5)</li><li>HSL(a): hsl(100, 100%, 50%), hsla(100, 100%, 50%, 0.5)</li></ul>
     * @options {Integer?} lineWidth Width of the stroke. <i>Default:</i> 0
     * @property {value} value Current value of the text object.
     * @param {Object?} value Value of the text object.
     * @param {Object?} options Options to create the text entity with.
     * @return {Object} New Facade.Text object.
     * @api public
     */

    Facade.Text = function (value, options) {

        if (!(this instanceof Facade.Text)) {

            return new Facade.Text(value, options);

        }

        if (value !== undefined) {

            this.value = String(value);

        }

        this._options = this._defaultOptions({
            opacity: 100,
            width: 0,
            fontFamily: 'Arial',
            fontStyle: 'normal',
            fontSize: 16,
            lineHeight: 1,
            textAlignment: 'left',
            textBaseline: 'top',
            fillStyle: '#000',
            strokeStyle: '#000',
            lineWidth: 0
        });
        this._metrics = this._defaultMetrics();

        this._maxLineWidth = 0;

        this._lines = [];

        this.setOptions(options);

        this.setText(this.value);

    };

    /*!
     * Extend from Facade.Entity
     */

    Facade.Text.prototype = Object.create(Facade.Entity.prototype);
    Facade.Text.constructor = Facade.Entity;

    /**
     * Sets the text entities value.
     *
     *     console.log(text.setText('Lorem ipsum dolor sit amet'));
     *
     * @param {String} value The new value of the text entity.
     * @return {Array} An array of lines and the position to render using <a href="https://developer.mozilla.org/en-US/docs/Drawing_text_using_a_canvas#fillText()">fillText()</a> and <a href="https://developer.mozilla.org/en-US/docs/Drawing_text_using_a_canvas#strokeText()">strokeText()</a>.
     * @api public
     */

    Facade.Text.prototype.setText = function (value) {

        var options = this.getAllOptions(),
            words = [],
            currentWord = null,
            currentLine = '',
            currentLineWidth = 0,
            i,
            length;

        this._maxLineWidth = options.width;

        this._lines = [];

        if (value) {

            words = String(value).match(/\n|[\S]+ ?/g);

        }

        if (isFunction(this._configOptions)) {

            options = this._configOptions(options);

        }

        _context.save();

        _context.font = options.font;

        while (words.length) {

            currentWord = words.shift();
            currentLineWidth = _context.measureText(currentLine + currentWord.replace(/\s$/, '')).width;

            if ((options.width > 0 && currentLineWidth > options.width) || currentWord.match(/\n/)) {

                this._lines.push([currentLine.replace(/\s$/, ''), 0, this._lines.length * (options.fontSize * options.lineHeight)]);

                currentLine = currentWord.replace(/\n/, '');

            } else {

                currentLine = currentLine + currentWord;

                if (currentLineWidth > this._maxLineWidth) {

                    this._maxLineWidth = currentLineWidth;

                }

            }

        }

        this._lines.push([currentLine.replace(/\s$/, ''), 0, this._lines.length * (options.fontSize * options.lineHeight)]);

        for (i = 0, length = this._lines.length; i < length; i = i + 1) {

            currentLineWidth = _context.measureText(this._lines[i][0]).width;

            if (options.textAlignment === 'center') {

                this._lines[i][1] = (this._maxLineWidth - currentLineWidth) / 2;

            } else if (options.textAlignment === 'right') {

                this._lines[i][1] = this._maxLineWidth - currentLineWidth;

            }

        }

        _context.restore();

        this._setMetrics();

        return this._lines;

    };

    /**
     * Renders a text entity to a canvas.
     *
     *     text.draw(stage);
     *     text.draw(stage, options);
     *
     * @param {Object} facade Facade.js object.
     * @return {void}
     * @api private
     */

    Facade.Text.prototype._draw = function (facade, options) {

        var context = facade.context,
            metrics = options ? this._setMetrics(options, true) : this.getAllMetrics(),
            i,
            length;

        this._applyTransforms(context, options, metrics);

        for (i = 0, length = this._lines.length; i < length; i = i + 1) {

            context.fillText.apply(context, this._lines[i]);

            if (options.lineWidth) {

                context.strokeText.apply(context, this._lines[i]);

            }

        }

    };

    /**
     * Custom configuration for options specific to a text entity.
     *
     *     console.log(text._configOptions(options));
     *
     * @param {Object} options Complete set of text specific options.
     * @return {Object} Converted options.
     * @api private
     */

    Facade.Text.prototype._configOptions = function (options) {

        options.translate = [ options.x, options.y ];
        options.globalAlpha = options.opacity / 100;
        options.font = options.fontStyle + ' ' + parseInt(options.fontSize, 10) + 'px ' + options.fontFamily;

        if (options.width === 0) {

            options.width = this._maxLineWidth;

        }

        return options;

    };

    /**
     * Set metrics based on the text's options.
     *
     *     console.log(text._setMetrics());
     *
     * @return {Object} Object with metrics as key-value pairs.
     * @api private
     */

    Facade.Text.prototype._setMetrics = function (updated) {

        var metrics = this._defaultMetrics(),
            options = this.setOptions(updated, true),
            anchor;

        if (isFunction(this._configOptions)) {

            options = this._configOptions(options);

        }

        if (this._lines) {

            metrics.width = options.width * options.scale;
            metrics.height = this._lines.length * (options.fontSize * options.lineHeight) * options.scale;

        }

        anchor = this._getAnchorPoint(options, metrics);

        metrics.x = options.x + anchor[0];
        metrics.y = options.y + anchor[1];

        if (!updated) {

            this._metrics = metrics;

        }

        return metrics;

    };

    /**
     * Create a group object. Inherits all methods from <b>Facade.Entity</b>.
     *
     *     var group = new Facade.Group({ x: 100, y: 100 });
     *
     *     group.addToGroup(polygon);
     *     group.addToGroup(circle);
     *     group.addToGroup(line);
     *     group.addToGroup(rect);
     *
     * @options {Integer?} x X coordinate to position a group. <i>Default:</i> 0
     * @options {Integer?} y Y coordinate to position a group. <i>Default:</i> 0
     * @options {String?} anchor Position to anchor the group. <i>Default:</i> "top/left"<br><ul><li>top/left</li><li>top/center</li><li>top/right</li><li>center/left</li><li>center</li><li>center/right</li><li>bottom/left</li><li>bottom/center</li><li>bottom/right</li></ul>
     * @options {Integer?} rotate Degrees to rotate the group. <i>Default:</i> 0
     * @options {Integer?} scale A float representing the scale of a group. <i>Default:</i> 1
     * @param {Object?} options Options to create the group with.
     * @return {Object} New Facade.Group object.
     * @api public
     */

    Facade.Group = function (options) {

        if (!(this instanceof Facade.Group)) {

            return new Facade.Group(options);

        }

        this._options = this._defaultOptions();
        this._metrics = this._defaultMetrics();

        this._objects = [];

        this.setOptions(options);

    };

    /*!
     * Extend from Facade.Entity
     */

    Facade.Group.prototype = Object.create(Facade.Entity.prototype);
    Facade.Group.constructor = Facade.Entity;

    /**
     * Renders a group of entities to a canvas.
     *
     *     group._draw(stage);
     *
     * @param {Object} facade Facade.js object.
     * @return {void}
     * @api private
     */

    Facade.Group.prototype._draw = function (facade, options) {

        var context = facade.context,
            metrics = options ? this._setMetrics(options, true) : this.getAllMetrics(),
            i,
            length;

        this._applyTransforms(context, options, metrics);

        for (i = 0, length = this._objects.length; i < length; i = i + 1) {

            facade.addToStage(this._objects[i]);

        }

    };

    /**
     * Custom configuration for options specific to a group entity.
     *
     *     console.log(group._configOptions(options));
     *
     * @param {Object} options Complete set of group specific options.
     * @return {Object} Converted options.
     * @api private
     */

    Facade.Group.prototype._configOptions = function (options) {

        options.translate = [ options.x, options.y ];

        return options;

    };

    /**
     * Adds a Facade.js entity to a group.
     *
     *     group.addToGroup(circle);
     *
     * @param {Object|Array} obj Facade.js entity or an array of entities.
     * @return {void}
     * @api public
     */

    Facade.Group.prototype.addToGroup = function (obj) {

        var i,
            length;

        if (obj instanceof Facade.Entity) {

            if (this._objects.indexOf(obj) === -1) {

                this._objects.push(obj);

                this._setMetrics();

            }

        } else if (isArray(obj)) {

            for (i = 0, length = obj.length; i < length; i = i + 1) {

                if (this._objects.indexOf(obj[i]) === -1) {

                    this._objects.push(obj[i]);

                }

            }

            this._setMetrics();

        } else {

            throw new Error('Object passed to Facade.addToStage is not a valid Facade.js entity.');

        }

    };

    /**
     * Tests the existence of an entity within a group.
     *
     *     group.addToGroup(circle);
     *
     * @param {Object} obj Facade.js entity.
     * @return {Boolean} Result of the test.
     * @api public
     */

    Facade.Group.prototype.hasEntity = function (obj) {

        return this._objects.indexOf(obj) !== -1;

    };

    /**
     * Removes a Facade.js entity from a group.
     *
     *     group.removeFromGroup(circle);
     *
     * @param {Object} obj Facade.js entity.
     * @return {void}
     * @api public
     */

    Facade.Group.prototype.removeFromGroup = function (obj) {

        if (obj instanceof Facade.Entity) {

            if (this._objects.indexOf(obj) !== -1) {

                this._objects.splice(this._objects.indexOf(obj), 1);

                this._setMetrics();

            }

        }

    };

    /**
     * Set metrics based on the groups's entities and options.
     *
     *     console.log(group._setMetrics());
     *
     * @return {Object} Object with metrics as key-value pairs.
     * @api private
     */

    Facade.Group.prototype._setMetrics = function (updated) {

        var metrics = this._defaultMetrics(),
            options = this.setOptions(updated, true),
            bounds = { top: null, right: null, bottom: null, left: null },
            i,
            length,
            anchor,
            obj_metrics;

        for (i = 0, length = this._objects.length; i < length; i = i + 1) {

            obj_metrics = this._objects[i].getAllMetrics();

            if (obj_metrics.x < bounds.left || bounds.left === null) {

                bounds.left = obj_metrics.x;

            }

            if (obj_metrics.y < bounds.top || bounds.top === null) {

                bounds.top = obj_metrics.y;

            }

            if (obj_metrics.x + obj_metrics.width > bounds.right || bounds.right === null) {

                bounds.right = obj_metrics.x + obj_metrics.width;

            }

            if (obj_metrics.y + obj_metrics.height > bounds.bottom || bounds.bottom === null) {

                bounds.bottom = obj_metrics.y + obj_metrics.height;

            }

        }

        metrics.x = options.x + bounds.left;
        metrics.y = options.y + bounds.top;
        metrics.width = (bounds.right - bounds.left) * options.scale;
        metrics.height = (bounds.bottom - bounds.top) * options.scale;

        anchor = this._getAnchorPoint(options, metrics);

        metrics.x = options.x + anchor[0];
        metrics.y = options.y + anchor[1];

        if (!updated) {

            this._metrics = metrics;

        }

        return metrics;

    };

    /*!
     * AMD Support
     */

    if (typeof define === 'function' && define.amd !== undefined) {

        define([], function () { return Facade; });

    } else if (typeof module === 'object' && module.exports !== undefined) {

        module.exports = Facade;

    } else {

        window.Facade = Facade;

    }

}());
