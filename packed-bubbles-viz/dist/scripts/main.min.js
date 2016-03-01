var particleSystem = [];
var attractors = [];
var table;

var stationObject = {};
var stationArray = [];

function preload() {
	table = loadTable("dist/data/weather.csv", "csv","header");
}

function dataSetup() {
	for (var rowIndex = 0; rowIndex < table.getRowCount(); rowIndex++) {
		var month = table.getString(rowIndex,"mo");
		var day = table.getString(rowIndex,"da");
		var date = month + "/" + day
		var temperature = table.getString(rowIndex,"temp");
		temperature = parseInt(temperature);
		stationObject[date] = temperature;
	}

	Object.keys(stationObject).forEach(function(date) {
		var station = {};
		station.date = date;
		station.temperature = stationObject[date];
		stationArray.push(station);
	});

	for(var i = 0; i < stationArray.length; i++) {
		var date = stationArray[i].date;
		var temperature = stationArray[i].temperature;
		var station = new Station(date, temperature);
		particleSystem.push(station);
	}
}

function setup() {
	var canvas = createCanvas(windowWidth, windowHeight);
	frameRate(30);
	colorMode(HSB, 360,100,100);
	dataSetup();

	var at = new Attractor(createVector(width/2, height/2), 0.5);
	attractors.push(at);
}

function draw() {
	background(0);
	blendMode(SCREEN);

	for(var STEPS = 0; STEPS<2; STEPS++){
			for(var i=0; i<particleSystem.length-1; i++){
					for(var j=i+1; j<particleSystem.length; j++){
							var pa = particleSystem[i];
							var pb = particleSystem[j];
							var ab = p5.Vector.sub(pb.pos, pa.pos);
							var distSq = ab.magSq();
							if(distSq <= sq(pa.radius + pb.radius)){
									var dist = sqrt(distSq);
									var overlap = (pa.radius + pb.radius) - dist;
									ab.div(dist);
									ab.mult(overlap*0.5);
									pb.pos.add(ab);
									ab.mult(-1);
									pa.pos.add(ab);
									pa.vel.mult(0.97);
									pb.vel.mult(0.97);
							}
					}
			}
	}

	particleSystem.forEach(function(station){
		station.draw();
		station.update();
	});
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

var Station = function(date, temperature) {
	this.date = date;
	this.temperature = temperature;

	this.radius = temperature/4.5;
	var initialRadius = this.radius;
	var maximumRadius = 40;

	this.vel = createVector(0,0);
	this.acc = createVector(0,0);

	var tempAng = random(TWO_PI);
	this.pos = createVector(cos(tempAng), sin(tempAng));
	this.pos.div(this.radius);
	this.pos.mult(10000);
	this.pos.set(this.pos.x + width/2, this.pos.y + height/2);

	this.update = function(){
		attractors.forEach(function(A){
			var att = p5.Vector.sub(A.pos, this.pos);
			var distanceSq = att.magSq();
			if(distanceSq > 1) {
				att.normalize();
				att.div(10);
				this.acc.add(att);
			}
		}, this);
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);

		checkMouse(this);
	}
	function incRadius(instance) {
		instance.radius += 4;
		if (instance.radius > maximumRadius) {
			instance.radius = maximumRadius;
		}
	}
	function decRadius(instance) {
		instance.radius -= 4;
		if (instance.radius < initialRadius) {
			instance.radius = initialRadius;
		}
	}
	this.getColor = function() {
		if (this.temperature < 20) {
			fill(240,100,100);
		}
		else if (this.temperature < 40) {
			fill(180,100,100);
		}
		else if (this.temperature < 60) {
			fill(0,40,97);
		}
		else if (this.temperature < 80) {
			fill(30,100,100);
		}
		else {
			fill(0,100,100);
		}
	}
	function showText(instance){
		fill(0,0,100);
		text(instance.date, instance.pos.x - 15, instance.pos.y-5);
		text(instance.temperature + " degrees", instance.pos.x - 30, instance.pos.y+10);
	}
	this.draw = function() {
		noStroke();
		this.getColor();
		ellipse(this.pos.x,this.pos.y,this.radius*2,this.radius*2);
	}
	function checkMouse(instance) {
		var mousePos = createVector(mouseX,mouseY);
		if (mousePos.dist(instance.pos) <= instance.radius) {
			incRadius(instance);
			showText(instance);
			isMouseOver = true;
		} else {
			decRadius(instance);
			isMouseOver = false
		}
	}
}

var Attractor = function(pos, s){
    this.pos = pos.copy();
    var strength = s;
    this.draw = function(){
        noStroke();
        fill(0, 100, 100);
        ellipse(this.pos.x, this.pos.y,
                strength, strength);
    }

    this.getStrength = function(){
        return strength;
    }
    this.getPos = function(){
        return this.pos.copy();
    }
}
