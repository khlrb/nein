var NEIN = {};

NEIN.Title = {
	render: function(dt) {
		this.app.layer
			.clear("#fff")
			.fillStyle("#5555ee")
			.fillRect(0, 0, 640, 300)
			.drawImage(this.app.images.nein, 170, 20)
			.font('12pt Monospace')
			.textAlign('center')
			.fillStyle("#111")
			.fillText("press any key", 320, 420);
	},
	keydown: function(event) {
		this.app.setState(NEIN.Main);
	}
}

NEIN.Main = {
	enter: function() {
		this.x = 298;
		this.y = -64;
		this.v = 0;
	},
	leave: function() {
	},
	step: function(dt) {
		this.y += dt*this.v;
		this.v += dt*40;
	},
	render: function(dt) {
		var current = (this.app.lifetime % 2 / 2) * this.app.atlases.guy.frames.length | 0;

		this.app.layer
			.clear("#fff")
			.drawAtlasFrame(this.app.atlases.guy, current, this.x, this.y);
	}
};

NEIN.Score = {
	create: function() {
	},
	enter: function() {
	},
	render: function(dt) {
	}
};

playground({
	create: function() {
		this.loadImage("nein");
		this.loadAtlas("guy");	
	},
	ready: function() {
		this.setState(NEIN.Title);
	},
	scale: 1.2,
	width: 640,
	height: 480
});
