/*global define */
"use strict";
define(function()
{
	window.URL = window.URL || window.webkitURL;
	window.performance = window.performance || window.msperformance || {};
	window.performance.now = window.performance.now ||
		window.performance.webkitNow || Date.now;

	var frameStart = 0;
	var world = null;
	var nextworld = null;
	var engine = {
		VERSION: "0.0.1",
		debug: false,
		stage: null,
		scale: 1,
		smooth: true,
		camera: {x: 0, y: 0},
		elapsed: 0,
		layout: "relative",
		backgroundColor: "#000000",
		init: function(options)
		{
			engine.width  = options.width     || engine.width;
			engine.height = options.height    || engine.height;
			engine.scale  = options.scale     || engine.scale;
			engine.smooth = options.smooth === undefined || options.smooth;
			engine.layout = options.layout    || engine.layout;
			var container = options.container || document.body;
			container.appendChild(engine.stage);
			// TODO: maybe abstract away engine.stage elsewhere so that it could
			// have multiple layers, be 2d or webgl or not even canvas or
			// whatever
			engine.stage.style.backgroundColor = engine.backgroundColor;
			engine.stage.width = engine.width * engine.scale;
			engine.stage.height = engine.height * engine.scale;
			engine.stage.style.outline = 0;
			engine.stage.style.position = engine.layout;
			engine.stage.focus();

			var resize = function()
			{
				var left = ((container.offsetWidth / 2) - engine.halfWidth * engine.scale);
				engine.stage.style.left = left + "px";
			};

			$(window).resize(resize);
			resize();

			// TODO: Make the image smoothing option cross-browser, similar to
			// the rAF shim
			engine.stage.getContext("2d").scale(engine.scale, engine.scale);
			// TODO: webkit prefix!
			engine.stage.getContext("2d").webkitImageSmoothingEnabled = engine.smooth;
			frameStart = window.performance.now();
			mainLoop();
		}
	};

	var width = 640;
	var height = 480;
	var halfWidth = Math.round(width / 2);
	var halfHeight = Math.round(height / 2);

	Object.defineProperties( engine,
	{
		"width": {
			get: function()
			{
				return width;
			},
			set: function(value)
			{
				width = value;
				halfWidth = Math.round(width / 2);
			}
		},
		"height": {
			get: function()
			{
				return height;
			},
			set: function(value)
			{
				height = value;
				halfHeight = Math.round(height / 2);
			}
		},
		"halfWidth": {
			get: function()
			{
				return halfWidth;
			}
		},
		"halfHeight": {
			get: function()
			{
				return halfHeight;
			}
		},
		"world": {
			get: function()
			{
				return world;
			},
			set: function(value)
			{
				if(world === value) return;
				nextworld = value;
			}
		}
	});

	// We don't size the canvas or add it to the document until init()
	// However, we still create the element now so that it is available in
	// sub-modules as they load
	engine.stage = document.getElementById("stage") || document.createElement("canvas");
	engine.stage.tabIndex = 1; // Make the canvas focusable

	var frameRequest;
	var mainLoop = function()
	{
		frameRequest = window.requestAnimationFrame(mainLoop);

		var timestamp = window.performance.now();
		// Work in seconds rather than milliseconds
		engine.elapsed = (timestamp - frameStart) / 1000;
		frameStart = timestamp;

		if(nextworld)
		{
			if(world) world.end();
			world = nextworld;
			nextworld = null;
			engine.camera = world.camera;
			world.begin();
		}

		$(engine).trigger("startFrame");
		if(engine.world)
		{
			engine.world.update();
			engine.world.draw();
		}
		$(engine).trigger("endFrame");

		timestamp = window.performance.now();
		engine.duration = (timestamp - frameStart) / 1000; // Measure the
	};

	// TODO: focus and blur events on the stage should unpause/pause the game

	return engine;
});


// Before we finish we need to set up our environment the way we like it
// Set up requestAnimationFrame
// Here seems as good a place as any other
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// Original by Erik Möller with fixes from Paul Irish and Tino Zijdel
(function()
{
	var lastTime = 0;
	var vendors = ["ms", "moz", "webkit", "o"];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x)
	{
		window.requestAnimationFrame = window[vendors[x]+"RequestAnimationFrame"];
		window.cancelAnimationFrame = window[vendors[x]+"CancelAnimationFrame"] ||
			window[vendors[x]+"CancelRequestAnimationFrame"];
	}

	if(!window.requestAnimationFrame)
	{
		window.requestAnimationFrame = function(callback)
		{
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if(!window.cancelAnimationFrame)
	{
		window.cancelAnimationFrame = function(id)
		{
			clearTimeout(id);
		};
	}
}());
