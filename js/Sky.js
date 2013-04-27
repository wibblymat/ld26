"use strict";

define(["atomic/Entity", "atomic/Utils", "atomic/Engine", "atomic/AssetManager",
	"atomic/Graphics/TiledImage"],
function(Entity, Utils, Engine, AssetManager, TiledImage) {

	var Sky = function() {
		var graphic = new TiledImage(AssetManager.assets["images/tiles"], 250, 60, {
			x: 80,
			y: 20,
			width: 100,
			height: 60
		});
		graphic.smooth = true;
		graphic.scale = 8;
		Entity.call(this, 0, 0, graphic);
	};

	Utils.extend(Entity, Sky);

	Sky.prototype.update = function()
	{
	};

	return Sky;
});
