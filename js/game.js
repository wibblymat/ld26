"use strict";

require.config({
	paths: {
		"atomic": "../vendor/atomic"
	}
});

define(["atomic/AssetManager", "atomic/Engine", "TitleScreen", "atomic/Sound", "atomic/Input"],
function(AssetManager, Engine, TitleScreen, Sound, Input) {
	Input.define("Left", "LEFT_ARROW", "A");
	Input.define("Right", "RIGHT_ARROW", "D");
	Input.define("Up", "UP_ARROW", "W");
	Input.define("Down", "DOWN_ARROW", "S");

	AssetManager.queue([
		{id: "sounds/start", path: "sounds/start.wav", type: "sound"},
		{id: "sounds/pling", path: "sounds/pling.wav", type: "sound"},
		{id: "sounds/death", path: "sounds/death.wav", type: "sound"},
		{id: "levels/1", path: "levels/1.json", type: "json"},
		{id: "images/tiles", path: "images/tiles.png", type: "image"},
		{id: "images/title", path: "images/title.png", type: "image"},
		{id: "images/game_over", path: "images/game_over.png", type: "image"}
	]);
	AssetManager.start(function()
	{
		Engine.init({width: 640, height: 480, scale: 1});
		Engine.world = new TitleScreen();
	});
});
