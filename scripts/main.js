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
	create: function() {
	},
	enter: function() {
	},
	leave: function() {
	},
	step: function(dt) {
	},
	render: function(dt) {
		this.app.layer
			.clear("#fff");
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
	},
	ready: function() {
		this.setState(NEIN.Title);
	},
	scale: 1.2,
	width: 640,
	height: 480
});
