/*!
 * Facade.js v0.3.0beta
 * https://github.com/neogeek/facade.js
 *
 * Copyright (c) 2014 Scott Doxey
 * Dual-licensed under both MIT and BSD licenses.
 */

(function () {

    'use strict';

    var _requestAnimationFrame,
        _cancelAnimationFrame,
        // _context = document.createElement('canvas').getContext('2d'),
        _contextProperties = [ 'fillStyle', 'font', 'globalAlpha', 'globalCompositeOperation', 'lineCap', 'lineJoin', 'lineWidth', 'miterLimit', 'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'strokeStyle', 'textAlign', 'textBaseline' ],
        _TO_RADIANS = Math.PI / 180;

    /*!
     * requestAnimationFrame Support
     */

    (['webkit', 'moz']).forEach(function (key) {
        _requestAnimationFrame = _requestAnimationFrame || window.requestAnimationFrame || window[key + 'RequestAnimationFrame'] || null;
        _cancelAnimationFrame = _cancelAnimationFrame || window.cancelAnimationFrame || window[key + 'CancelAnimationFrame'] || null;
    });

    /**
     * Checks an object to see if it is an array. Returns a boolean result.
     *
     *  console.log(isArray([1, 2, 3, 4, 5])); // true
     *  console.log(isArray({ x: 0, y: 0, width: 100, height: 100 })); // false
     *
     * @param {Object} obj The object to be checked.
     * @return {Boolean} Result of the test.
     * @api private
     */

    function isArray(obj) {

        return Object.prototype.toString.call(obj) === '[object Array]' ? true : false;

    }

    /**
     * Checks an object to see if it is a function. Returns a boolean result.
     *
     *  console.log(isFunction(this._draw)); // true
     *
     * @param {Object} obj The object to be checked.
     * @return {Boolean} Result of the test.
     * @api private
     */

    function isFunction(obj) {

        return Object.prototype.toString.call(obj) === '[object Function]' ? true : false;

    }

    /**
     * Creates a new Facade.js object with either a preexisting canvas tag or a unique name, width, and height.
     *
     *  var stage = new Facade(document.querySelector('canvas'));
     *  var stage = new Facade('stage', 500, 300);
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

        if (canvas && typeof canvas === 'object' && canvas.nodeType === 1) {

            this.canvas = canvas;

        } else {

            this.canvas = document.createElement('canvas');

            if (typeof canvas === 'string') {

                this.canvas.setAttribute('id', canvas);

            }

        }

        if (width && height) {

            this.canvas.setAttribute('width', parseInt(width, 10));
            this.canvas.setAttribute('height', parseInt(height, 10));

        }

        try {

            this.context = this.canvas.getContext('2d');

        } catch (e) {

            throw new Error('Canvas passed to Facade.js was not a valid canvas element.');

        }

        this.dt = null;
        this.fps = null;
        this.ftime = null;

        this._callback = null;

        this._requestAnimation = null;

    }

    /**
     * Draws a Facade.js object to the stage.
     *
     *  stage.addToStage(circle);
     *
     * @param {Object} obj Facade.js entity object.
     * @return {Object} Facade.js object.
     * @api public
     */

    Facade.prototype.addToStage = function (obj) {

        if (!(obj instanceof Facade.Entity)) {

            throw new Error('Parameter passed to Facade.addToStage is not a valid Facade.js entity object');

        }

        obj.draw(this);

        return this;

    };

    /**
     * Clears the canvas.
     *
     *  stage.clear();
     *
     * @return {Object} Facade.js object.
     * @api public
     */

    Facade.prototype.clear = function () {

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        return this;

    };

    /**
     * Sets a callback function to run in a loop using <a href="https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame" target="_blank">requestAnimationFrame</a> or avalible polyfill.
     *
     *  stage.draw(function () {
     *
     *      this.clear();
     *
     *      this.addToStage(circle, { x: 100, y: 100 });
     *
     *  });
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
     *  console.log(stage.exportBase64('image/png', 100));
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
     *  console.log(stage.height()); // 300
     *  console.log(stage.height(600)); // 600
     *
     * @param {Integer?} height Height in pixels.
     * @return {Integer} Height in pixels.
     * @api public
     */

    Facade.prototype.height = function (height) {

        if (height) {

            this.canvas.setAttribute('height', parseInt(height, 10));

        }

        return this.canvas.height;

    };

    /**
     * Applys key and value pairs to appropriate <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D" target="_blank">CanvasRenderingContext2D</a> properties and methods.
     *
     *  console.log(stage.renderWithContext({ fillStyle: '#f00', globalAlpha: 0.5, fillRect: [ 0, 0, 100, 100 ]}));
     *
     * @param {Object?} options Context property or method names with corresponding values.
     * @param {Function?} callback Function to be called when context options have been rendered to the canvas.
     * @return {void}
     * @api public
     */

    Facade.prototype.renderWithContext = function (options, callback) {

        var key;

        this.context.save();

        for (key in options) {

            if (options.hasOwnProperty(key)) {

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
     * Starts the callback supplied in <code>Facade.draw</code>.
     *
     *  stage.start();
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
     *  stage.stop();
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
     *  console.log(stage.width()); // 400
     *  console.log(stage.width(800)); // 800
     *
     * @param {Integer?} width Width in pixels.
     * @return {Integer} Width in pixels.
     * @api public
     */

    Facade.prototype.width = function (width) {

        if (width) {

            this.canvas.setAttribute('width', parseInt(width, 10));

        }

        return this.canvas.width;

    };

    /**
     * Method called by <a href="https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame" target="_blank">requestAnimationFrame</a>. Sets <code>Facade.dt</code> and <code>Facade.fps</code>.
     *
     *  this._requestAnimation = _requestAnimationFrame(this._animate.bind(this));
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

            this._requestAnimation = _requestAnimationFrame(this._animate.bind(this));

            this.ftime = time;

            this.context.save();

            this._callback();

            this.context.restore();

        } else {

            this.stop();

        }

        return this;

    };

    /**
     * The constructor for all Facade.js shapes, images and text objects.
     *
     * @api private
     */

    Facade.Entity = function () { return undefined; };

    /**
     * Returns a default set of options common to all Facade.js entities.
     *
     *  console.log(Facade.Entity.prototype._defaultOptions());
     *
     * @param {Object} updated Additional options key/value pairs.
     * @return {Object} Default set of options.
     * @api private
     */

    Facade.Entity.prototype._defaultOptions = function (updated) {

        var options,
            key;

        options = {
            x: 0,
            y: 0
        };

        for (key in updated) {

            if (updated.hasOwnProperty(key)) {

                options[key] = updated[key];

            }

        }

        return options;

    };

    /**
     * Returns a default set of metrics common to all Facade.js entities.
     *
     *  console.log(Facade.Entity.prototype._defaultMetrics());
     *
     * @param {Object} updated Additional metric key/value pairs.
     * @return {Object} Default set of metrics.
     * @api private
     */

    Facade.Entity.prototype._defaultMetrics = function (updated) {

        var metrics = { x: null, y: null, width: null, height: null },
            key;

        for (key in updated) {

            if (updated.hasOwnProperty(key)) {

                metrics[key] = updated[key];

            }

        }

        return metrics;

    };

    /**
     * Retrives the value of a given option. Only retrieves options set when creating a new Facade.js entity object or <a href="#facade.entity.prototype.setoptions"><code>setOptions</code></a> not through temperary options set through <a href="#facade.addtostage"><code>Facade.addToStage</code></a>.
     *
     *  console.log(text.getOption('value'));
     *
     * @param {String} key The name of the option.
     * @return {Object|Function|String|Integer} Value of the option requested.
     * @api public
     */

    Facade.Entity.prototype.getOption = function (key) {

        if (this._options.hasOwnProperty(key)) {

            return this._options[key];

        }

        return undefined;

    };

    /**
     * Retrives the value of all options. Only retrieves options set when creating a new Facade.js entity object or <a href="#facade.entity.prototype.setoptions"><code>setOptions</code></a> not through temperary options set through <a href="#facade.addtostage"><code>Facade.addToStage</code></a>.
     *
     *  console.log(text.getAllOptions());
     *
     * @return {Object} Object containing all options.
     * @api public
     */

    Facade.Entity.prototype.getAllOptions = function () {

        var options = {},
            key;

        for (key in this._options) {

            if (this._options.hasOwnProperty(key)) {

                options[key] = this._options[key];

            }

        }

        return options;

    };

    /**
     * Sets an option for a given object.
     *
     *  console.log(text.setOptions('value', 'Hello world!'));
     *
     * @param {String} key The option to update.
     * @param {Object|Function|String|Integer} value The new value of the specified option.
     * @param {Boolean} test Flag to determine if options are to be saved or not.
     * @return {Object|Function|String|Integer} Returns value of the updated option.
     * @api public
     */

    Facade.Entity.prototype.setOption = function (key, value, test) {

        var options = this.getAllOptions();

        if (options.hasOwnProperty(key)) {

            if (String(typeof options[key]) === String(typeof value)) {

                if (test !== true) {

                    this._options[key] = value;

                }

            } else {

                throw new Error('The value for ' + key + ' (' + value + ') was a ' + typeof value + ' not a ' + typeof this._options[key]);

            }

            return value;

        }

        return undefined;

    };

    /**
     * Sets a group of option key/value pairs to an object.
     *
     *  console.log(text.setOptions({ value: 'Hello world!', fontFamily: 'Georgia' }));
     *
     * @param {Object} updated The options to update. Does not need to be entire set of options.
     * @param {Boolean} test Flag to determine if options are to be saved or not.
     * @return {Object} Updated options.
     * @api public
     */

    Facade.Entity.prototype.setOptions = function (updated, test) {

        var options = this.getAllOptions(),
            key;

        for (key in updated) {

            if (updated.hasOwnProperty(key) && options.hasOwnProperty(key)) {

                options[key] = this.setOption(key, updated[key], test);

            }

        }

        return options;

    };

    /**
     * Retrives the value of a given metric. Only retrieves metrics set when creating a new Facade.js entity object or <a href="#facade.entity.prototype.setoptions"><code>setOptions</code></a> not through temperary options set through <a href="#facade.addtostage"><code>Facade.addToStage</code></a>.
     *
     *  console.log(text.getMetric('width'));
     *
     * @param {String} key The name of the metric.
     * @return {Integer} Value of the metric requested.
     * @api public
     */

    Facade.Entity.prototype.getMetric = function (key) {

        if (this._metrics.hasOwnProperty(key)) {

            return this._metrics[key];

        }

        return undefined;

    };

    /**
     * Retrives the value of all metrics. Only retrieves metrics set when creating a new Facade.js entity object or <a href="#facade.entity.prototype.setoptions"><code>setOptions</code></a> not through temperary options set through <a href="#facade.addtostage"><code>Facade.addToStage</code></a>.
     *
     *  console.log(text.getAllMetrics());
     *
     * @return {Object} Object containing all metrics.
     * @api public
     */

    Facade.Entity.prototype.getAllMetrics = function () {

        var metrics = {},
            key;

        for (key in this._metrics) {

            if (this._metrics.hasOwnProperty(key)) {

                metrics[key] = this._metrics[key];

            }

        }

        return metrics;

    };

    /**
     * Renders an entity to a canvas.
     *
     *  console.log(entity.draw(stage));
     *
     * @param {Object} facade Facade.js object.
     * @return {void}
     * @api public
     */

    Facade.Entity.prototype.draw = function (facade) {

        var options = this.getAllOptions();

        if (isFunction(this._configOptions)) {

            options = this._configOptions(options);

        }

        if (isFunction(this._draw)) {

            facade.renderWithContext(options, this._draw.bind(this, facade));

        }

    };

    /**
     * Create a polygon object. Inherits all methods from <b>Facade.Entity</b>.
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
     *  console.log(Facade.Polygon.prototype._defaultOptions());
     *
     * @param {Object} updated Additional option key/value pairs.
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
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 1,
            lineCap: 'default',
            lineJoin: 'miter',
            closePath: true
        });

        for (key in updated) {

            if (updated.hasOwnProperty(key)) {

                options[key] = updated[key];

            }

        }

        return options;

    };

    /**
     * Renders a polygon entity to a canvas.
     *
     *  console.log(entity.draw(stage));
     *
     * @param {Object} facade Facade.js object.
     * @return {void}
     * @api private
     */

    Facade.Polygon.prototype._draw = function (facade) {

        var context = facade.context,
            options = this.getAllOptions(),
            point;

        if (isFunction(this._configOptions)) {

            options = this._configOptions(options);

        }

        if (options.points.length) {

            context.beginPath();

            for (point in options.points) {

                if (options.points.hasOwnProperty(point)) {

                    if (options.points[point].length === 6) {

                        context.bezierCurveTo.apply(context, options.points[point]);

                    } else if (options.points[point].length === 5) {

                        context.arc.apply(context, options.points[point]);

                    } else {

                        context.lineTo.apply(context, options.points[point]);

                    }

                }

            }

            if (options.closePath) {

                context.closePath();

            } else {

                context.moveTo.apply(context, options.points[point]);

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
     *  console.log(polygon._configOptions(options));
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
     * Set metrics based on the polygon's current options.
     *
     *  console.log(polygon._setMetrics());
     *
     * @return {Object} Object with metric key/value pairs.
     * @api private
     */

    Facade.Polygon.prototype._setMetrics = function () {

        var metrics = this.getAllMetrics(),
            options = this.getAllOptions(),
            bounds = { top: null, right: null, bottom: null, left: null },
            point;

        if (isFunction(this._configOptions)) {

            options = this._configOptions(options);

        }

        for (point in options.points) {

            if (options.points.hasOwnProperty(point)) {

                if (options.points[point].length === 2) {

                    point = { x: options.points[point][0], y: options.points[point][1] };

                } else if (options.points[point].length === 5) {

                    metrics.width = options.points[point][2] * 2;
                    metrics.height = options.points[point][2] * 2;

                    point = {
                        x: options.points[point][0] - options.points[point][2],
                        y: options.points[point][1] - options.points[point][2]
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

        }

        metrics.x = options.x + bounds.left;
        metrics.y = options.y + bounds.top;

        if (metrics.width === null && metrics.height === null) {

            metrics.width = bounds.right - bounds.left;
            metrics.height = bounds.bottom - bounds.top;

        }

        if (options.lineWidth) {

            metrics.x = metrics.x - options.lineWidth / 2;
            metrics.y = metrics.y - options.lineWidth / 2;

            metrics.width = metrics.width + options.lineWidth;
            metrics.height = metrics.height + options.lineWidth;

        }

        return metrics;

    };

    /**
     * Create a circle object. Inherits all methods from <b>Facade.Polygon</b>.
     */

    Facade.Circle = function (options) {

        if (!(this instanceof Facade.Circle)) {

            return new Facade.Circle(options);

        }

        this._options = this._defaultOptions({ radius: 0, begin: 0, end: 360 });
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
     *  console.log(circle._configOptions(options));
     *
     * @param {Object} options Complete set of circle specific options.
     * @return {Object} Converted options.
     * @api private
     */

    Facade.Circle.prototype._configOptions = function (options) {

        options.translate = [ options.x, options.y ];
        options.globalAlpha = options.opacity / 100;

        options.points = [ [ 0, 0, options.radius, options.begin * _TO_RADIANS, options.end * _TO_RADIANS ] ];

        return options;

    };

    /**
     * Create a line object. Inherits all methods from <b>Facade.Polygon</b>.
     */

    Facade.Line = function (options) {

        if (!(this instanceof Facade.Line)) {

            return new Facade.Line(options);

        }

        this._options = this._defaultOptions({ x1: 0, y1: 0, x2: 0, y2: 0 });
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
     *  console.log(line._configOptions(options));
     *
     * @param {Object} options Complete set of line specific options.
     * @return {Object} Converted options.
     * @api private
     */

    Facade.Line.prototype._configOptions = function (options) {

        options.translate = [ options.x, options.y ];
        options.globalAlpha = options.opacity / 100;

        options.points = [ [ options.x1, options.y1 ], [ options.x2, options.y2 ] ];

        return options;

    };

    /**
     * Create a rectangle object. Inherits all methods from <b>Facade.Polygon</b>.
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
     *  console.log(rect._configOptions(options));
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
     * Create a group object. Inherits all methods from <b>Facade.Entity</b>.
     */

    Facade.Group = function (options) {

        if (!(this instanceof Facade.Group)) {

            return new Facade.Group(options);

        }

        this._options = this._defaultOptions();
        this._metrics = this._defaultMetrics();

        this.setOptions(options);

        this._objects = [];

    };

    /*!
     * Extend from Facade.Entity
     */

    Facade.Group.prototype = Object.create(Facade.Entity.prototype);
    Facade.Group.constructor = Facade.Entity;

    /**
     * Renders a group of entities to a canvas.
     *
     *  console.log(group.draw(stage));
     *
     * @param {Object} facade Facade.js object.
     * @return {void}
     * @api private
     */

    Facade.Group.prototype._draw = function (facade) {

        var key;

        for (key in this._objects) {

            if (this._objects.hasOwnProperty(key)) {

                facade.addToStage(this._objects[key]);

            }

        }

    };

    /**
     * Custom configuration for options specific to a group entity.
     *
     *  console.log(group._configOptions(options));
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
     * Add a Facade.js entity to a group.
     *
     *  console.log(group.addToGroup(circle));
     *
     * @param {Object} obj Facade.js entitiy.
     * @return {void}
     * @api private
     */

    Facade.Group.prototype.addToGroup = function (obj) {

        if (obj instanceof Facade.Entity) {

            if (this._objects.indexOf(obj) === -1) {

                this._objects.push(obj);

            }

        }

    };

    /**
     * Remove a Facade.js entity to a group.
     *
     *  console.log(group.removeFromGroup(circle));
     *
     * @param {Object} obj Facade.js entitiy.
     * @return {void}
     * @api private
     */

    Facade.Group.prototype.removeFromGroup = function (obj) {

        if (obj instanceof Facade.Entity) {

            if (this._objects.indexOf(obj) !== -1) {

                this._objects.splice(this._objects.indexOf(obj), 1);

            }

        }

    };

    /**
     * Set metrics based on the groups's entities.
     *
     *  console.log(group._setMetrics());
     *
     * @return {Object} Object with metric key/value pairs.
     * @api private
     */

    Facade.Group.prototype._setMetrics = function () {

        var metrics = this.getAllMetrics(),
            options = this.getAllOptions(),
            key,
            obj_metrics;

        for (key in this._objects) {

            if (this._objects.hasOwnProperty(key)) {

                obj_metrics = this._objects[key]._setMetrics();

                if (obj_metrics.x < metrics.x || metrics.x === null) {

                    metrics.x = obj_metrics.x;

                }

                if (obj_metrics.y < metrics.y || metrics.y === null) {

                    metrics.y = obj_metrics.y;

                }

                if (metrics.width === null) {

                    metrics.width = obj_metrics.width;

                } else if (obj_metrics.x - metrics.x + obj_metrics.width > metrics.width) {

                    metrics.width = obj_metrics.x - metrics.x + obj_metrics.width;

                }

                if (metrics.height === null) {

                    metrics.height = obj_metrics.height;

                } else if (obj_metrics.y - metrics.y + obj_metrics.width > metrics.height) {

                    metrics.height = obj_metrics.y - metrics.y + obj_metrics.width;

                }

            }

        }

        metrics.x = options.x + metrics.x;
        metrics.y = options.y + metrics.y;

        return metrics;

    };

    /*!
     * AMD Support
     */

    if (typeof window.define === 'function' && window.define.hasOwnProperty('amd')) {

        window.define([], function () { return Facade; });

    } else {

        window.Facade = Facade;

    }

}());