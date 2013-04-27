/*global define */
"use strict";
define(["atomic/Audio"], function(Audio)
{
	function Sound(buffer)
	{
		this.buffer = buffer;
	}

	Sound.prototype.play = function()
	{
		var source = Audio.context.createBufferSource();
		source.buffer = this.buffer;
		source.connect(Audio.context.destination);
		source.noteOn(0);
	};

	return Sound;
});
