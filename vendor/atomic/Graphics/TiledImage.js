/*global define */
"use strict";
define(["atomic/Utils", "atomic/Graphics/Image"], function(Utils, Image)
{
	function TiledImage(texture, width, height, clipRect)
	{
		// /** @private */ private var _graphics:Graphics = FP.sprite.graphics;
		// /** @private */ private var _texture:BitmapData;

		this._offsetX = 0;
		this._offsetY = 0;
		Image.call(this, texture, clipRect);
		this._buffer.width = width || 0;
		this._buffer.height = height || 0;
		this.updateBuffer();
	}

	Utils.extend(Image, TiledImage);

	var modulo = function(a, b)
	{
		return (((a % b) + b) % b) -b;
	};

	TiledImage.prototype.updateBuffer = function()
	{
		if(!this._source) return;

		var context = this._buffer.getContext("2d");
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);

		// TODO: This is generally pretty slow.
		// TODO: Not working right
		// Refactor!

		// Workaround JS modulo bug for negative numbers
		var x = modulo(this._offsetX, this._clipRect.width);
		var y;
		var ystart = modulo(this._offsetY, this._clipRect.height);

		while(x < this._buffer.width)
		{
			y = ystart;
			while(y < this._buffer.height)
			{
				context.save();
				context.translate(x, y);
				context.drawImage(this._source,
					this._clipRect.x, this._clipRect.y, this._clipRect.width, this._clipRect.height,
					0, 0, this._clipRect.width, this._clipRect.height);
				y += this._clipRect.height;
				context.restore();
			}
			x += this._clipRect.width;
		}
	};

	TiledImage.prototype.setOffset = function(x, y)
	{
		if(this._offsetX === x && this._offsetY === y) return;
		this._offsetX = x;
		this._offsetY = y;
		this.updateBuffer();
	};

	Object.defineProperties( TiledImage.prototype, {
		"offsetX": {
			get: function() { return this._offsetX; },
			set: function(value)
			{
				if(this._offsetX === value) return;
				this._offsetX = value;
				this.updateBuffer();
			}
		},
		"offsetY": {
			get: function() { return this._offsetY; },
			set: function(value)
			{
				if(this._offsetY === value) return;
				this._offsetY = value;
				this.updateBuffer();
			}
		}
	});

	return TiledImage;
});
