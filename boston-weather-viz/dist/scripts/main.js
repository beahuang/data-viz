var table;
var img;
var pDensity = 15;
var dayParticleSystem = [];
var dayObject = {};
var dayArray = [];
var imageParticles;
var slider;

/**
 * Preloads the weather data and the image being rendered into particles
 */
function preload() {
	table = loadTable( "dist/data/weather.csv", "csv","header" );
	img = loadImage( "dist/images/image4.png" );
}

/**
 * Converts the weather data into Day Objects
 */
function dataSetup() {
	for ( var rowIndex = 0; rowIndex < table.getRowCount(); rowIndex++ ) {
		var month = table.getString(rowIndex,"mo");
		var day = table.getString(rowIndex,"da");
		var date = month + "/" + day
		var temperature = table.getString(rowIndex,"temp");
		temperature = parseInt(temperature);
		dayObject[date] = temperature;
	}
	Object.keys( dayObject ).forEach( function( date ) {
		var day = {};
		day.date = date;
		day.temperature = dayObject[ date ];
		dayArray.push( day );
	});
}

/**
 * Creates ImageParticles based off of image data
 * takes a subset of pDensity pixels creates a ImageParticle if they
 * do not have a transparency level greater than 128
 * @param {Number} xOffset: x offset for centering
 * @param {Number} yOffset: y offset for centering
 */
function drawImageParticles(xOffset, yOffset) {
	imageParticles = [];
	img.loadPixels();
	for ( var y = 0, y2 = img.height; y < y2; y += pDensity ) {
		for ( var x = 0, x2 = img.width; x < x2; x += pDensity ) {
			if ( img.get( x, y )[ 3 ] > 128) {
				var particle = new ImageParticle( x + xOffset, y + yOffset, pDensity * 1 );
				imageParticles.push( particle );
			}
		}
	}
	imageParticles.forEach( function( imageParticle ) {
		imageParticle.draw();
	} );
}

/**
 * Creates a slider element in the DOM for interaction
 * @param {Number} xOffset: x offset for centering
 * @param {Number} yOffset: y offset for centering
 * @param (Number) width: width of the ImageParticle image
 */
function setupSlider(xOffset, yOffset, width ) {
  slider = createSlider( 0, dayArray.length, 0 );
  slider.position( xOffset, yOffset );
  slider.style( 'width', width + "px" );
	console.log( slider.value() );
}

/**
 * Changes the Day that is being shown based of the slider value
 */
function setUpDay() {
	//TODO: figure out a way to change the day based on the slider
	for ( day in dayArray ) {
		var date = dayArray[ day ].date;
		var temperature = dayArray[ day ].temperature;
	}
}

/**
 * Draw the text for title, day and temperature
 * @param {String} date: the Day's date
 * @param {String} temperature: the Day's temperature
 */
function drawText( date, temperature ) {
	//TODO change the color based on weather
	//TODO this should have the date, temperature + shit
	fill( 0 )
	textAlign( CENTER );
	textSize( 40 );
	text( "Boston's 2015 Weather Visualization", windowWidth/2, 150 );
	textSize( 20 );
	text( "Day: " + date, windowWidth/2, windowHeight/2 + 100);
	text( "Temperature: " + temperature, windowWidth/2, windowHeight/2 + 140);
}

/**
 * Setup the canvas
 */
function setup() {
	var canvas = createCanvas( windowWidth, windowHeight );
	frameRate( 30 );
	colorMode( HSB, 360, 100, 100 );
	dataSetup();
	setupSlider( windowWidth/2 - img.width/2,
							 windowHeight/2 + img.height/2 - 50,
							 img.width );
	drawImageParticles( windowWidth/2 - img.width/2,
											windowHeight/2 - img.height );
}

/**
 * Draw
 */
function draw() {
	drawText( "1/1", 1 );
}

/**
 * Changes the position of elements based off of window resize
 */
function windowResized() {
	resizeCanvas( windowWidth, windowHeight );
	slider.style( 'width', img.width + "px" );
	slider.position( windowWidth/2 - img.width/2,
									 windowHeight/2 + img.height/2 - 50 );
	drawImageParticles( windowWidth/2 - img.width/2,
											windowHeight/2 - img.height );
}

/**
 * ImageParticle Class
 * @param {Number} x: x position of particle
 * @param {Number} y: y position of particle
 * @param {Number} radius: size of the particle
 */
var ImageParticle = function( x, y, radius ) {
	this.x = x;
	this.y = y;

	/**
	 * Draws an ImageParticle
	 */
	this.draw = function() {
		noStroke();
		ellipse( x, y, radius, radius );
		fill(0);
	}
}

/**
 * Day Class
 * @param {Number} date: the day of the
 * @param {Number} temperature: the temperature of that day
 */
var Day = function( date, temperature ) {
	this.date = date;
	this.temperature = temperature;
	this.imageParticles = imageParticles

	/**
	 * Changes the date
	 */
	this.draw = function() {
		//TODO: This should change the date of the page
	}

	/**
	 * Updates the ImageParticles based off of the temperature
	 */
	this.update = function() {
		//TODO: This should modify the particle system
	}
}
