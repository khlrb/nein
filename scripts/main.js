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
        PLAYGROUND.Transitions.enabled = false;
        NEIN.Main.transitionScreenshot = this.app.layer.cache();
        this.app.setState(NEIN.Main);
    }
};

NEIN.Main = {
    enter: function() {
        this.x = 298;
        this.y = -64;
        this.v = 50;
        this.a = 10;
        this.finished = false;
        this.plings = ["pling0", "pling1", "pling2", "pling3"];
        this.crashes = ["crash0", "crash1"];
        this.steer = ["steer0", "steer1", "steer2", "steer3", "steer4"];
        this.stars = 0;
        this.collisions = 0;
        this.time = 0;
        this.length = 100;
        this.offset = 300;
        this.penalty = 0;
        this.wait = 3;
        this.pressButtonX = 320;
        
        
        this.app.tween(this)
            .to({offset: 240, pressButtonX: -100}, 3);
        
        this.finishline = {
            "y": this.length*80+300,
            "textSize": 14
        }

        this.map = [];
        var obstacles = ['stamm',
                         'tor',
                         'star',
                         'stone',
                         'tree'];

        for(var i=0; i<this.length; i++) {
            this.map.push({"x": Math.random()*(640-64)+64,
                           "y": i*80+200,
                           "type": obstacles[Math.floor(Math.random()*obstacles.length)],
                           "angle": (Math.random()*Math.PI-(Math.PI/2))/10,
                           "mirrored": Math.random()*2|0});
        }
    },
    leave: function() {
    },
    keydown: function(event) {
        if(event.key === "left" || event.key === "right") {
            this.app.sound.play(this.steer[Math.random()*this.steer.length | 0]);
        }
    },
    step: function(dt) {
        if(this.penalty > 0 || this.wait > 0) {
            this.penalty = this.penalty - dt < 0 ? 0 : this.penalty - dt;
            this.wait = this.wait - dt < 0 ? 0 : this.wait - dt;
        }
        else {
            this.v = this.v + dt*this.a > 1000 ? 1000 : this.v + dt*this.a;

            if(this.app.keyboard.keys.right) {
             this.x = this.x + dt*this.v > 576 ? 576 : this.x + dt*this.v;
            }
        
            if(this.app.keyboard.keys.left) {
                this.x = this.x - dt*this.v < 0 ? 0 : this.x - dt*this.v;
	        }

            this.y += dt*this.v;
        }

        if(this.y + this.app.atlases.guy.frames[0].height > this.finishline.y && !this.finished) {
            this.app.sound.play("yay");
            this.finished = true;
            this.app.tween(this.finishline)
                .to({textSize: 33}, 0.15)
                .to({textSize: 25}, 0.1);
        }
        
        this.time += this.finished ? 0 : dt;

        if(this.y > this.finishline.y + 200) {
            PLAYGROUND.Transitions.enabled = true;
            this.app.setState(NEIN.Score);
        } else{
            //collision detection
            var collidingObstacles = [];
            var that = this;
            var guy = this.app.atlases.guy.frames[0];
            var guyy = that.y + guy.height - 50,
                guyy2 = that.y + guy.height,
                guyx = that.x,
                guyx2 = that.x + guy.width;
            this.map.forEach(function(obstacle, i) {
                var img = that.app.images[obstacle.type];
                var obsty = obstacle.y + img.height - 10,
                    obsty2 = obstacle.y + img.height,
                    obstx = obstacle.x,
                    obstx2 = obstacle.x + img.width;
                    
                if (obsty < guyy2 &&  obsty2 > guyy && (obsty2 > guyy2 && obstacle.type !== 'star' || obsty2 <= guyy2 && obstacle.type === 'star'))
                    if(obstx < guyx2 && obstx2 > guyx)
                        collidingObstacles.push(obstacle);
            });
            
            collidingObstacles.forEach(function(obst){
                if(!obst.collided) {
                    obst.collided = true;
                    switch(obst.type){
                    case 'star':
                        that.stars += 1;
                        that.app.sound.play(that.plings[Math.random()*that.plings.length | 0]);
                        break;
                    default:
                        that.collisions += 1;
                        that.v = 50;
                        that.a = 10;
                        that.penalty = 1;
                        that.y += 10;
                        that.app.sound.play(that.crashes[Math.random()*that.crashes.length | 0]);
                    }
                }
            });
        }
    },
    render: function(dt) {
        var current = this.v > 40 ? (this.app.lifetime % 2 / 2) * this.app.atlases.guy.frames.length | 0 : 0;
        
        this.app.layer
            .clear("#fff")
            .drawImage(this.transitionScreenshot, 0, 0, 640, 300, 0, 0-this.y-64, 640, 300)
            .font('12pt Monospace')
            .textAlign('center')
            .fillStyle("#111")
            .fillText("press any key", this.pressButtonX, 420-this.y-64)
            .fillStyle("#ff00ff")
            .fillRect(0, this.finishline.y-this.y+this.offset, 640, 40)
            .font(this.finishline.textSize.toString() + 'pt Monospace')
            .textAlign('start')
            .fillStyle("#fff")
            .fillText(Math.round(this.time*100)/100, 50, this.finishline.y-this.y+this.offset+35);

        var guy = this.app.atlases.guy.frames[0];
        for(var i=0; i<this.length; i++) {
            var img = this.app.images[this.map[i].type];
            if(!(this.map[i].type === 'star' && this.map[i].collided) && this.map[i].y + img.height -10 <= this.y + guy.height) {
                this.app.layer.save()
                    .translate(this.map[i].x, this.map[i].y-this.y+this.offset)
                    .translate(img.width/2, img.height/2)
                    .scale(this.map[i].mirrored?-1:1, 1)
                    .rotate(this.map[i].angle)
                    .drawImage(img, img.width/(-2), img.height/(-2))
                    .restore();
            }
        }

        if(this.penalty === 0) this.app.layer.drawAtlasFrame(this.app.atlases.guy, current, this.x, this.offset);
        if(this.wait > 0.5) this.app.layer.fillStyle('#fff')
                                .fillRect(0, 300, 640, 80);

        for(var i=0; i<this.length; i++) {
            var img = this.app.images[this.map[i].type];
            if(!(this.map[i].type === 'star' && this.map[i].collided) && (this.map[i].y + img.height -10 >= this.y + guy.height || this.type === 'star')){
                this.app.layer.save()
                    .translate(this.map[i].x, this.map[i].y-this.y+this.offset)
                    .translate(img.width/2, img.height/2)
                    .scale(this.map[i].mirrored?-1:1, 1)
                    .rotate(this.map[i].angle)
                    .drawImage(img, img.width/(-2), img.height/(-2))
                    .restore();
            }
        }
        
        if(this.penalty > 0) this.app.layer.drawImage(this.app.images.crashed, this.x, this.offset+10);
    },
    transitionScreenshot: null
};

