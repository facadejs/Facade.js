/*!
 * Facade.js (facadejs.com)
 * Copyright (c) 2013 Scott Doxey
 * Dual-licensed under both MIT and BSD licenses.
 */

(function () {

	'use strict';

	var _requestAnimationFrame,
		_cancelAnimationFrame,
		_context = document.createElement('canvas').getContext('2d');

	/*!
	 * requestAnimationFrame Support
	 */

	(['webkit', 'moz']).forEach(function (key) {
		_requestAnimationFrame = _requestAnimationFrame || window.requestAnimationFrame || window[key + 'RequestAnimationFrame'] || null;
		_cancelAnimationFrame = _cancelAnimationFrame || window.cancelAnimationFrame || window[key + 'CancelAnimationFrame'] || null;
	});

	/**
	 * Checks an object to see if it is a JavaScript array. Returns a boolean result.
	 *
	 *	console.log(isArray([1, 2, 3, 4, 5])); // true
	 *	console.log(isArray({ x: 0, y: 0, width: 100, height: 100 })); // false
	 *
	 * @param {Object} obj The object to be checked.
	 * @return {Boolean} Result of the test.
	 * @api private
	 */

	function isArray(obj) {

		return Object.prototype.toString.call(obj) === '[object Array]' ? true : false;

	}

	/**
	 * Creates a new Facade.js object with either a preexisting canvas tag or a unique name, width, and height.
	 *
	 *	var stage = new Facade(document.getElementById('stage'));
	 *	var stage = new Facade('stage', 500, 300);
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

			throw new Error('Parameter passed to Facade.js is not a valid canvas element');

		}

		this.dt = 0;
		this.fps = 0;
		this.ftime = null;

		this._callback = null;

		this._requestAnimation = null;

	}

	/**
	 * Draws a Facade.js object to the stage. Allows for temporary options to be use while drawing an object.
	 *
	 *	stage.addToStage(circle);
	 *	stage.addToStage(circle, { scale: 2 });
	 *
	 * @param {Object} obj Facade.js entity object.
	 * @param {Object?} options Temperary options.
	 * @return {Object} Facade.js object.
	 * @api public
	 */

	Facade.prototype.addToStage = function (obj, options) {

		var metrics;

		if (!(obj instanceof Facade.Entity)) {

			throw new Error('Parameter passed to Facade.addToStage is not a valid Facade.js entity object');

		}

		if (options) {

			options = obj.setOptions(options, true);
			metrics = obj._setMetrics(options, true);

		} else {

			options = obj.getAllOptions();
			metrics = obj.getAllMetrics();

		}

		if (obj.isVisible(this, metrics)) {

			this.context.save();

			obj._draw.call(obj, this, options, metrics);

			this.context.restore();

		}

		return this;

	};

	/**
	 * Method called by <a href="https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame" target="_blank">requestAnimationFrame</a>. Sets <code>Facade.dt</code> and <code>Facade.fps</code>.
	 *
	 *	this._requestAnimation = _requestAnimationFrame(this._animate.bind(this));
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

			this._callback.call(this);

			this.context.restore();

		} else {

			this.stop();

		}

		return this;

	};

	/**
	 * Clears the canvas.
	 *
	 *	stage.clear();
	 *
	 * @return {Object} Facade.js object.
	 * @api public
	 */

	Facade.prototype.clear = function () {

		this.context.clearRect(0, 0, this.width(), this.height());

		return this;

	};

	/**
	 * Sets a callback function to run in a loop using <a href="https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame" target="_blank">requestAnimationFrame</a>.
	 *
	 *	stage.draw(function () {
	 *
	 *		this.clear();
	 *
	 *		this.addToStage(circle, { x: 100, y: 100 });
	 *
	 *	});
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
	 *	console.log(stage.exportBase64('image/png', 100));
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
	 *	console.log(stage.height()); // 300
	 *	console.log(stage.height(600)); // 600
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
	 * Starts the callback supplied in <code>Facade.draw</code>.
	 *
	 *	stage.start();
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
	 *	stage.stop();
	 *
	 * @return {Object} Facade.js object.
	 * @api public
	 */

	Facade.prototype.stop = function () {

		this.dt = 0;
		this.fps = 0;
		this.ftime = null;

		this._requestAnimation = _cancelAnimationFrame(this._requestAnimation);

		return this;

	};

	/**
	 * Gets and sets the canvas width.
	 *
	 *	console.log(stage.width()); // 400
	 *	console.log(stage.width(800)); // 800
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
	 * The constructor for all Facade.js shapes, images and text objects.
	 *
	 * @api private
	 */

	Facade.Entity = function () { };

	/**
	 * Returns a default set of options common to all Facade.js entities.
	 *
	 *	console.log(Facade.Entity.prototype._defaultOptions());
	 *
	 * @return {Object} Default set of options.
	 * @api private
	 */

	Facade.Entity.prototype._defaultOptions = function () {

		return {
			x: 0,
			y: 0,
			shadowBlur: 0,
			shadowColor: '#000',
			shadowOffsetX: 0,
			shadowOffsetY: 0,
			anchor: 'top/left',
			opacity: 100,
			flip: '',
			rotate: 0,
			scale: 1
		};

	};

	/**
	 * Returns a default set of metrics common to all Facade.js entities.
	 *
	 *	console.log(Facade.Entity.prototype._defaultMetrics());
	 *
	 * @return {Object} Default set of metrics.
	 * @api private
	 */

	Facade.Entity.prototype._defaultMetrics = function () {

		return {
			x: null,
			y: null,
			width: null,
			height: null
		};

	};

	/**
	 * Sets options for a given <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D" target="_blank">CanvasRenderingContext2D</a> object based on passed options and metrics.
	 *
	 *	this._setContext(context, options, metrics);
	 *
	 * @param {Object} context A <a href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D" target="_blank">CanvasRenderingContext2D</a> object.
	 * @param {Object} options An options object based on <a href="#facade.entity.prototype.defaultoptions">Facade.Entity._defaultOptions()</a> and the extended key/value pairs through the custom options.
	 * @param {Object} metrics A metrics object based on <a href="#facade.entity.prototype.defaultmetrics">Facade.Entity._defaultMetrics()</a> and the extended key/value pairs through the custom metrics.
	 * @return {void}
	 * @api private
	 */

	Facade.Entity.prototype._setContext = function (context, options, metrics) {

		var rotate = this._getRotatePoint(options, metrics),
			flip_horizontal = options.flip.match(/horizontal/),
			flip_vertical = options.flip.match(/vertical/);

		context.translate(metrics.x, metrics.y);

		if (options.rotate) {

			context.translate(rotate[0], rotate[1]);
			context.rotate(options.rotate * Math.PI / 180);
			context.translate(-rotate[0], -rotate[1]);

		}

		if (flip_horizontal) {
			context.translate(metrics.width, 0);
		}

		if (flip_vertical) {
			context.translate(0, metrics.height);
		}

		context.scale(options.scale, options.scale);

		if (flip_horizontal) {
			context.scale(-1, 1);
		}

		if (flip_vertical) {
			context.scale(1, -1);
		}

		context.globalAlpha = options.opacity / 100;

		if (options.fillStyle) {
			context.fillStyle = options.fillStyle;
		}

		if (options.lineCap) {
			context.lineCap = options.lineCap;
		}

		if (options.lineWidth) {
			context.lineWidth = options.lineWidth;
			context.strokeStyle = options.strokeStyle;
		}

		if (options.shadowBlur) {
			context.shadowBlur = options.shadowBlur;
			context.shadowColor = options.shadowColor;
			context.shadowOffsetX = options.shadowOffsetX;
			context.shadowOffsetY = options.shadowOffsetY;
		}

		if (options.fontStyle) {
			context.font = options.fontStyle + ' ' + options.fontSize + 'px ' + options.fontFamily;
			context.textBaseline = options.textBaseline;
		}

	};

	/**
	 * Retrives the value of a given option. Only retrieves options set when creating a new Facade.js entity object or <a href="#facade.entity.prototype.setoptions"><code>setOptions</code></a> not through temperary options set through <a href="#facade.addtostage"><code>Facade.addToStage</code></a>.
	 *
	 *	console.log(text.getOption('value'));
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
	 *	console.log(text.getAllOptions());
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
	 * Sets all options for a given object.
	 *
	 *	console.log(text.setOptions({ value: 'Hello world!', fontFamily: 'Georgia' }));
	 *
	 * @param {Object} updated The options to update. Does not need to be entire set of options.
	 * @param {Boolean} test Flag to determine if options are to be saved or not.
	 * @return {Object} Updated options.
	 * @api public
	 */

	Facade.Entity.prototype.setOptions = function (updated, test) {

		var options = {},
			key;

		for (key in this._options) {

			if (this._options.hasOwnProperty(key)) {

				if (updated && updated.hasOwnProperty(key)) {

					if (typeof this._options[key] === typeof updated[key]) {

						options[key] = updated[key];

						if (test !== true) {

							this._options[key] = updated[key];

						}

					} else {

						throw new Error('The value for ' + key + ' was a ' + typeof updated[key] + ' not a ' + typeof this._options[key]);

					}

				} else {

					options[key] = this._options[key];

				}

			}

		}

		if (test !== true) {

			this._setMetrics(options, test);

		}

		return options;

	};

	/**
	 * Retrives the value of a given metric. Only retrieves metrics set when creating a new Facade.js entity object or <a href="#facade.entity.prototype.setoptions"><code>setOptions</code></a> not through temperary options set through <a href="#facade.addtostage"><code>Facade.addToStage</code></a>.
	 *
	 *	console.log(text.getMetric('width'));
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
	 *	console.log(text.getAllMetrics());
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
	 * Method used to test if an object is visible on a given canvas. Optional metrics parameter used to test an object with different metrics.
	 *
	 *	console.log(box.isVisible(stage.canvas));
	 *	console.log(box.isVisible(stage.canvas, { x: 200, y: 200, width: 100, height: 100 }));
	 *
	 * @param {Object} canvas Facade.js object or canvas element.
	 * @param {Object?} metrics Optional test metrics.
	 * @return {Boolean} Result of the test.
	 * @api public
	 */

	Facade.Entity.prototype.isVisible = function (canvas, metrics) {

		if (canvas instanceof Facade) {

			canvas = canvas.canvas;

		}

		if (canvas && typeof canvas === 'object' && canvas.nodeType === 1) {

			if (typeof metrics === 'undefined') {

				metrics = this._metrics;

			}

			if (metrics.x < canvas.width && metrics.x + metrics.width > 0 && metrics.y < canvas.height && metrics.y + metrics.height > 0) {

				return true;

			}

		} else {

			throw new Error('Parameter passed to Facade.Entity.isVisible is not a valid canvas element');

		}

		return false;

	};

	/**
	 * Gets the anchor point to draw an object at.
	 *
	 *	var anchor = this._getAnchorPoint(options, metrics);
	 *
	 * @param {Object} options Facade.js object options.
	 * @param {Object} metrics Facade.js object metrics.
	 * @return {Object} Array with x and y coordinates.
	 * @api private
	 */

	Facade.Entity.prototype._getAnchorPoint = function (options, metrics) {

		var x = options.x,
			y = options.y;

		if (options.anchor.match(/^center/)) {

			y = options.y - (metrics.height / 2);

		} else if (options.anchor.match(/^bottom/)) {

			y = options.y - metrics.height;

		}

		if (options.anchor.match(/center$/)) {

			x = options.x - (metrics.width / 2);

		} else if (options.anchor.match(/right$/)) {

			x = options.x - metrics.width;

		}

		return [ x, y ];

	};

	/**
	 * Gets the anchor point to rotate an object at.
	 *
	 *	var rotate = this._getRotatePoint(options, metrics);
	 *
	 * @param {Object} options Facade.js object options.
	 * @param {Object} metrics Facade.js object metrics.
	 * @return {Object} Array with x and y coordinates.
	 * @api private
	 */

	Facade.Entity.prototype._getRotatePoint = function (options, metrics) {

		var x = 0,
			y = 0;

		if (options.anchor.match(/^center/)) {

			y = metrics.height / 2;

		} else if (options.anchor.match(/^bottom/)) {

			y = metrics.height;

		}

		if (options.anchor.match(/center$/)) {

			x = metrics.width / 2;

		} else if (options.anchor.match(/right$/)) {

			x = metrics.width;

		}

		return [ x, y ];

	};

	/**
	 * Create a circle object. Inherits all methods from <b>Facade.Entity</b>.
	 *
	 *	var circle = new Facade.Circle({ x: 250, y: 250, radius: 50, anchor: 'center' });
	 *
	 * @param {Object?} options Options to create the circle with.
	 * @return {Object} Reference to the new Facade.js circle object.
	 * @api public
	 */

	Facade.Circle = function (options) {

		if (!(this instanceof Facade.Circle)) {

			return new Facade.Circle(options);

		}

		this._options = this._defaultOptions();
		this._metrics = this._defaultMetrics();

		this._options.radius = 10;
		this._options.start = 0;
		this._options.end = 360;
		this._options.counterclockwise = false;
		this._options.fillStyle = '#000';
		this._options.strokeStyle = '#000';
		this._options.strokePosition = 'default';
		this._options.lineWidth = 0;
		this._options.lineCap = 'butt';

		this.setOptions(options);

	};

	/*!
	 * Extend from Facade.Entity
	 */

	Facade.Circle.prototype = Object.create(Facade.Entity.prototype);

	/**
	 * Renders the circle on the specified Facade.js canvas with the custom options and metrics.
	 *
	 *	circle._draw(stage, circle.getAllOptions(), circle.getAllMetrics());
	 *
	 * @param {Object} facade Facade.js object.
	 * @param {Object} options The options to render the circle with.
	 * @param {Object} metrics The metrics to render the circle with.
	 * @return {void}
	 * @api private
	 */

	Facade.Circle.prototype._draw = function (facade, options, metrics) {

		var context = facade.context,
			strokeOffset = 0;

		this._setContext(context, options, metrics);

		context.beginPath();

		context.arc(
			0,
			0,
			options.radius,
			options.start * Math.PI / 180,
			options.end * Math.PI / 180,
			options.counterclockwise
		);

		if (options.fillStyle) {

			context.fill();

		}

		if (options.strokePosition.match(/(in|out)set/)) {

			if (options.strokePosition === 'inset') {

				strokeOffset = -(options.lineWidth / 2);

			} else if (options.strokePosition === 'outset') {

				strokeOffset = (options.lineWidth / 2);

			}

			context.closePath();
			context.beginPath();

			context.arc(
				0,
				0,
				options.radius + strokeOffset,
				options.start * Math.PI / 180,
				options.end * Math.PI / 180,
				options.counterclockwise
			);

		}

		if (options.lineWidth) {

			context.stroke();

		}

		context.closePath();

	};

	/**
	 * Sets the metrics of the circle based on supplied options.
	 *
	 *	console.log(circle._setMetrics(circle.getAllOptions()));
	 *
	 * @param {Object} options Options to set the metrics with.
	 * @param {Boolean?} test Flag to determine if metrics are saved or not.
	 * @return {Object} Updated metrics.
	 * @api private
	 */

	Facade.Circle.prototype._setMetrics = function (options, test) {

		var metrics = this.getAllMetrics(),
			anchor,
			strokeWidth = 0;

		if (options.strokePosition === 'default') {

			strokeWidth = options.lineWidth / 2;

		} else if (options.strokePosition === 'outset') {

			strokeWidth = options.lineWidth;

		}

		metrics.width = ((options.radius + strokeWidth) * 2) * options.scale;
		metrics.height = ((options.radius + strokeWidth) * 2) * options.scale;

		anchor = this._getAnchorPoint(options, metrics);

		metrics.x = anchor[0] + ((options.radius + strokeWidth) * options.scale);
		metrics.y = anchor[1] + ((options.radius + strokeWidth) * options.scale);

		if (test !== true) {

			this._metrics = metrics;

		}

		return metrics;

	};

	/**
	 * Create an image object. Inherits all methods from <b>Facade.Entity</b>.
	 *
	 *	var image = new Facade.Image('images/player.png', { width: 50, height: 90, anchor: 'bottom/center' });
	 *
	 * @property {Object} image Reference to the image element.
	 * @property {Integer} currentFrame Current frame of sprite animation.
	 * @property {Boolean} isAnimating Boolean state of sprite animation.
	 * @param {Object|String} source Local image file or reference to an HTML image tag.
	 * @param {Object?} options Options to create the image with.
	 * @return {Object} Reference to the new Facade.js image object.
	 * @api public
	 */

	Facade.Image = function (source, options) {

		if (typeof source === 'undefined') {

			throw new Error('Required parameter "source" missing from Facade.Image call');

		}

		if (!(this instanceof Facade.Image)) {

			return new Facade.Image(source, options);

		}

		this._options = this._defaultOptions();
		this._metrics = this._defaultMetrics();

		this._options.width = 0;
		this._options.height = 0;
		this._options.offsetX = 0;
		this._options.offsetY = 0;
		this._options.tileX = 1;
		this._options.tileY = 1;
		this._options.frames = [];
		this._options.speed = 120;
		this._options.loop = true;
		this._options.callback = function (frame) { };

		this.image = this.load(source);

		this.currentFrame = 0;

		this.isAnimating = false;

		this.setOptions(options);

	};

	/*!
	 * Extend from Facade.Entity
	 */

	Facade.Image.prototype = Object.create(Facade.Entity.prototype);

	/**
	 * Starts an image sprite animation.
	 *
	 *	image.play();
	 *
	 * @return {Object} Facade.js image object.
	 * @api public
	 */

	Facade.Image.prototype.play = function () {

		this.isAnimating = true;

		return this;

	};

	/**
	 * Pauses an image sprite animation.
	 *
	 *	image.pause();
	 *
	 * @return {Object} Facade.js image object.
	 * @api public
	 */

	Facade.Image.prototype.pause = function () {

		this.isAnimating = false;

		return this;

	};

	/**
	 * Resets an image sprite animation.
	 *
	 *	image.reset();
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
	 *	image.stop();
	 *
	 * @return {Object} Facade.js image object.
	 * @api public
	 */

	Facade.Image.prototype.stop = function () {

		this.currentFrame = 0;

		this.isAnimating = false;

		return this;

	};

	/**
	 * Loads an image into a Facade.js image object.
	 *
	 *	image.load('image/tiles.png');
	 *	image.load(document.getElementById('avatar'));
	 *
	 * @param {Object|String} source Local image file or reference to an HTML image element.
	 * @return {Object} Reference to the HTML image element.
	 * @api public
	 */

	Facade.Image.prototype.load = function (source) {

		var image;

		if (typeof source === 'object' && source.nodeType === 1) {

			image = source;

			if (image.complete) {

				this._setMetrics.call(this, this._options);

			} else {

				image.addEventListener('load', this._setMetrics.bind(this, this._options));

			}

		} else {

			image = document.createElement('img');
			image.setAttribute('src', source);
			image.addEventListener('load', this._setMetrics.bind(this, this._options));

		}

		return image;

	};

	/**
	 * Renders the image on the specified Facade.js canvas with the custom options and metrics.
	 *
	 *	image._draw(stage, image.getAllOptions(), image.getAllMetrics());
	 *
	 * @param {Object} facade Facade.js object.
	 * @param {Object} options The options to render the image with.
	 * @param {Object} metrics The metrics to render the image with.
	 * @return {void}
	 * @api private
	 */

	Facade.Image.prototype._draw = function (facade, options, metrics) {

		var context = facade.context,
			currentOffsetX = 0,
			x = 0,
			y = 0;

		if (this.image.complete) {

			this._setContext(context, options, metrics);

			if (options.frames.length) {

				currentOffsetX = options.frames[this.currentFrame] || 0;

			}

			for (x = 0; x < options.tileX; x += 1) {

				for (y = 0; y < options.tileY; y += 1) {

					context.drawImage(
						this.image,
						(options.width * currentOffsetX) + options.offsetX,
						options.offsetY,
						options.width,
						options.height,
						options.width * x,
						options.height * y,
						options.width,
						options.height
					);

				}

			}

			if (this.isAnimating && options.frames.length) {

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
	 * Sets the metrics of the image based on supplied options.
	 *
	 *	console.log(image._setMetrics(image.getAllOptions()));
	 *
	 * @param {Object} options Options to set the metrics with.
	 * @param {Boolean} test Flag to determine if metrics are saved or not.
	 * @return {Object} Updated metrics.
	 * @api private
	 */

	Facade.Image.prototype._setMetrics = function (options, test) {

		var metrics = this.getAllMetrics(),
			anchor;

		if (this.image.complete) {

			options.width = options.width || this.image.width;
			options.height = options.height || this.image.height;

			metrics.width = (options.width * options.tileX) * options.scale;
			metrics.height = (options.height * options.tileY) * options.scale;

			anchor = this._getAnchorPoint(options, metrics);

			metrics.x = anchor[0];
			metrics.y = anchor[1];

			if (test !== true) {

				this._metrics = metrics;

			}

			return metrics;

		}

	};

	/**
	 * Create a line object. Inherits all methods from <b>Facade.Entity</b>.
	 *
	 *	var line = new Facade.Line({ x: 250, y: 250, startX: 250, startY: 0, endX: 250, endY: 250, lineWidth: 1, anchor: 'center' });
	 *
	 * @param {Object} options Options to create the line with.
	 * @return {Object} Reference to the new Facade.js line object.
	 * @api public
	 */

	Facade.Line = function (options) {

		if (!(this instanceof Facade.Line)) {

			return new Facade.Line(options);

		}

		this._options = this._defaultOptions();
		this._metrics = this._defaultMetrics();

		this._options.startX = 0;
		this._options.startY = 0;
		this._options.endX = 0;
		this._options.endY = 0;
		this._options.strokeStyle = '#000';
		this._options.lineWidth = 0;
		this._options.lineCap = 'butt';

		this.setOptions(options);

	};

	/*!
	 * Extend from Facade.Entity
	 */

	Facade.Line.prototype = Object.create(Facade.Entity.prototype);

	/**
	 * Renders the line on the specified Facade.js canvas with the custom options and metrics.
	 *
	 *	line._draw(stage, line.getAllOptions(), line.getAllMetrics());
	 *
	 * @param {Object} facade Facade.js object.
	 * @param {Object} options The options to render the line with.
	 * @param {Object} metrics The metrics to render the line with.
	 * @return {void}
	 * @api private
	 */

	Facade.Line.prototype._draw = function (facade, options, metrics) {

		var context = facade.context;

		this._setContext(context, options, metrics);

		context.beginPath();

		context.moveTo(0, 0);
		context.lineTo(
			options.endX - options.startX,
			options.endY - options.startY
		);

		context.stroke();

		context.closePath();

	};

	/**
	 * Sets the metrics of the line based on supplied options.
	 *
	 *	console.log(line._setMetrics(line.getAllOptions()));
	 *
	 * @param {Object} options Options to set the metrics with.
	 * @param {Boolean?} test Flag to determine if metrics are saved or not.
	 * @return {Object} Updated metrics.
	 * @api private
	 */

	Facade.Line.prototype._setMetrics = function (options, test) {

		var metrics = this.getAllMetrics(),
			anchor;

		metrics.width = Math.abs(options.endX - options.startX) * options.scale;
		metrics.height = Math.abs(options.endY - options.startY) * options.scale;

		anchor = this._getAnchorPoint(options, metrics);

		metrics.x = anchor[0];
		metrics.y = anchor[1];

		if (test !== true) {

			this._metrics = metrics;

		}

		return metrics;

	};

	/**
	 * Create a rectangle object. Inherits all methods from <b>Facade.Entity</b>.
	 *
	 *	var rect = new Facade.Rect({ width: 100, height: 100, fillStyle: '#f00' });
	 *
	 * @param {Object} options Options to create the rectangle with.
	 * @return {Object} Reference to the new Facade.js rectangle object.
	 * @api public
	 */

	Facade.Rect = function (options) {

		if (!(this instanceof Facade.Rect)) {

			return new Facade.Rect(options);

		}

		this._options = this._defaultOptions();
		this._metrics = this._defaultMetrics();

		this._options.width = 100;
		this._options.height = 100;
		this._options.fillStyle = '#000';
		this._options.strokeStyle = '#000';
		this._options.strokePosition = 'default';
		this._options.lineWidth = 0;
		this._options.borderRadius = 0;

		this.setOptions(options);

	};

	/*!
	 * Extend from Facade.Entity
	 */

	Facade.Rect.prototype = Object.create(Facade.Entity.prototype);

	/**
	 * Renders the rectangle on the specified Facade.js canvas with the custom options and metrics.
	 *
	 *	rect._draw(stage, rect.getAllOptions(), rect.getAllMetrics());
	 *
	 * @param {Object} facade Facade.js object.
	 * @param {Object} options The options to render the rectangle with.
	 * @param {Object} metrics The metrics to render the rectangle with.
	 * @return {void}
	 * @api private
	 */

	Facade.Rect.prototype._draw = function (facade, options, metrics) {

		var context = facade.context,
			borderRadius;

		this._setContext(context, options, metrics);

		context.beginPath();

		if (options.borderRadius) {

			borderRadius = Math.min(
				options.borderRadius,
				options.height / 2,
				options.width / 2
			);

			context.moveTo(borderRadius, 0);

			context.arc(
				options.width - borderRadius,
				borderRadius,
				borderRadius,
				Math.PI * 1.5,
				0
			);

			context.arc(
				options.width - borderRadius,
				options.height - borderRadius,
				borderRadius,
				0,
				Math.PI * 0.5
			);

			context.arc(
				borderRadius,
				options.height - borderRadius,
				borderRadius,
				Math.PI * 0.5,
				Math.PI
			);

			context.arc(
				borderRadius,
				borderRadius,
				borderRadius,
				Math.PI,
				Math.PI * 1.5
			);

			if (options.fillStyle) {

				context.fill();

			}

			if (options.lineWidth) {

				context.stroke();

			}

		} else {

			if (options.fillStyle) {

				context.fillRect(0, 0, options.width, options.height);

			}

			if (options.lineWidth) {

				if (options.strokePosition === 'inset') {

					context.strokeRect(options.lineWidth / 2, options.lineWidth / 2, options.width - options.lineWidth, options.height - options.lineWidth);

				} else if (options.strokePosition === 'outset') {

					context.strokeRect(-options.lineWidth / 2, -options.lineWidth / 2, options.width + options.lineWidth, options.height + options.lineWidth);

				} else {

					context.strokeRect(0, 0, options.width, options.height);

				}

			}

		}

		context.closePath();

	};

	/**
	 * Sets the metrics of the rectangle based on supplied options.
	 *
	 *	console.log(rect._setMetrics(rect.getAllOptions()));
	 *
	 * @param {Object} options Options to set the metrics with.
	 * @param {Boolean} test Flag to determine if metrics are saved or not.
	 * @return {Object} Updated metrics.
	 * @api private
	 */

	Facade.Rect.prototype._setMetrics = function (options, test) {

		var metrics = this.getAllMetrics(),
			anchor,
			strokeWidth = 0;

		if (options.strokePosition === 'default') {

			strokeWidth = options.lineWidth / 2;

		} else if (options.strokePosition === 'outset') {

			strokeWidth = options.lineWidth;

		}

		metrics.width = (options.width + (strokeWidth * 2)) * options.scale;
		metrics.height = (options.height + (strokeWidth * 2)) * options.scale;

		anchor = this._getAnchorPoint(options, metrics);

		metrics.x = anchor[0] + (strokeWidth * options.scale);
		metrics.y = anchor[1] + (strokeWidth * options.scale);

		if (test !== true) {

			this._metrics = metrics;

		}

		return metrics;

	};

	/**
	 * Create a text object. Inherits all methods from <b>Facade.Entity</b>.
	 *
	 *	var text = new Facade.Text({ value: 'Hello World!', x: 250, y: 250, anchor: 'center' });
	 *
	 * @options {Integer?} x X coordinate to begin drawing an object. <i>Default:</i> 0
	 * @options {Integer?} y Y coordinate to begin drawing an object. <i>Default:</i> 0
	 * @options {Integer?} shadowBlur Blur level for drop shadow. <i>Default:</i> 0
	 * @options {String?} shadowColor Can be a text representation of a color, a HEX value or RBG(A).  <i>Default:</i> "#000"<br><ul><li>red</li><li>#F00</li><li>rgb(255, 0, 0);</li><li>rgba(255, 0, 0, 1);</li></ul>
	 * @options {Integer?} shadowOffsetX X offset of drop shadow. <i>Default:</i> 0
	 * @options {Integer?} shadowOffsetY Y offset of drop shadow. <i>Default:</i> 0
	 * @options {String?} anchor Position to anchor the object. <i>Default:</i> "top/left"<br><ul><li>center</li><li>center/right</li><li>bottom/right</li><li>bottom/center</li><li>bottom/left</li><li>center/left</li><li>top/left</li><li>top/center</li><li>top/right</li></ul>
	 * @options {Integer?} opacity Opacity of the object. Integer between 0 and 100. <i>Default:</i> 100
	 * @options {String?} flip Direction to flip the object. Can be either one or both of the following options. Delimited by a <code>/</code>. <i>Default:</i> ""<br><ul><li>horizontal</li><li>vertical</li></ul>
	 * @options {Integer?} rotate Degrees to rotate the object. <i>Default:</i> 0
	 * @options {Integer?} scale Scaling of the object. A float starting at 1. <i>Default:</i> 1
	 * @options {Integer?} width Width of the object.
	 * @options {String?} value Value of the text object.
	 * @options {String?} fontFamily Sets the font family of the text. Only one font can be specified at a time. <i>Default:</i> "Arial"
	 * @options {Integer?} fontSize Font size in pixels. <i>Default:</i> 30
	 * @options {String?} fontStyle Font style of the text. <i>Default:</i> "normal"<br><ul><li>normal</li><li>bold</li><li>italic</li></ul>
	 * @options {String?} lineHeight Line height of the text drawn on multiple lines. New lines are delimited with <code>\n</code>. <i>Default:</i> Inherits from <code>fontSize</code>
	 * @options {String?} textAlign Horizontal alignment of the text. <i>Default:</i> "left"<br><ul><li>left</li><li>center</li><li>right</li></ul>
	 * @options {String?} textBaseline Baseline to set the vertical alignment of the text drawn. <i>Default:</i> "top"<br><ul><li>top</li><li>hanging</li><li>middle</li><li>alphabetic</li><li>ideographic</li><li>bottom</li></ul>
	 * @options {String?} fillStyle Fill color for the object. Can be a text representation of a color, a HEX value or RBG(A). <i>Default:</i> "#000"<br><ul><li>red</li><li>#F00</li><li>rgb(255, 0, 0);</li><li>rgba(255, 0, 0, 1);</li></ul>
	 * @options {String?} strokeStyle Color of an object's stroke. Can be a text representation of a color, a HEX value or RBG(A).  <i>Default:</i> "#000"<br><ul><li>red</li><li>#F00</li><li>rgb(255, 0, 0);</li><li>rgba(255, 0, 0, 1);</li></ul>
	 * @options {Integer?} lineWidth Width of the stroke. <i>Default:</i> 0
	 * @param {Object} options Options to create the text with.
	 * @return {Object} Reference to the new Facade.js text object.
	 * @api public
	 */

	Facade.Text = function (options) {

		if (!(this instanceof Facade.Text)) {

			return new Facade.Text(options);

		}

		this._options = this._defaultOptions();
		this._metrics = this._defaultMetrics();

		this._options.width = 0;
		this._options.value = '';
		this._options.fontFamily = 'Arial';
		this._options.fontSize = 30;
		this._options.fontStyle = 'normal';
		this._options.lineHeight = 0;
		this._options.textAlign = 'left';
		this._options.textBaseline = 'top';
		this._options.fillStyle = '#000';
		this._options.strokeStyle = '#000';
		this._options.lineWidth = 0;

		this.setOptions(options);

	};

	/*!
	 * Extend from Facade.Entity
	 */

	Facade.Text.prototype = Object.create(Facade.Entity.prototype);

	/**
	 * Renders the text on the specified Facade.js canvas with the custom options and metrics.
	 *
	 *	text._draw(stage, text.getAllOptions(), text.getAllMetrics());
	 *
	 * @param {Object} facade Facade.js object.
	 * @param {Object} options The options to render the text with.
	 * @param {Object} metrics The metrics to render the text with.
	 * @return {void}
	 * @api private
	 */

	Facade.Text.prototype._draw = function (facade, options, metrics) {

		var context = facade.context,
			offsetX = 0,
			line,
			length;

		this._setContext(context, options, metrics);

		if (!isArray(options.value)) {

			options.value = options.value.split(/[ ]*\n[ ]*/);

		}

		if (!options.lineHeight) {

			options.lineHeight = options.fontSize;

		}

		for (line = 0, length = options.value.length; line < length; line += 1) {

			if (options.textAlign === 'center') {

				offsetX = (options.width - context.measureText(options.value[line]).width) / 2;

			} else if (options.textAlign === 'right') {

				offsetX = options.width - context.measureText(options.value[line]).width;

			}

			if (options.fillStyle) {

				context.fillText(options.value[line], offsetX, line * options.lineHeight);

			}

			if (options.lineWidth) {

				context.strokeText(options.value[line], offsetX, line * options.lineHeight);

			}

		}

	};

	/**
	 * Sets the metrics of the text based on supplied options.
	 *
	 *	console.log(text._setMetrics(text.getAllOptions()));
	 *
	 * @param {Object} options Options to set the metrics with.
	 * @param {Boolean?} test Flag to determine if metrics are saved or not.
	 * @return {Object} Updated metrics.
	 * @api private
	 */

	Facade.Text.prototype._setMetrics = function (options, test) {

		var metrics = this.getAllMetrics(),
			anchor,
			line,
			length;

		_context.font = options.fontStyle + ' ' + options.fontSize + 'px ' + options.fontFamily;

		if (!isArray(options.value)) {

			options.value = options.value.split(/[ ]*\n[ ]*/);

		}

		if (!options.lineHeight) {

			options.lineHeight = options.fontSize;

		}

		for (line = 0, length = options.value.length; line < length; line += 1) {

			options.width = Math.max(options.width, _context.measureText(options.value[line]).width);

		}

		metrics.width = options.width * options.scale;
		metrics.height = (length * options.lineHeight) * options.scale;

		anchor = this._getAnchorPoint(options, metrics);

		metrics.x = anchor[0];
		metrics.y = anchor[1];

		if (test !== true) {

			this._metrics = metrics;

		}

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