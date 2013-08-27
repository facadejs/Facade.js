/*!
 * Facade.js (facadejs.com)
 * Copyright (c) 2013 Scott Doxey
 * Dual-licensed under both MIT and BSD licenses.
 */

/*jslint browser: true*/
/*jslint nomen: true*/

var Facade = (function () {

	'use strict';

	(['webkit', 'moz']).forEach(function (key) {
		window.requestAnimationFrame = window.requestAnimationFrame || window[key + 'RequestAnimationFrame'] || null;
		window.cancelAnimationFrame = window.cancelAnimationFrame || window[key + 'CancelAnimationFrame'] || null;
	});

	var _context = document.createElement('canvas').getContext('2d');

	function isArray(obj) {

		return Object.prototype.toString.call(obj) === '[object Array]' ? true : false;

	}

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

	Facade.prototype.addToStage = function (obj, options) {

		if (!(obj instanceof Facade.Entity)) {

			throw new Error('Parameter passed to Facade.addToStage is not a valid Facade.js object');

		}

		if (obj.isVisible(this.canvas)) {

			this.context.save();

			obj._draw.call(obj, this, options ? obj.setOptions(options, true) : obj.getAllOptions());

			this.context.restore();

		}

		return this;

	};

	Facade.prototype._animate = function (time) {

		if (typeof this._callback === 'function') {

			if (this.ftime) {

				this.dt = time - this.ftime;

				this.fps = (1000 / this.dt).toFixed(2);

			}

			this._requestAnimation = window.requestAnimationFrame(this._animate.bind(this));

			this.ftime = time;

			this.context.save();

			this._callback.call(this);

			this.context.restore();

		} else {

			this.stop();

		}

		return this;

	};

	Facade.prototype.clear = function () {

		this.context.clearRect(0, 0, this.width(), this.height());

		return this;

	};

	Facade.prototype.draw = function (callback) {

		if (typeof callback === 'function') {

			this._callback = callback;

			this.start();

		} else {

			throw new Error('Parameter passed to Facade.draw is not a valid function');

		}

		return this;

	};

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

	Facade.prototype.height = function () {

		return this.canvas.height;

	};

	Facade.prototype.start = function () {

		this._requestAnimation = window.requestAnimationFrame(this._animate.bind(this));

		return this;

	};

	Facade.prototype.stop = function () {

		this.dt = 0;
		this.fps = 0;
		this.ftime = 0;

		this._requestAnimation = window.cancelAnimationFrame(this._requestAnimation);

		return this;

	};

	Facade.prototype.width = function () {

		return this.canvas.width;

	};

	Facade.Entity = function () { };

	Facade.Entity.prototype.defaultOptions = function () {

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

	Facade.Entity.prototype._setContext = function (context, options) {

		var metrics = this._setMetrics(options, true),
			rotate = this._getRotatePoint(options, metrics),
			flip_horizontal = options.flip.match(/horizontal/),
			flip_vertical = options.flip.match(/vertical/);

		context.translate(metrics.x, metrics.y);

		if (options.rotate && (rotate[0] || rotate[1])) {

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

	Facade.Entity.prototype.getOption = function (key) {

		if (this._options.hasOwnProperty(key)) {

			return this._options[key];

		}

		return undefined;

	};

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

						throw new Error('The value for ' + key + ' was a '  + typeof updated[key] + ' not a ' + typeof this._options[key]);

					}

				} else {

					options[key] = this._options[key];

				}

			}

		}

		this._setMetrics(options, test);

		return options;

	};

	Facade.Entity.prototype.defaultMetrics = function () {

		return {
			x: null,
			y: null,
			width: null,
			height: null
		};

	};

	Facade.Entity.prototype.getMetric = function (key) {

		if (this._metrics.hasOwnProperty(key)) {

			return this._metrics[key];

		}

		return undefined;

	};

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

	Facade.Entity.prototype.isVisible = function (canvas) {

		if (canvas && typeof canvas === 'object' && canvas.nodeType === 1) {

			if (this._metrics.x < canvas.width && this._metrics.x + this._metrics.width > 0 && this._metrics.y < canvas.height && this._metrics.y + this._metrics.height > 0) {

				return true;

			}

		} else {

			throw new Error('Parameter passed to Facade.Entity.isVisible is not a valid canvas element');

		}

		return false;

	};

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

	Facade.Circle = function (options) {

		if (!(this instanceof Facade.Circle)) {

			return new Facade.Circle(options);

		}

		this._options = this.defaultOptions();
		this._metrics = this.defaultMetrics();

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

	Facade.Circle.prototype = Object.create(Facade.Entity.prototype);

	Facade.Circle.prototype._draw = function (facade, options) {

		var context = facade.context,
			strokeOffset = 0;

		this._setContext(context, options);

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

	Facade.Image = function (source, options) {

		if (typeof source === 'undefined') {

			throw new Error('Required parameter "source" missing from Facade.Image call');

		}

		if (!(this instanceof Facade.Image)) {

			return new Facade.Image(options);

		}

		this._options = this.defaultOptions();
		this._metrics = this.defaultMetrics();

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

		this.image = this.load(source, options);

		this.currentFrame = 0;

		this.isAnimating = false;

	};

	Facade.Image.prototype = Object.create(Facade.Entity.prototype);

	Facade.Image.prototype.play = function () {

		this.isAnimating = true;

		return this;

	};

	Facade.Image.prototype.pause = function () {

		this.isAnimating = false;

		return this;

	};

	Facade.Image.prototype.reset = function () {

		this.currentFrame = 0;

		return this;

	};

	Facade.Image.prototype.stop = function () {

		this.currentFrame = 0;

		this.isAnimating = false;

		return this;

	};

	Facade.Image.prototype.load = function (source, options) {

		var image;

		if (typeof source === 'object' && source.nodeType === 1) {

			image = source;

			if (image.complete) {

				this.setOptions.call(this, options);

			} else {

				image.addEventListener('load', this.setOptions.bind(this, options));

			}

		} else {

			image = document.createElement('img');
			image.setAttribute('src', source);
			image.addEventListener('load', this.setOptions.bind(this, options));

		}

		return image;

	};

	Facade.Image.prototype._draw = function (facade, options) {

		var context = facade.context,
			currentOffsetX = 0,
			x = 0,
			y = 0;

		if (this.image.complete) {

			this._setContext(context, options);

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

	Facade.Line = function (options) {

		if (!(this instanceof Facade.Line)) {

			return new Facade.Line(options);

		}

		this._options = this.defaultOptions();
		this._metrics = this.defaultMetrics();

		this._options.startX = 0;
		this._options.startY = 0;
		this._options.endX = 0;
		this._options.endY = 0;
		this._options.strokeStyle = '#000';
		this._options.lineWidth = 0;
		this._options.lineCap = 'butt';

		this.setOptions(options);

	};

	Facade.Line.prototype = Object.create(Facade.Entity.prototype);

	Facade.Line.prototype._draw = function (facade, options) {

		var context = facade.context;

		this._setContext(context, options);

		context.beginPath();

		context.moveTo(0, 0);
		context.lineTo(
			options.endX - options.startX,
			options.endY - options.startY
		);

		context.stroke();

		context.closePath();

	};

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

	Facade.Rect = function (options) {

		if (!(this instanceof Facade.Rect)) {

			return new Facade.Rect(options);

		}

		this._options = this.defaultOptions();
		this._metrics = this.defaultMetrics();

		this._options.width = 100;
		this._options.height = 100;
		this._options.fillStyle = '#000';
		this._options.strokeStyle = '#000';
		this._options.strokePosition = 'default';
		this._options.lineWidth = 0;
		this._options.borderRadius = 0;

		this.setOptions(options);

	};

	Facade.Rect.prototype = Object.create(Facade.Entity.prototype);

	Facade.Rect.prototype._draw = function (facade, options) {

		var context = facade.context,
			borderRadius;

		this._setContext(context, options);

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

	Facade.Text = function (options) {

		if (!(this instanceof Facade.Text)) {

			return new Facade.Text(options);

		}

		this._options = this.defaultOptions();
		this._metrics = this.defaultMetrics();

		this._options.width = 0;
		this._options.value = '';
		this._options.fontFamily = 'Arial';
		this._options.fontSize = 30;
		this._options.fontStyle = 'normal';
		this._options.lineHeight = 30;
		this._options.textAlign = 'left';
		this._options.textBaseline = 'top';
		this._options.fillStyle = '#000';
		this._options.strokeStyle = '#000';
		this._options.lineWidth = 0;

		this.setOptions(options);

	};

	Facade.Text.prototype = Object.create(Facade.Entity.prototype);

	Facade.Text.prototype._draw = function (facade, options) {

		var context = facade.context,
			offsetX = 0,
			line,
			length;

		this._setContext(context, options);

		if (!isArray(options.value)) {

			options.value = options.value.split(/[ ]*\n[ ]*/);

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

	Facade.Text.prototype._setMetrics = function (options, test) {

		var metrics = this.getAllMetrics(),
			anchor,
			line,
			length;

		_context.font = options.fontStyle + ' ' + options.fontSize + 'px ' + options.fontFamily;

		if (!isArray(options.value)) {

			options.value = options.value.split(/[ ]*\n[ ]*/);

		}

		for (line = 0, length = options.value.length; line < length; line += 1) {

			options.width = Math.max(options.width, _context.measureText(options.value[line]).width);

		}

		options.height = length * options.lineHeight;

		metrics.width = options.width * options.scale;
		metrics.height = options.height * options.scale;

		anchor = this._getAnchorPoint(options, metrics);

		metrics.x = anchor[0];
		metrics.y = anchor[1];

		if (test !== true) {

			this._metrics = metrics;

		}

		return metrics;

	};

	if (typeof window.define === 'function' && window.define.hasOwnProperty('amd')) {

		window.define([], function () { return Facade; });

	}

	return Facade;

}());