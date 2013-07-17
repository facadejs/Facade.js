/*!
 * Facade.js (facadejs.com)
 * Copyright (c) 2013 Scott Doxey
 * Dual-licensed under both MIT and BSD licenses.
 */

!function () {

	'use strict';

	(['webkit', 'moz']).forEach(function (key) {
		window.requestAnimationFrame = window.requestAnimationFrame ||
			window[key + 'RequestAnimationFrame'] || null;
		window.cancelAnimationFrame = window.cancelAnimationFrame ||
			window[key + 'CancelAnimationFrame'] || null;
	});

	var Facade = function (canvas, width, height) {

		if (canvas && typeof canvas == 'object' && canvas.nodeType == 1) {

			this.canvas = canvas;

		} else {

			this.canvas = document.createElement('canvas');

			if (typeof canvas == 'string') {

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

		this.addToStage = function (obj, options) {

			options = Facade.prototype.setOptions(obj.options, options);

			this.context.save();

			Facade.prototype.setAnchorPoint.call(this, obj, options);

			if (!(obj instanceof Facade.Image)) {

				if (obj.metrics.x + obj.metrics.width < 0 ||
					obj.metrics.y + obj.metrics.height < 0 ||
					obj.metrics.x > this.canvas.width ||
					obj.metrics.y > this.canvas.height) {

						this.context.restore();

						return this;

				}

			}

			this.context.scale(options.scale, options.scale);

			Facade.prototype.setRotate.call(this, obj, options);

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
					options.start * Math.PI/180,
					options.end * Math.PI/180,
					options.counterclockwise
				);

				if (options.fillStyle) {

					this.context.fill();

				}

				if (options.strokePosition == 'inset') {

					this.context.closePath();
					this.context.beginPath();

					this.context.arc(
						0,
						0,
						options.radius - (options.lineWidth / 2),
						options.start * Math.PI/180,
						options.end * Math.PI/180,
						options.counterclockwise
					);

				} else if (options.strokePosition == 'outset') {

					this.context.closePath();
					this.context.beginPath();

					this.context.arc(
						0,
						0,
						options.radius + (options.lineWidth / 2),
						options.start * Math.PI/180,
						options.end * Math.PI/180,
						options.counterclockwise
					);

				}

				if (options.lineWidth) {

					this.context.stroke();

				}

				this.context.closePath();

			} else if (obj instanceof Facade.Image && obj.isLoaded) {

				var frame_offset_x = 0;

				if (options.frames.length) {

					frame_offset_x = options.frames[obj.frame];

				}

				for (var x = 0; x < options.tileX; x++) {

					for (var y = 0; y < options.tileY; y++) {

						if (obj.metrics.x + options.width * (x + 1) < 0 ||
							obj.metrics.y + options.height * (y + 1) < 0 ||
							obj.metrics.x + options.width * x > this.canvas.width ||
							obj.metrics.y + options.height * y > this.canvas.height) {

							break;

						}

						obj.metrics.width = options.width * (x + 1);
						obj.metrics.height = options.height * (y + 1);

						this.context.drawImage(
							obj.elem,
							(options.width * frame_offset_x) + options.offsetX,
							options.offsetY,
							options.width,
							options.height,
							options.width * x,
							options.height * y,
							options.width,
							options.height);

					}

				}

				if (options.frames.length) {

					if (!obj.ftime) {

						obj.ftime = this.ftime;

					}

					if (this.ftime - obj.ftime >= options.speed) {

						obj.ftime = this.ftime;
						obj.frame++;

					}

					if (obj.frame >= options.frames.length) {

						if (options.loop) {

							obj.frame = 0;

						} else {

							obj.frame = options.frames.length -1;

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

					var borderRadius = Math.min(
						options.borderRadius,
						options.height / 2,
						options.width / 2
					);

					this.context.moveTo(borderRadius, 0);

					this.context.arc(
						options.width - borderRadius,
						borderRadius,
						borderRadius,
						Math.PI*1.5,
						0
					);

					this.context.arc(
						options.width - borderRadius,
						options.height - borderRadius,
						borderRadius,
						0,
						Math.PI*0.5
					);

					this.context.arc(
						borderRadius,
						options.height - borderRadius,
						borderRadius,
						Math.PI*0.5,
						Math.PI
					);

					this.context.arc(
						borderRadius,
						borderRadius,
						borderRadius,
						Math.PI,
						Math.PI*1.5
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

						this.context.fill();

					}

					if (options.lineWidth) {

						if (options.strokePosition == 'inset') {

							this.context.closePath();
							this.context.beginPath();

							this.context.strokeRect(
								options.lineWidth / 2,
								options.lineWidth / 2,
								options.width - options.lineWidth,
								options.height - options.lineWidth
							);

						} else if (options.strokePosition == 'outset') {

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

						this.context.stroke();

					}

				}

				this.context.closePath();

			} else if (obj instanceof Facade.Text) {

				this.context.font = options.fontStyle + ' ' + parseInt(options.fontSize, 10) + 'px ' + options.fontFamily;
				this.context.textBaseline = options.textBaseline;

				if (options.fillStyle) {

					this.context.fillText(options.value, 0, 0);

				}

				if (options.lineWidth) {

					this.context.strokeText(options.value, 0, 0);

				}

			}

			this.context.restore();

			return this;

		};

		this.animate = function (time) {

			if (typeof this.callback == 'function') {

				if (this.ftime) {

					this.dt = time - this.ftime;

					this.fps = (1000 / this.dt).toFixed(2) / 1;

				}

				this.requestAnimation = requestAnimationFrame(this.animate.bind(this));

				this.callback.call(this);

				this.ftime = time;

			} else {

				this.stop();

			}

			return this;

		};

		this.clear = function () {

			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			return this;

		};

		this.draw = function (callback) {

			this.callback = callback;

			this.start();

			return this;

		};

		this.exportBase64 = function (type, quality) {

			if (!type) {

				type = 'image/png';

			}

			if (typeof quality != 'number') {

				quality = 1;

			}

			return this.canvas.toDataURL(type, quality);

		};

		this.start = function () {

			this.animate();

			return this;

		};

		this.stop = function () {

			this.dt = 0;
			this.fps = 0;
			this.ftime = 0;

			this.requestAnimation = cancelAnimationFrame(this.requestAnimation);

			return this;

		};

	};

	Facade.prototype.setAnchorPoint = function (obj, options) {

		var x = 0,
			y = 0;

		if (obj instanceof Facade.Circle) {

			options.width = options.height = options.radius * 2;

		} else if (obj instanceof Facade.Line) {

			options.width = Math.abs(options.endX - options.startX);
			options.height = Math.abs(options.endY - options.startY);

		} else if (obj instanceof Facade.Text) {

			this.context.font = parseInt(options.fontSize, 10) + 'px ' + options.fontFamily;

			options.height = parseInt(options.fontSize, 10);
			options.width = this.context.measureText(options.value).width;

		}

		obj.metrics.width = options.width * options.scale;
		obj.metrics.height = options.height * options.scale;

		if (typeof options.lineWidth != 'undefined') {

			if (options.strokePosition == 'default') {

				obj.metrics.width += options.lineWidth;
				obj.metrics.height += options.lineWidth;

			} else if (options.strokePosition == 'outset') {

				obj.metrics.width += options.lineWidth * 2;
				obj.metrics.height += options.lineWidth * 2;

			}

		}

		if (options.anchor.match(/^top/)) {

			if (typeof options.radius != 'undefined') {

				y = options.radius;

			}

			if (typeof options.lineWidth != 'undefined') {

				if (options.strokePosition == 'default') {

					y += options.lineWidth / 2;

				} else if (options.strokePosition == 'outset') {

					y += options.lineWidth;

				}

			}

		} else if (options.anchor.match(/^bottom/)) {

			if (typeof options.radius != 'undefined') {

				y = -options.radius;

			} else {

				y = -options.height;

			}

			if (typeof options.lineWidth != 'undefined') {

				if (options.strokePosition == 'default') {

					y -= options.lineWidth / 2;

				} else if (options.strokePosition == 'outset') {

					y -= options.lineWidth;

				}

			}

		} else if (options.anchor.match(/^center/)) {

			if (typeof options.radius == 'undefined') {

				y = -(options.height / 2);

			}

		}

		if (options.anchor.match(/left$/)) {

			if (typeof options.radius != 'undefined') {

				x = options.radius;

			}

			if (typeof options.lineWidth != 'undefined') {

				if (options.strokePosition == 'default') {

					x += options.lineWidth / 2;

				} else if (options.strokePosition == 'outset') {

					x += options.lineWidth;

				}

			}

		} else if (options.anchor.match(/right$/)) {

			if (typeof options.radius != 'undefined') {

				x = -options.radius;

			} else {

				x = -options.width;

			}

			if (typeof options.lineWidth != 'undefined') {

				if (options.strokePosition == 'default') {

					x -= options.lineWidth / 2;

				} else if (options.strokePosition == 'outset') {

					x -= options.lineWidth;

				}

			}

		} else if (options.anchor.match(/center$/)) {

			if (typeof options.radius == 'undefined') {

				x = -(options.width / 2);

			}

		}

		x *= options.scale;
		y *= options.scale;

		x += options.x;
		y += options.y;

		if (obj instanceof Facade.Circle) {

			obj.metrics.x = x - (obj.metrics.width / 2);
			obj.metrics.y = y - (obj.metrics.width / 2);

		} else {

			obj.metrics.x = x;
			obj.metrics.y = y;

		}

		this.context.translate(x, y);

	};

	Facade.prototype.setRotate = function (obj, options) {

		var x = 0,
			y = 0;

		if (options.anchor.match(/^bottom/)) {

			y = obj.metrics.height;

		} else if (options.anchor.match(/^center/)) {

			y = obj.metrics.height / 2;

		}

		if (options.anchor.match(/right$/)) {

			x = obj.metrics.width;

		} else if (options.anchor.match(/center$/)) {

			x = obj.metrics.width / 2;

		}

		if (options.rotate) {

			this.context.translate(x, y);

			this.context.rotate(options.rotate * Math.PI/180);

			this.context.translate(-x, -y);

		}

	};

	Facade.prototype.setOptions = function (options, custom) {

		if (!custom) {

			return options;

		}

		var updated_options = {};

		for (var key in options) {

			if (custom.hasOwnProperty(key)) {

				updated_options[key] = custom[key];

			} else {

				updated_options[key] = options[key];

			}

		}

		return updated_options;

	};

	Facade.Circle = function (options) {

		this.options = Facade.prototype.setOptions({

			x: 0,
			y: 0,
			radius: 10,
			start: 0,
			end: 360,
			counterclockwise: false,
			fillStyle: '#000',
			strokeStyle: '#000',
			strokePosition: 'default',
			lineWidth: 0,
			shadowBlur: 0,
			shadowColor: '#000',
			shadowOffsetX: 0,
			shadowOffsetY: 0,
			anchor: 'top/left',
			opacity: 100,
			rotate: 0,
			scale: 1

		}, options);

		this.metrics = {
			x: null,
			y: null,
			width: null,
			height: null
		};

		this.setOptions = function (options) {

			this.options = Facade.prototype.setOptions(this.options, options);

			return this;

		};

	};

	Facade.Image = function (source, options) {

		this.options = Facade.prototype.setOptions({

			x: 0,
			y: 0,
			width: null,
			height: null,
			offsetX: 0,
			offsetY: 0,
			tileX: 1,
			tileY: 1,
			frames: [],
			speed: 120,
			loop: true,
			shadowBlur: 0,
			shadowColor: '#000',
			shadowOffsetX: 0,
			shadowOffsetY: 0,
			anchor: 'top/left',
			opacity: 100,
			rotate: 0,
			scale: 1

		}, options);

		this.frame = 0;
		this.ftime = null;

		this.isLoaded = false;

		this.size = { width: null, height: null };

		this.metrics = {
			x: null,
			y: null,
			width: null,
			height: null
		};

		this.loaded = function () {

			this.isLoaded = true;

			this.size = { width: this.elem.width, height: this.elem.height };

			if (!this.options.width ||
				this.options.width + this.options.offsetX > this.size.width) {

				this.options.width = this.size.width - this.options.offsetX;

			}

			if (!this.options.height ||
				this.options.height + this.options.offsetY > this.size.height) {

				this.options.height = this.size.height - this.options.offsetY;

			}

		};

		this.setOptions = function (options) {

			this.options = Facade.prototype.setOptions(this.options, options);

			return this;

		};

		if (source && typeof source == 'object' && source.nodeType == 1) {

			this.elem = source;

			if (this.elem.complete) {

				this.loaded.call(this);

			} else {

				this.elem.addEventListener('load', this.loaded.bind(this));

			}

		} else {

			this.elem = document.createElement('img');
			this.elem.setAttribute('src', source);
			this.elem.addEventListener('load', this.loaded.bind(this));

		}

	};

	Facade.Line = function (options) {

		this.options = Facade.prototype.setOptions({

			x: 0,
			y: 0,
			startX: 0,
			startY: 0,
			endX: 0,
			endY: 0,
			strokeStyle: '#000',
			lineWidth: 0,
			lineCap: null,
			shadowBlur: 0,
			shadowColor: '#000',
			shadowOffsetX: 0,
			shadowOffsetY: 0,
			anchor: 'top/left',
			opacity: 100,
			rotate: 0,
			scale: 1

		}, options);

		this.metrics = {
			x: null,
			y: null,
			width: null,
			height: null
		};

		this.setOptions = function (options) {

			this.options = Facade.prototype.setOptions(this.options, options);

			return this;

		};

	};

	Facade.Rect = function (options) {

		this.options = Facade.prototype.setOptions({

			x: 0,
			y: 0,
			width: 100,
			height: 100,
			fillStyle: '#000',
			strokeStyle: '#000',
			strokePosition: 'default',
			lineWidth: 0,
			borderRadius: 0,
			shadowBlur: 0,
			shadowColor: '#000',
			shadowOffsetX: 0,
			shadowOffsetY: 0,
			anchor: 'top/left',
			opacity: 100,
			rotate: 0,
			scale: 1

		}, options);

		this.metrics = {
			x: null,
			y: null,
			width: null,
			height: null
		};

		this.setOptions = function (options) {

			this.options = Facade.prototype.setOptions(this.options, options);

			return this;

		};

	};

	Facade.Text = function (options) {

		this.options = Facade.prototype.setOptions({

			x: 0,
			y: 0,
			value: '',
			fontFamily: 'Arial',
			fontSize: 30,
			fontStyle: 'normal',
			textBaseline: 'top',
			fillStyle: '#000',
			strokeStyle: '#000',
			lineWidth: 0,
			shadowBlur: 0,
			shadowColor: '#000',
			shadowOffsetX: 0,
			shadowOffsetY: 0,
			anchor: 'top/left',
			opacity: 100,
			rotate: 0,
			scale: 1

		}, options);

		this.metrics = {
			x: null,
			y: null,
			width: null,
			height: null
		};

		this.setOptions = function (options) {

			this.options = Facade.prototype.setOptions(this.options, options);

			return this;

		};

	};

	window.Facade = Facade;

}();