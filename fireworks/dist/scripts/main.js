// fireworks
// var p5 = require("libraries/p5.js");
// var p5dom = require("libraries/p5.com.js");
// var p5sound = require("libraries/p5.sound.js");

var particleArray = [];

function setup() {
	var canvas = createCanvas(windowWidth, windowHeight);
	background(0);
	frameRate(30);
	colorMode(HSB, 360,100,100);
}

function draw() {
	background(0);
	blendMode(SCREEN);

	for (var i=0; i<particleArray.length; i++) {
		if (particleArray[i].dead()) {
			particleArray.splice(i,1);

		}
		else {
			particleArray[i].draw();
			particleArray[i].update();
		}
	}

}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

var Particle = function(position, velocity, hue) {
	this.position = position.copy();
	this.velocity = velocity.copy();
	this.hue = hue;
	this.size = random(5,15);
	this.lifeSpan = random(30,40);

	this.update = function() {
		this.lifeSpan--;
		this.position.add(velocity);
	}

	this.draw = function() {
		noStroke();
		fill(hue,random(hue-15,hue+15),random(hue-15,hue+15));
		ellipse(this.position.x, this.position.y, this.size, this.size);
	}

	this.dead = function() {
		return this.lifeSpan < 0 ? true : false;
	}
}

function drawFireworks(x,y) {
	hue = random(0,360);
	for (var i=0; i<200; i++) {
		pos = createVector(x,y)

		vel = createVector(0,1);
		vel.rotate(random(0,360));
		vel.mult(random(1,5));

		var newBorn = new Particle(pos,vel,hue);
		particleArray.push(newBorn);
	}
}

function mouseClicked() {
	drawFireworks(mouseX,mouseY);
}
