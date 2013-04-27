"use strict";

define(["atomic/Input", "atomic/Entity", "atomic/Utils", "atomic/Engine", "atomic/Graphics/Image"],
function(Input, Entity, Utils, Engine, Image) {
	var NORMAL = 1, SHAKING = 2, FALLING = 3;
	var Crumble = function(x, y, source) {
		var graphic = new Image(source);
		Entity.call(this, x, y, graphic);
		this.type = "Solid";
		this.width = source.width;
		this.height = source.height;
		this.state = NORMAL;
		this.shakeTimer = 1;
		this.dy = 0;
	};

	Utils.extend(Entity, Crumble);

	Crumble.prototype.update = function()
	{
		if (this.state === NORMAL && this.collide("Player", this.x, this.y - 1)) {
			this.state = SHAKING;
		}

		if (this.state === SHAKING) {
			this.shakeTimer -= Engine.elapsed;
			var distance = (1 - this.shakeTimer) * 5;
			var shake = Utils.scale(Math.random(), 0, 1, -distance, distance);
			this.graphic.originX = shake;
			if (this.shakeTimer < 0) {
				this.collidable = false;
				this.state = FALLING;
			}
		}

		if (this.state === FALLING) {
			this.dy++;
			this.y += this.dy;

			if (this.y > this.world.height) {
				this.world.remove(this);
			}
		}
	};

	return Crumble;
});
