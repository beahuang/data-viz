
var snowfall = [];
var attractors = [];
var repellers = [];
var CONSTANT = 2;

function setup() {
	var canvas = createCanvas(windowWidth, windowHeight);
	frameRate(30);
	colorMode(HSB, 360,100,100);
	background(0);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function draw() {
	background(0);
	blendMode(SCREEN);

	for (var i=0; i < snowfall.length; i++) {
		var snow = snowfall[i];
		if (snow.dead()) {
			snowfall.splice(i,1);
			var locationV = createVector(random(50, windowWidth-50), 50);
			var velocityV = createVector(sin(radians(random(-90, 90)))/5, 0);
			snowfall.push(new Snow(locationV,velocityV));
		}
		else {
			snow.draw();
			snow.update();
		}
	}
	if(snowfall.length < 800){
		var locationV = createVector(random(50, windowWidth-50), 50);
		var velocityV = createVector(sin(radians(random(-90, 90)))/5, 0);
    snowfall.push(new Snow(locationV,velocityV));
  }

	attractors.forEach(function(a){
		a.draw();
	});

	repellers.forEach(function(r){
		r.draw();
	});
}

var Snow = function(position, velocity) {
	var position = position.copy();
	var velocity = velocity.copy();
	var acceleration = createVector(0,0);
	var hue = hue;
	var size = random(3, 6);

	this.update = function() {
		var gravity = createVector(0,0.01);
		acceleration.add(gravity);

		attractors.forEach(function(attr){
			var acc = p5.Vector.sub(attr.position, position);
			var distanceSq = acc.magSq();
			if(distanceSq > 1){
				acc.div(distanceSq);
				acc.mult(CONSTANT * attr.strength);
				acceleration.add(acc);
			}
		});

		repellers.forEach(function(attr){
			var acc = p5.Vector.sub(attr.position, position);
			var distanceSq = acc.magSq();
			if(distanceSq > 1){
				acc.div(distanceSq);
				acc.mult(0.5 * attr.strength);
				acceleration.sub(acc);
			}
		});

		velocity.add(acceleration);
		position.add(velocity);
		acceleration.mult(0);
	}

	this.draw = function() {
		noStroke();
		fill(hue,random(hue-15,hue+15),random(hue-15,hue+15));
		ellipse(position.x, position.y, size, size);
	}

	this.dead = function() {
		return (position.y > (windowHeight-50)) ? true : false;
	}
}

var Attractor = function(position, strength) {
	this.position = position.copy();
	this.strength = strength;
	this.draw = function() {
		noStroke();
		fill(240, 50, 100);
		rect(this.position.x, this.position.y, this.strength, this.strength);
	}
	this.getStrength = function() {
		return strength;
	}
	this.getPos = function() {
		return position.copy;
	}
}

var Repeller = function(position, strength) {
	this.position = position.copy();
	this.strength = strength;
	this.draw = function() {
		noStroke();
		fill(0, 75, 96);
		ellipse(this.position.x, this.position.y, this.strength, this.strength);
	}
	this.getStrength = function() {
		return strength;
	}
	this.getPos = function() {
		return position.copy;
	}
}

function keyPressed() {
	if (keyCode === ENTER) {
		var pos = createVector(mouseX,mouseY);
		var attr = new Attractor(pos, 5);
		attractors.push(attr);
	}
}

function mouseClicked() {
	var mousePos = createVector(mouseX,mouseY);
	var strength = 5;
	if (attractors.length > 0) {
		if (repellers.length = 1) {
			repellers[0] = new Repeller(mousePos, strength);
		}
		else {
			repellers.push(new Repeller(mousePos, strength));
		}
	}
}
