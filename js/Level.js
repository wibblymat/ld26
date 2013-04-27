"use strict";

define(["atomic/Utils", "atomic/Graphics/Tilesheet", "atomic/Graphics/Tilemap",
	"atomic/Masks/Grid", "atomic/World", "Sky", "Player", "Crumble"],
function(Utils, Tilesheet, Tilemap, Grid, World, Sky, Player, Crumble) {
	var Level = function(map, tiles) {
		World.call(this);

		this.width = map.width * map.tilewidth;
		this.height = map.height * map.tileheight;

		var tilesheet = new Tilesheet(tiles, 20, 20);
		var solids = new Grid(this.width, this.height, 20, 20);
		var water = new Grid(this.width, this.height, 20, 20);

		var entities = {
			Crumble: Crumble
		};

		this.add(new Sky());
		this.add(new Player());

		map.layers.forEach(function(layer, index) {
			console.log(layer.type);
			if(layer.type === "tilelayer") {
				var tiles = new Tilemap(tilesheet, this.width, this.height);
				tiles.setTiles(layer.data, 1);
				if(layer.name === "Ground") {
					tiles.addToGrid(solids);
				} else if (layer.name === "Water") {
					tiles.addToGrid(water);
				}
				this.addGraphic(tiles, -index);
			} else {
				layer.objects.forEach(function (entity) {
					this.add(new entities[entity.type](
						entity.x,
						entity.y,
						tilesheet.getTileAtIndex(entity.gid - 1)
					));
				}, this);
			}
		}, this);

		this.addMask(solids, "Solid");
		this.addMask(water, "Water");
	};

	Utils.extend(World, Level);

	return Level;
});
