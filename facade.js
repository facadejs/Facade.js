/*!
 * Facade.js (facadejs.com)
 * Copyright (c) 2013 Scott Doxey
 * Dual-licensed under both MIT and BSD licenses.
 */

/*jslint browser: true*/
/*jslint nomen: true*/

window.Facade = (function () {

	'use strict';

	(['webkit', 'moz']).forEach(function (key) {
		window.requestAnimationFrame = window.requestAnimationFrame ||
			window[key + 'RequestAnimationFrame'] || null;
		window.cancelAnimationFrame = window.cancelAnimationFrame ||
			window[key + 'CancelAnimationFrame'] || null;
	});

	var Facade = function (canvas, width, height) {

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

			if (width && height) {

				this.canvas.setAttribute('width', parseInt(width, 10));
				this.canvas.setAttribute('height', parseInt(height, 10));

			}

		}

		try {

			this.context = this.canvas.getContext('2d');

		} catch (e) {

			throw new Error('Object passed to Facade.js is not a valid canvas element.');

		}

		this.dt = 0;
		this.fps = 0;
		this.ftime = null;

		this.callback = null;

		this.requestAnimation = null;

	};

	Facade.prototype.addToStage = function (obj, options) {

		if (!(obj instanceof Facade.Entity)) {

			throw new Error('Object passed to Facade.addToStage is not a valid Facade.js object.');

		}

		var metrics,
			border_radius,
			offset_x = 0,
			line,
			length,
			x,
			y;

		options = obj.setOptions(options, true);

		this.context.save();

		this.setAnchorPoint.call(this, obj, options);

		metrics = obj.getAllMetrics();

		if (!(obj instanceof Facade.Image)) {

			if (metrics.x + metrics.width < 0 || metrics.y + metrics.height < 0 || metrics.x > this.canvas.width || metrics.y > this.canvas.height) {

				this.context.restore();

				return this;

			}

		}

		this.context.scale(options.scale, options.scale);

		this.setRotate.call(this, obj, options);

		if (options.fillStyle) {

			this.context.fillStyle = options.fillStyle;

		}

		this.context.globalAlpha = options.opacity / 100;

		if (options.lineCap) {

			this.context.lineCap = options.lineCap;

		}

		if (options.lineWidth) {

			this.context.strokeStyle = options.strokeStyle;
			this.context.lineWidth = options.lineWidth;

		}

		if (options.shadowBlur) {

			this.context.shadowBlur = options.shadowBlur;
			this.context.shadowColor = options.shadowColor;
			this.context.shadowOffsetX = options.shadowOffsetX;
			this.context.shadowOffsetY = options.shadowOffsetY;

		}

		if (obj instanceof Facade.Circle) {

			this.context.beginPath();

			this.context.arc(
				0,
				0,
				options.radius,
				options.start * Math.PI / 180,
				options.end * Math.PI / 180,
				options.counterclockwise
			);

			if (options.fillStyle) {

				this.context.fill();

			}

			if (options.strokePosition === 'inset') {

				this.context.closePath();
				this.context.beginPath();

				this.context.arc(
					0,
					0,
					options.radius - (options.lineWidth / 2),
					options.start * Math.PI / 180,
					options.end * Math.PI / 180,
					options.counterclockwise
				);

			} else if (options.strokePosition === 'outset') {

				this.context.closePath();
				this.context.beginPath();

				this.context.arc(
					0,
					0,
					options.radius + (options.lineWidth / 2),
					options.start * Math.PI / 180,
					options.end * Math.PI / 180,
					options.counterclockwise
				);

			}

			if (options.lineWidth) {

				this.context.stroke();

			}

			this.context.closePath();

		} else if (obj instanceof Facade.Image && obj.isLoaded) {

			if (options.frames.length) {

				offset_x = options.frames[obj.frame];

			}

			for (x = 0; x < options.tileX; x += 1) {

				for (y = 0; y < options.tileY; y += 1) {

					if (metrics.x + options.width * (x + 1) < 0 || metrics.y + options.height * (y + 1) < 0 || metrics.x + options.width * x > this.canvas.width || metrics.y + options.height * y > this.canvas.height) {

						break;

					}

					obj.setMetrics({
						width: metrics.width * (x + 1),
						height: metrics.height * (y + 1)
					});

					this.context.drawImage(
						obj.img,
						(options.width * offset_x) + options.offsetX,
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

			if (options.frames.length) {

				if (!obj.ftime) {

					obj.ftime = this.ftime;

					if (typeof options.callback === 'function') {

						options.callback.call(obj, options.frames[obj.frame]);

					}

				}

				if (this.ftime - obj.ftime >= options.speed) {

					obj.ftime = this.ftime;
					obj.frame += 1;

					if (obj.frame >= options.frames.length) {

						if (options.loop) {

							obj.frame = 0;

						} else {

							obj.frame = options.frames.length - 1;

						}

					}

					if (typeof options.callback === 'function') {

						options.callback.call(obj, options.frames[obj.frame]);

					}

				}

			}

		} else if (obj instanceof Facade.Line) {

			this.context.beginPath();

			this.context.moveTo(0, 0);
			this.context.lineTo(
				options.endX - options.startX,
				options.endY - options.startY
			);

			this.context.stroke();

			this.context.closePath();

		} else if (obj instanceof Facade.Rect) {

			this.context.beginPath();

			if (options.borderRadius) {

				border_radius = Math.min(
					options.borderRadius,
					options.height / 2,
					options.width / 2
				);

				this.context.moveTo(border_radius, 0);

				this.context.arc(
					options.width - border_radius,
					border_radius,
					border_radius,
					Math.PI * 1.5,
					0
				);

				this.context.arc(
					options.width - border_radius,
					options.height - border_radius,
					border_radius,
					0,
					Math.PI * 0.5
				);

				this.context.arc(
					border_radius,
					options.height - border_radius,
					border_radius,
					Math.PI * 0.5,
					Math.PI
				);

				this.context.arc(
					border_radius,
					border_radius,
					border_radius,
					Math.PI,
					Math.PI * 1.5
				);

				if (options.fillStyle) {

					this.context.fill();

				}

				if (options.lineWidth) {

					this.context.stroke();

				}

			} else {

				if (options.fillStyle) {

					this.context.fillRect(0, 0, options.width, options.height);

				}

				if (options.lineWidth) {

					if (options.strokePosition === 'inset') {

						this.context.closePath();
						this.context.beginPath();

						this.context.strokeRect(
							options.lineWidth / 2,
							options.lineWidth / 2,
							options.width - options.lineWidth,
							options.height - options.lineWidth
						);

					} else if (options.strokePosition === 'outset') {

						this.context.closePath();
						this.context.beginPath();

						this.context.strokeRect(
							-options.lineWidth / 2,
							-options.lineWidth / 2,
							options.width + options.lineWidth,
							options.height + options.lineWidth
						);

					} else {

						this.context.strokeRect(0, 0, options.width, options.height);

					}

				}

			}

			this.context.closePath();

		} else if (obj instanceof Facade.Text) {

			this.context.font = options.fontStyle + ' ' + parseInt(options.fontSize, 10) + 'px ' + options.fontFamily;
			this.context.textBaseline = options.textBaseline;

			if (typeof options.value === 'string') {

				options.value = options.value.split(/[ ]*\n[ ]*/);

			}

			if (options.lineHeight === null) {

				options.lineHeight = options.fontSize;

			}

			for (line = 0, length = options.value.length; line < length; line += 1) {

				if (options.textAlign === 'center') {

					offset_x = (options.width - this.context.measureText(options.value[line]).width) / 2;

				} else if (options.textAlign === 'right') {

					offset_x = options.width - this.context.measureText(options.value[line]).width;

				}

				if (options.fillStyle) {

					this.context.fillText(options.value[line], offset_x, line * parseInt(options.lineHeight, 10));

				}

				if (options.lineWidth) {

					this.context.strokeText(options.value[line], offset_x, line * parseInt(options.lineHeight, 10));

				}

			}

		}

		this.context.restore();

		return this;

	};

	Facade.prototype.animate = function (time) {

		if (typeof this.callback === 'function') {

			if (this.ftime) {

				this.dt = time - this.ftime;

				this.fps = (1000 / this.dt).toFixed(2);

			}

			this.requestAnimation = window.requestAnimationFrame(this.animate.bind(this));

			this.ftime = time;

			this.callback.call(this);

		} else {

			this.stop();

		}

		return this;

	};

	Facade.prototype.clear = function () {

		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		return this;

	};

	Facade.prototype.draw = function (callback) {

		this.callback = callback;

		this.start();

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

	Facade.prototype.setAnchorPoint = function (obj, options) {

		var x = 0,
			y = 0,
			line,
			length;

		if (obj instanceof Facade.Circle) {

			options.width = options.radius * 2;
			options.height = options.radius * 2;

		} else if (obj instanceof Facade.Line) {

			options.width = Math.abs(options.endX - options.startX);
			options.height = Math.abs(options.endY - options.startY);

		} else if (obj instanceof Facade.Text) {

			this.context.font = options.fontStyle + ' ' + parseInt(options.fontSize, 10) + 'px ' + options.fontFamily;

			if (typeof options.value === 'string') {

				options.value = options.value.split(/[ ]*\n[ ]*/);

			}

			if (options.lineHeight === null) {

				options.lineHeight = options.fontSize;

			}

			for (line = 0, length = options.value.length; line < length; line += 1) {

				options.width = Math.max(options.width, this.context.measureText(options.value[line]).width);

			}

			options.height = length * parseInt(options.lineHeight, 10);

		}

		obj.setMetrics({
			width: options.width * options.scale,
			height: options.height * options.scale
		});

		if (typeof options.lineWidth !== 'undefined') {

			if (options.strokePosition === 'default') {

				obj.setMetrics({
					width: obj.getMetric('width') + options.lineWidth / 2,
					height: obj.getMetric('height') + options.lineWidth / 2,
				});

			} else if (options.strokePosition === 'outset') {

				obj.setMetrics({
					width: obj.getMetric('width') + options.lineWidth,
					height: obj.getMetric('height') + options.lineWidth,
				});

			}

		}

		if (options.anchor.match(/^top/)) {

			if (typeof options.radius !== 'undefined') {

				y = options.radius;

			}

			if (typeof options.lineWidth !== 'undefined') {

				if (options.strokePosition === 'default') {

					y += options.lineWidth / 2;

				} else if (options.strokePosition === 'outset') {

					y += options.lineWidth;

				}

			}

		} else if (options.anchor.match(/^bottom/)) {

			if (typeof options.radius !== 'undefined') {

				y = -options.radius;

			} else {

				y = -options.height;

			}

			if (typeof options.lineWidth !== 'undefined') {

				if (options.strokePosition === 'default') {

					y -= options.lineWidth / 2;

				} else if (options.strokePosition === 'outset') {

					y -= options.lineWidth;

				}

			}

		} else if (options.anchor.match(/^center/)) {

			if (typeof options.radius === 'undefined') {

				y = -(options.height / 2);

			}

		}

		if (options.anchor.match(/left$/)) {

			if (typeof options.radius !== 'undefined') {

				x = options.radius;

			}

			if (typeof options.lineWidth !== 'undefined') {

				if (options.strokePosition === 'default') {

					x += options.lineWidth / 2;

				} else if (options.strokePosition === 'outset') {

					x += options.lineWidth;

				}

			}

		} else if (options.anchor.match(/right$/)) {

			if (typeof options.radius !== 'undefined') {

				x = -options.radius;

			} else {

				x = -options.width;

			}

			if (typeof options.lineWidth !== 'undefined') {

				if (options.strokePosition === 'default') {

					x -= options.lineWidth / 2;

				} else if (options.strokePosition === 'outset') {

					x -= options.lineWidth;

				}

			}

		} else if (options.anchor.match(/center$/)) {

			if (typeof options.radius === 'undefined') {

				x = -(options.width / 2);

			}

		}

		x = x * options.scale + options.x;
		y = y * options.scale + options.y;

		if (obj instanceof Facade.Circle) {

			obj.setMetrics({
				x: x - (obj.getMetric('width') / 2),
				y: y - (obj.getMetric('height') / 2),
			});

		} else {

			obj.setMetrics({
				x: x,
				y: y,
			});

		}

		this.context.translate(x, y);

		return this;

	};

	Facade.prototype.setRotate = function (obj, options) {

		var metrics,
			x = 0,
			y = 0;

		metrics = obj.getAllMetrics();

		if (options.anchor.match(/^bottom/)) {

			y = metrics.height;

		} else if (options.anchor.match(/^center/)) {

			y = metrics.height / 2;

		}

		if (options.anchor.match(/right$/)) {

			x = metrics.width;

		} else if (options.anchor.match(/center$/)) {

			x = metrics.width / 2;

		}

		if (options.rotate) {

			this.context.translate(x, y);

			this.context.rotate(options.rotate * Math.PI / 180);

			this.context.translate(-x, -y);

		}

		return this;

	};

	Facade.prototype.start = function () {

		this.requestAnimation = window.requestAnimationFrame(this.animate.bind(this));

		return this;

	};

	Facade.prototype.stop = function () {

		this.dt = 0;
		this.fps = 0;
		this.ftime = 0;

		this.requestAnimation = window.cancelAnimationFrame(this.requestAnimation);

		return this;

	};

	Facade.Entity = function () { };

	Facade.Entity.prototype.defaultOptions = function () {

		var options = {
				x: 0,
				y: 0,
				shadowBlur: 0,
				shadowColor: '#000',
				shadowOffsetX: 0,
				shadowOffsetY: 0,
				anchor: 'top/left',
				opacity: 100,
				rotate: 0,
				scale: 1
			};

		if (this instanceof Facade.Circle) {

			options.radius = 10;
			options.start = 0;
			options.end = 360;
			options.counterclockwise = false;
			options.fillStyle = '#000';
			options.strokeStyle = '#000';
			options.strokePosition = 'default';
			options.lineWidth = 0;

		} else if (this instanceof Facade.Image) {

			options.width = null;
			options.height = null;
			options.offsetX = 0;
			options.offsetY = 0;
			options.tileX = 1;
			options.tileY = 1;
			options.frames = [];
			options.speed = 120;
			options.loop = true;
			options.callback = function (frame) { };

		} else if (this instanceof Facade.Line) {

			options.startX = 0;
			options.startY = 0;
			options.endX = 0;
			options.endY = 0;
			options.strokeStyle = '#000';
			options.lineWidth = 0;
			options.lineCap = null;

		} else if (this instanceof Facade.Rect) {

			options.width = 100;
			options.height = 100;
			options.fillStyle = '#000';
			options.strokeStyle = '#000';
			options.strokePosition = 'default';
			options.lineWidth = 0;
			options.borderRadius = 0;

		} else if (this instanceof Facade.Text) {

			options.width = 0;
			options.value = '';
			options.fontFamily = 'Arial';
			options.fontSize = 30;
			options.fontStyle = 'normal';
			options.lineHeight = null;
			options.textAlign = 'left';
			options.textBaseline = 'top';
			options.fillStyle = '#000';
			options.strokeStyle = '#000';
			options.lineWidth = 0;

		}

		return options;

	};

	Facade.Entity.prototype.getOption = function (key) {

		if (this._options.hasOwnProperty(key)) {

			return this._options[key];

		}

		return false;

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

					options[key] = updated[key];

					if (test !== true) {

						this._options[key] = updated[key];

					}

				} else {

					options[key] = this._options[key];

				}

			}

		}

		return options;

	};

	Facade.Entity.prototype.defaultMetrics = function () {

		var metrics = {
			x: null,
			y: null,
			width: null,
			height: null
		};

		return metrics;

	};

	Facade.Entity.prototype.getMetric = function (key) {

		if (this._metrics.hasOwnProperty(key)) {

			return this._metrics[key];

		}

		return false;

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

	Facade.Entity.prototype.setMetrics = function (updated, test) {

		var metrics = {},
			key;

		for (key in this._metrics) {

			if (this._metrics.hasOwnProperty(key)) {

				if (updated && updated.hasOwnProperty(key)) {

					metrics[key] = updated[key];

					if (test !== true) {

						this._metrics[key] = updated[key];

					}

				} else {

					metrics[key] = this._metrics[key];

				}

			}

		}

		return metrics;

	};

	Facade.Circle = function (options) {

		if (!(this instanceof Facade.Circle)) {

			return new Facade.Circle(options);

		}

		this._options = this.defaultOptions();
		this._metrics = this.defaultMetrics();

		this.setOptions(options);

	};

	Facade.Circle.prototype = Object.create(Facade.Entity.prototype);

	Facade.Image = function (source, options) {

		if (!(this instanceof Facade.Image)) {

			return new Facade.Image(options);

		}

		this._options = this.defaultOptions();
		this._metrics = this.defaultMetrics();

		if (source === undefined) {

			throw new Error('Required parameter "source" missing from Facade.Image call.');

		}

		this.img = null;
		this.frame = 0;
		this.ftime = null;

		this.isLoaded = false;

		this.size = { width: null, height: null };

		this.loaded = function () {

			var options = this.getAllOptions();

			this.isLoaded = true;

			this.size = { width: this.img.width, height: this.img.height };

			if (!options.width || options.width + options.offsetX > this.size.width) {

				this.setOptions({
					width: this.size.width - this._options.offsetX
				});

			}

			if (!options.height || options.height + options.offsetY > this.size.height) {

				this.setOptions({
					height: this.size.height - this._options.offsetY
				});

			}

		};

		if (typeof source === 'object' && source.nodeType === 1) {

			this.img = source;

			if (this.img.complete) {

				this.loaded.call(this);

			} else {

				this.img.addEventListener('load', this.loaded.bind(this));

			}

		} else {

			this.img = document.createElement('img');
			this.img.setAttribute('src', source);
			this.img.addEventListener('load', this.loaded.bind(this));

		}

		this.setOptions(options);

	};

	Facade.Image.prototype = Object.create(Facade.Entity.prototype);

	Facade.Line = function (options) {

		if (!(this instanceof Facade.Line)) {

			return new Facade.Line(options);

		}

		this._options = this.defaultOptions();
		this._metrics = this.defaultMetrics();

		this.setOptions(options);

	};

	Facade.Line.prototype = Object.create(Facade.Entity.prototype);

	Facade.Rect = function (options) {

		if (!(this instanceof Facade.Rect)) {

			return new Facade.Rect(options);

		}

		this._options = this.defaultOptions();
		this._metrics = this.defaultMetrics();

		this.setOptions(options);

	};

	Facade.Rect.prototype = Object.create(Facade.Entity.prototype);

	Facade.Text = function (options) {

		if (!(this instanceof Facade.Text)) {

			return new Facade.Text(options);

		}

		this._options = this.defaultOptions();
		this._metrics = this.defaultMetrics();

		this.setOptions(options);

	};

	Facade.Text.prototype = Object.create(Facade.Entity.prototype);

	return Facade;

}());
