/*global define */
"use strict";
define(["atomic/Utils"], function(Utils)
{
	function Mask(/*x, y, graphic, mask*/)
	{
		this.parent = null;
		this.list = null;
		this.check = this.check || {};
		this.check.Mask = collideMask;
		this.check.MaskList = collideMasklist;
	}

	// Ok, so the original in FP uses the actual class name of the object that is doing the
	// colliding. That obviously isn't going to work in JS, so we'll provide a name to use. We just
	// have to be aware that this means creating a custom Mask class involves overriding the
	// MaskType too.
	// This whole business is pretty horrible
	Mask.prototype.MaskType = "Mask";

	Mask.prototype.collide = function(mask)
	{
		if(this.check[mask.MaskType] !== null) return this.check[mask.MaskType].call(this, mask);
		if(mask.check[this.MaskType] !== null) return mask.check[this.MaskType].call(mask, this);
		return false;
	};

	Mask.prototype.assignTo = function(parent)
	{
		this.parent = parent;
		if(!this.list && parent) this.update();
	};

	Mask.prototype.update = function()
	{
	};

	Mask.prototype.renderDebug = function(/*g*/)
	{
	};

	var collideMask = function(other)
	{
		var rect1 = Object.create(this.parent),
			rect2 = Object.create(other.parent);

		rect1.x -= this.parent.originX;
		rect1.y -= this.parent.originY;
		rect2.x -= other.parent.originX;
		rect2.y -= other.parent.originY;

		return Utils.overlap(rect1, rect2);
	};

	var collideMasklist = function(other)
	{
		return other.collide(this);
	};

	return Mask;
});
