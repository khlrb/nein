var NEIN = {};

NEIN.Title = {
	create: function() {
	},
	render: function(dt) {
		this.app.layer
			.clear("#fff")
			.fillStyle("#5555ee")
			.fillRect(0, 0, 640, 300);
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
	ready: function() {
		this.setState(NEIN.Title);
	},
	scale: 1.2,
	width: 640,
	height: 480
});
