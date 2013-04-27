/*global define */
"use strict";
define(function()
{
	var Sound;
	// TODO: Make this work cross-browser, perhaps with a fallback
	var audio = {
		context: new window.webkitAudioContext(),
		createSound: function(data, callback)
		{

			audio.context.decodeAudioData(data, function(buffer)
			{
				if(!Sound) Sound = require("atomic/Sound"); // Circular dependency correction
				var sound = new Sound(buffer);
				callback(sound);
			}, function(error){console.log("Error decoding sound:", error);});
		}
	};
	return audio;
});
