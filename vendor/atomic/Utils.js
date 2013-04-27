/*global define */
"use strict";
define({
	DEG: -180 / Math.PI,
	RAD: Math.PI / -180,
	angle: function(x1, y1, x2, y2)
	{
		var a = Math.atan2(y2 - y1, x2 - x1) * this.DEG;
		return a < 0 ? a + 360 : a;
	},
	angleXY: function(object, angle, length, x, y)
	{
		if(length === undefined) length = 1;
		angle *= this.RAD;
		object.x = Math.cos(angle) * length + (x || 0);
		object.y = Math.sin(angle) * length + (y || 0);
	},
	choose: function()
	{
		var c = (arguments.length === 1 && (arguments[0].splice)) ?
			arguments[0] :
			arguments;
		return c[this.rand(c.length)];
	},
	clamp: function(value, min, max)
	{
		if(max < min) return this.clamp(value, max, min);

		return Math.max(min, Math.min(max, value));
	},
	distance: function(x1, y1, x2, y2)
	{
		// Cast all to Number
		x1 = +x1;
		y1 = +y1;
		x2 = +x2;
		y2 = +y2;

		return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
	},
	distanceRects: function(x1, y1, w1, h1, x2, y2, w2, h2)
	{
		if(this.overlap(
			{x: x1, y: y1, width: w1, height: h1},
			{x: x2, y: y2, width: w2, height: h2}))
		{
			return 0;
		}

		if(x1 > x2) return this.distanceRects(x2, y2, w2, h2, x1, y1, w1, h1);

		var xOverlap = x2 < x1 + w1;
		var yOverlap = y1 < y2 + h2 && y2 < y1 + h1;

		if(xOverlap)
		{
			if(y1 > y2) return y1 - (y2 + h2);
			return y2 - (y1 + h1);
		}
		if(yOverlap)
		{
			return x2 - (x1 + w1);
		}
		if(y1 > y2) return this.distance(x1 + w1, y1, x2, y2 + h2);
		return this.distance(x1 + w1, y1 + h1, x2, y2);
	},
	extend: function(base, subclass)
	{
		function F(){}
		F.prototype = base.prototype;
		subclass.prototype = new F();
		subclass.base = base;
		subclass.prototype.constructor = subclass;
	},
	// Do two rectangles overlap?
	// A rectangle is any object with x, y, width and height properties
	overlap: function(rect1, rect2)
	{
		return rect1.x + rect1.width > rect2.x &&
			rect1.y + rect1.height > rect2.y &&
			rect1.x < rect2.x + rect2.width &&
			rect1.y < rect2.y + rect2.height;
	},
	rand: function(max)
	{
		return Math.floor(this.random() * max);
	},
	random: function()
	{
		//TODO: FP has this method because it allows you to set the seed and
		// therefore "replay" random events. I haven't done that yet
		return Math.random();
	},
	removeElement: function(item, array, all)
	{
		// The all parameter determines whether we should stop after finding one
		// occurrence or keep going
		all = !!all;
		var i = array.length - 1;
		while(i >= 0)
		{
			if(item === array[i])
			{
				array.splice(i, 1);
				if(!all)
				{
					return;
				}
			}
			i--;
		}
	},
	scale: function(value, min, max, min2, max2)
	{
		return min2 + ((value - min) / (max - min)) * (max2 - min2);
	},
	scaleClamp: function(value, min, max, min2, max2)
	{
		return this.clamp(this.scale(value, min, max, min2, max2), min2, max2);
	},
	// JXON implementation, see https://developer.mozilla.org/en-US/docs/JXON
	parseText: function(sValue)
	{
		if(/^\s*$/.test(sValue))
		{
			return null;
		}
		if(/^(?:true|false)$/i.test(sValue))
		{
			return sValue.toLowerCase() === "true";
		}
		if(isFinite(sValue))
		{
			return parseFloat(sValue);
		}
		if(isFinite(Date.parse(sValue)))
		{
			return new Date(sValue);
		}
		return sValue;
	},
	getXML: function(xml)
	{
		if(xml.nodeType === 9) // nodeType is "Document"
		{
			return this.getXML(xml.documentElement);
		}

		var result = null, childCount = 0, text = "", attribute, node, propertyName, content, i;
		if(xml.hasAttributes())
		{
			result = {};
			for(childCount = 0; childCount < xml.attributes.length; childCount++)
			{
				attribute = xml.attributes.item(childCount);
				result["@" + attribute.name] = this.parseText(attribute.value.trim());
			}
		}

		if(xml.hasChildNodes())
		{
			for(i = 0; i < xml.childNodes.length; i++)
			{
				node = xml.childNodes.item(i);
				if(node.nodeType === 4) /* nodeType is "CDATASection" (4) */
				{
					text += node.nodeValue;
				}
				else if(node.nodeType === 3) /* nodeType is "Text" (3) */
				{
					text += node.nodeValue.trim();
				}
				else if(node.nodeType === 1 && !node.prefix) /* nodeType is "Element" (1) */
				{
					if(childCount === 0)
					{
						result = {};
					}
					propertyName = node.nodeName;
					content = this.getXML(node);
					if(result.hasOwnProperty(propertyName))
					{
						if(result[propertyName].constructor !== Array)
						{
							result[propertyName] = [result[propertyName]];
						}
						result[propertyName].push(content);
					}
					else
					{
						result[propertyName] = content;
						childCount++;
					}
				}
			}
		}

		if(text)
		{
			text = this.parseText(text);
			result.text = text;
			// Possibly a bit too clever for my own good
			Object.defineProperty(result, "toString", {
				value: function(){ return text ;}
			});
		}

		if(childCount > 0)
		{
			Object.freeze(result);
		}

		return result;
	},
	// Parses a color value and returns a string in the form "rgba(0, 0, 0, 0)"
	// Colors (for the moment) are integers
	getColorRGBA: function(color, alpha)
	{
		/*jshint bitwise: false */
		var r = (color & 0xFF0000) >> 16;
		var g = (color & 0x00FF00) >> 8;
		var b = (color & 0x0000FF);
		/*jshint bitwise: true */

		return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
	}
});
