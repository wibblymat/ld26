"use strict";

define(["atomic/Input", "atomic/Entity", "atomic/Utils", "atomic/Engine", "atomic/AssetManager",
	"atomic/Graphics/Image", "GameOverScreen"],
function(Input, Entity, Utils, Engine, AssetManager, Image, GameOverScreen) {
	var SPEED = 200; // pixels per second

	var Player = function() {
		var graphic = Image.createRect(20, 40, 0xFF8800, 1);

		Entity.call(this, 0, 0, graphic);
		this.setHitbox(20, 40);
		this.type = "Player";
		this.dx = 0;
		this.dy = 0;
		this.standing = false;
	};

	Utils.extend(Entity, Player);

	Player.prototype.update = function()
	{
		this.dx *= 0.5;

		if(Input.check("Left"))
		{
			this.dx -= 1;
		}
		if(Input.check("Right"))
		{
			this.dx += 1;
		}

		if(Input.check("Up") && this.standing)
		{
			this.dy = -11;
		}

		this.dy += 1;
		this.standing = false;

		var distance = SPEED * Engine.elapsed;

		this.moveBy(this.dx * distance, this.dy, "Solid");
		if (this.y > this.world.height || this.collide("Water", this.x, this.y)) {
			this.die();
		}

		this.world.camera.x = Utils.clamp(this.x - Engine.halfWidth, 0, this.world.width -
			Engine.width);
		this.world.camera.y = Utils.clamp(this.y - Engine.halfHeight, 0, this.world.height -
			Engine.height);
	};

	Player.prototype.die = function () {
		AssetManager.assets["sounds/death"].play();
		Engine.world = new GameOverScreen();
	};

	Player.prototype.moveCollideX = function () {
		return true;
	};

	Player.prototype.moveCollideY = function () {
		if(this.dy > 0) {
			this.standing = true;
		}
		this.dy = 0;
		return true;
	};

	return Player;
});
