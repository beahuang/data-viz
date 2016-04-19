var table;
var img;
var pDensity = 7.5;
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
	bg = loadImage("dist/images/bg.jpg");
}

/**
 * Converts the weather data into Day Objects
 * Adds the Day Objects to an Array and then
 * sorts the array from past to present dates
 */
function createDays() {
	for ( var rowIndex = 0; rowIndex < table.getRowCount(); rowIndex++ ) {
		var month = table.getString(rowIndex,"mo");
		var day = table.getString(rowIndex,"da");
		var date = month + "/" + day
		var temperature = table.getString(rowIndex,"temp");
		temperature = parseInt(temperature);
		dayObject[date] = temperature;
	}
	Object.keys( dayObject ).forEach( function( date ) {
		var day = new Day( date, dayObject[ date ] );
		dayArray.push( day );
	});
	dayArray.sort( function( a, b ) {
		return new Date( a.date ) - new Date( b.date );
	});
}

/**
 * Creates ImageParticles based off of image data
 * takes a subset of pDensity pixels creates a ImageParticle if they
 * do not have a transparency level greater than 128
 * @param {Number} xOffset: x offset for centering
 * @param {Number} yOffset: y offset for centering
 */
function createImageParticles(xOffset, yOffset) {
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
}

/**
 * Creates a slider element in the DOM for interaction
 * @param {Number} xOffset: x offset for centering
 * @param {Number} yOffset: y offset for centering
 * @param (Number) width: width of the ImageParticle image
 */
function setupSlider(xOffset, yOffset, width ) {
  slider = createSlider( 0, dayArray.length - 1, 0 );
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
	fill( 0 )
	textAlign( CENTER );
	textSize( 40 );
	textFont( "Helvetica" );
	text( "Boston's Weather Visualization", windowWidth/2, 150 );
	textSize( 20 );
	text( "Day: " + date + "/2015", windowWidth/2, windowHeight/2 + 100 );
	text( "Temperature: " + temperature + "° Fahrenheit",
				windowWidth/2,
				windowHeight/2 + 140 );
}

/**
 * Setup the canvas
 */
function setup() {
	var canvas = createCanvas( windowWidth, windowHeight );
	frameRate( 30 );
	createDays();
	setupSlider( windowWidth/2 - img.width/2,
							 windowHeight/2 + img.height/2 - 50,
							 img.width );
	createImageParticles( windowWidth/2 - img.width/2,
											windowHeight/2 - img.height );
}

/**
 * Draw
 */
function draw() {
	background( bg );
	day = dayArray[ slider.value() ];
	imageParticles.forEach( function( imageParticle ) {
		imageParticle.draw();
	} );
	day.update();
	drawText( day.date, parseInt( day.temperature ) );
}

/**
 * Changes the position of elements based off of window resize
 */
function windowResized() {
	resizeCanvas( windowWidth, windowHeight );
	slider.style( 'width', img.width + "px" );
	slider.position( windowWidth/2 - img.width/2,
									 windowHeight/2 + img.height/2 - 50 );
	createImageParticles( windowWidth/2 - img.width/2,
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
	this.color = color( 'rgb(0, 0, 0)' );

	/**
	 * Draws an ImageParticle
	 */
	this.draw = function() {
		noStroke();
		fill( this.color );
		ellipse( this.x, this.y, radius, radius );
		this.changeMovement();
	}

	/**
	 * Changes the color of the particle
	 */
	this.changeColor = function( color ) {
		this.color = color;
	}

	this.changeMovement = function( movement ) {
		//TODO: change movement based off of temperature
		saveX = x;
		saveY = y;

		if ( this.x < (saveX + movement)) {
			this.x += random(movement);
			this.y += random(movement);
		}
		else {
			this.x = saveX;
			this.y = saveY;
		}
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
	 * Updates the ImageParticles based off of the temperature
	 */
	this.update = function() {
		var color = getColor( this.temperature );
		var movement = changeMovement( this.temperature );
		imageParticles.forEach( function( imageParticle ) {
			imageParticle.changeColor( color );
			imageParticle.changeMovement( movement );
		} );
	}

	/**
	 * Change the image particle color based off of temperature
	 * @param: {Number}: The temperature of the day
	 * @return {Color}: The color that the image particle should be
	 */
	function getColor( temperature ) {
		if (temperature < 20) {
			return color( 'rgb(0, 94, 255)' );
		}
		else if (temperature < 40) {
			return color( 'rgb(113, 197, 245)' );
		}
		else if (temperature < 60) {
			return color( 'rgb(232, 185, 19) ');
		}
		else if (temperature < 80) {
			return color( 'rgb(255, 92, 0)' );
		}
		else {
			return color( 'rgb(236, 26, 26)' );
		}
	}

	/**
	 * Change the image particle position based off of temperature
	 * @param: {Number}: The temperature of the day
	 * @return {Number}: The amout the particle should move
	 */
	function changeMovement( temperature ) {
		if (temperature < 20) {
			return 0;
		}
		else if (temperature < 40) {
			return 1;
		}
		else if (temperature < 60) {
			return 2;
		}
		else if (temperature < 80) {
			return 6;
		}
		else {
			return 8;
		}
	}
}
