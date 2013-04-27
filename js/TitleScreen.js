"use strict";

define(["atomic/AssetManager", "atomic/World", "atomic/Utils", "atomic/Entity",
	"atomic/Graphics/Image", "atomic/Input", "atomic/Engine", "Level"],
function(AssetManager, World, Utils, Entity, Image, Input, Engine, Level) {
	var TitleScreen = function() {
		World.call(this);
		var titleGraphic = new Image(AssetManager.assets["images/title"]);
		this.addGraphic(titleGraphic);
	};

	Utils.extend(World, TitleScreen);

	TitleScreen.prototype.update = function() {
		if(Input.pressed("SPACE")) {
			AssetManager.assets["sounds/start"].play();
			Engine.world = new Level(AssetManager.assets["levels/1"], AssetManager.assets["images/tiles"]);
		}

		if(Input.check("A")) {
			AssetManager.assets["sounds/pling"].play();
		}
	};

	return TitleScreen;
});