NEIN.Score = {
    create: function() {
    },
    enter: function() {
    },
    render: function(dt) {
        this.app.layer
            .clear("#5555ee")
        .fillStyle("#fff")
        .fillRect(0, 300, 640, 180)
	    .fillStyle("#00ffff")
	    .font("20pt Monospace")
	    .textAlign("center")
	    .fillText("Score", 320, 120)
	    .textAlign("left")
	    .fillStyle("#ffffff")
	    .font("30px sans-serif")
	    .fillText(NEIN.Main.stars, 300, 195)
	    .fillText(Math.round(NEIN.Main.time*100)/100, 300, 235)
	    .drawImage(this.app.images.star, 260, 166)
        .drawImage(this.app.images.watch, 260, 207)
        .font('12pt Monospace')
        .textAlign('center')
        .fillStyle("#111")
        .fillText("press any key", 320, 420);
    },
    keydown: function(){
        PLAYGROUND.Transitions.enabled = false;
        NEIN.Main.transitionScreenshot = this.app.layer.cache();
        this.app.setState(NEIN.Main);
    }
};

PLAYGROUND.Transitions.enabled = true;
PLAYGROUND.Transitions.preferred = PLAYGROUND.Transitions.Split;
PLAYGROUND.Transitions.prototype.postrender = function(){
    if (this.progress >= 1) return;

    if(PLAYGROUND.Transitions.enabled){
        PLAYGROUND.Transitions.preferred(this, this.progress);
    }
}

playground({
    create: function() {
        this.loadImage("nein","tor","stamm","star","stone","tree","watch","crashed");
        this.loadAtlas("guy");
        this.loadSounds("pling0","pling1","pling2","pling3","crash0","crash1","steer0","steer1","steer2","steer3","steer4","yay");
    },
    ready: function() {
        this.setState(NEIN.Title);
    },
    scale: 1,
    width: 640,
    height: 480
});
