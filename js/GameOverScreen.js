"use strict";

define(["atomic/AssetManager", "atomic/World", "atomic/Utils", "atomic/Entity",
	"atomic/Graphics/Image", "atomic/Input", "atomic/Engine", "TitleScreen"],
function(AssetManager, World, Utils, Entity, Image, Input, Engine, TitleScreen) {
	var GameOverScreen = function() {
		World.call(this);
		var gameOverGraphic = new Image(AssetManager.assets["images/game_over"]);
		this.addGraphic(gameOverGraphic);
	};

	Utils.extend(World, GameOverScreen);

	GameOverScreen.prototype.update = function() {
		if(Input.pressed("SPACE")) {
			TitleScreen = require("TitleScreen");
			Engine.world = new TitleScreen();
		}
	};

	return GameOverScreen;
});
