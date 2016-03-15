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

	particleSystem.forEach(function(station){
		station.draw();
		station.update();
	});
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

var Day = function(date, temperature) {
	this.date = date;
	this.temperature = temperature;

	this.update = function(){
	}
	this.draw = function() {
	}
}
var
