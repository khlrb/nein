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
};

NEIN.Main = {
	enter: function() {
		this.x = 298;
		this.y = -64;
		this.v = 50;
		this.a = 10;
        this.stars = 0;
        this.collisions = 0;
		this.offset = 240;

		this.map = [];
		var obstacles = ['stamm',
                         'tor',
                         'star',
                         'stone',
                         'tree'];

		for(var i=0; i<400; i++) {
			this.map.push({"x": Math.random()*640-64,
                           "y": i*80+100,
                           "type": obstacles[Math.floor(Math.random()*obstacles.length)],
                           "angle": (Math.random()*Math.PI-(Math.PI/2))/10,
                           "mirrored": Math.random()*2|0});
		}
	},
	leave: function() {
	},
	step: function(dt) {
		this.v = this.v + dt*this.a > 1000 ? 1000 : this.v + dt*this.a;

		if(this.app.keyboard.keys.right) {
			this.x = this.x + dt*100 > 576 ? 576 : this.x + dt*100;
		}
		
		if(this.app.keyboard.keys.left) {
			this.x = this.x - dt*100 < 0 ? 0 : this.x - dt*100;
		}

		this.y += dt*this.v;

		if(this.y > 32500) this.app.setState(NEIN.Score);
        else{
            //collision detection
            var collidingObstacles = [];
            var that = this;
            var guy = this.app.atlases.guy.frames[0];
            this.map.forEach(function(obstacle, i) {
                var img = that.app.images[obstacle.type];
                if (obstacle.y + img.height - 10 <= that.y + guy.height && obstacle.y + img.height >= that.y)
                    if(obstacle.x <= that.x + guy.width && obstacle.x + img.width >= that.x)
                        collidingObstacles.push(obstacle);
            });
            
            collidingObstacles.forEach(function(obst){
                if(!obst.collided) {
                    obst.collided = true;
                    switch(obst.type){
                    case 'star':
                        that.stars += 1;
                        break;
                    default:
                        that.collisions += 1;
                        that.v = 50;
                        that.a = 10;
                    }
                }
            });
        }
	},
	render: function(dt) {
		var current = this.v > 40 ? (this.app.lifetime % 2 / 2) * this.app.atlases.guy.frames.length | 0 : 0;
        
		this.app.layer
			.clear("#fff")
            .fillStyle("#ff00ff")
			.fillRect(0, 32300-this.y+this.offset, 640, 40)
			.drawAtlasFrame(this.app.atlases.guy, current, this.x, this.offset);

		for(var i=0; i<400; i++) {
            var img = this.app.images[this.map[i].type];
            if(!(this.map[i].type === 'star' && this.map[i].collided)){
                this.app.layer.save()
                    .translate(this.map[i].x, this.map[i].y-this.y+this.offset)
                    .translate(img.width/2, img.height/2)
                    .scale(this.map[i].mirrored?-1:1, 1)
                    .rotate(this.map[i].angle)
                    .drawImage(img, img.width/(-2), img.height/(-2))
                    .restore();
            }
		}

	}
};

NEIN.Score = {
	create: function() {
	},
	enter: function() {
	},
	render: function(dt) {
		this.app.layer
			.fillStyle("#000")
			.fillRect(0, 0, 640, 480);
	}
};

playground({
	create: function() {
		this.loadImage("nein","tor","stamm","star","stone","tree");
		this.loadAtlas("guy");	
	},
	ready: function() {
		this.setState(NEIN.Title);
	},
	scale: 1,
	width: 640,
	height: 480
});
