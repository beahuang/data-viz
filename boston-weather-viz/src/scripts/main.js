var imgBoston, imgSf, imgNyc;
var pDensity = 7.5;
var dayParticleSystem = [];
var dayObject = {};
var dayArray = [];
var imageParticles;
var cityString;

/**
 * Preloads the weather data and the image being rendered into particles
 */
function preload() {
	tableBoston = loadTable( "dist/data/boston.csv", "csv","header" );
	tableSf = loadTable( "dist/data/sf.csv", "csv","header" );
	tableNyc = loadTable( "dist/data/nyc.csv", "csv","header" );
	imgBoston = loadImage( "dist/images/boston.png" );
	imgSf = loadImage( "dist/images/sf.png" );
	imgNyc = loadImage( "dist/images/nyc.png" );
	bg = loadImage("dist/images/bg.jpg");
}

/**
 * Converts the weather data into Day Objects
 * Adds the Day Objects to an Array and then
 * sorts the array from past to present dates
 * @param {Table} table: The data it should be creating Days from
 */
function createDays( table ) {

	for ( var rowIndex = 0; rowIndex < table.getRowCount(); rowIndex++ ) {
		var month = table.getString(rowIndex,"mo");
		var day = table.getString(rowIndex,"da");
		var date = month + "/" + day
		var temperature = table.getString(rowIndex,"temp");
		temperature = parseInt(temperature);
		dayObject[date] = temperature;
	}

	dayArray = [];
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
function createImageParticles(img, xOffset, yOffset) {
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
	return imageParticles
}

/**
 * Creates a slider element in the DOM for interaction
 * @param {Number} xOffset: x offset for centering
 * @param {Number} yOffset: y offset for centering
 * @param (Number) width: width of the ImageParticle image
 */
function setupSlider(xOffset, yOffset, width ) {
	$.extend( $.ui.slider.prototype.options, {
	    animate: 300
	});

	$("#flat-slider")
			.slider({
					max: dayArray.length - 1,
					min: 0,
					range: "min",
					value: 30,
					orientation: "vertical"
	})
	.slider("pips", {
			first: "label",
			last: "label",
			step: 20
	});

}



/**
 * Change the Data based off of the Select
 */
function changeData() {
	select = document.getElementsByTagName("select")[0];
  var city = select.options[select.selectedIndex].value;
	switch ( city ) {
		case 'nyc':
			setUpNyc()
			break;
		case 'sf':
			setUpSf()
			break;
		default :
			setUpBoston();
	}
}

/**
 * Setup the canvas for San Francisco
 */
function setUpSf() {
	createImageParticles( imgSf , windowWidth/2 - imgSf.width/2,
											windowHeight/2 - imgSf.height );
	createDays( tableSf );
	cityString = "San Francisco"
}

/**
 * Setup the canvas for NYC
 */
function setUpNyc() {
	createImageParticles( imgNyc , windowWidth/2 - imgNyc.width/2,
											windowHeight/2 - imgNyc.height + 50 );
	createDays( tableNyc );
	cityString = "New York City"
}

/**
 * Setup the canvas for Boston
 */
function setUpBoston() {
	createImageParticles( imgBoston , windowWidth/2 - imgBoston.width/2,
											windowHeight/2 - imgBoston.height + 40 );
	createDays( tableBoston );
	cityString = "Boston"
}

/**
 * Draw the text for title, day and temperature
 * @param {String} city: the city whose dataset we're looking at
 * @param {String} date: the Day's date
 * @param {String} temperature: the Day's temperature
 */
function drawText( city, date, temperature ) {
	fill( 0 )
	textAlign( CENTER );
	textSize( 40 );
	textFont( "Helvetica" );
	text( city + "'s Weather Visualization", windowWidth/2, 150 );
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
	setUpBoston();
	setupSlider( windowWidth/2 - imgBoston.width/2,
							 windowHeight/2 + imgBoston.height/2 - 70,
							 imgBoston.width );
}

/**
 * Draw
 */
function draw() {
	background( 'hex(434d5a)' );
	dayIndex = $('#flat-slider').slider("option", "value");
	day = dayArray[ dayIndex ];
	imageParticles.forEach( function( imageParticle ) {
		imageParticle.draw();
	} );
	day.update();
	drawText( cityString, day.date, parseInt( day.temperature ) );
}

/**
 * Changes the position of elements based off of window resize
 */
function windowResized() {
	resizeCanvas( windowWidth, windowHeight );
	setUpBoston();
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
	 * @param: {Color} color : the particle should change to
	 */
	this.changeColor = function( color ) {
		this.color = color;
	}

	/**
	 * Changes the movement of the particles
	 * @param: {Number} movement: range of pixels it should randomly moving by
	 */
	this.changeMovement = function( movement ) {
		saveX = x;
		saveY = y;

		if ( this.x < ( saveX + movement ) ) {
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
		if ( temperature < 32 ) {
			offset = 32 - temperature;
			luminence = parseInt(30 + offset);
			return color( 'hsl(217, 100%,' + luminence + '%)' );
		}
		else if ( temperature < 45 ) {
			offset = 45 - temperature;
			luminence = parseInt(30 + offset);
			return color( 'hsl(201, 86%,' + luminence + '%)' );
		}
		else if ( temperature < 60 ) {
			offset = 60 - temperature;
			luminence = parseInt(30 + offset);
			return color( 'hsl(46, 84%,' + luminence + '%)' );
		}
		else if ( temperature < 75 ) {
			offset = 80 - temperature;
			luminence = parseInt(30 + offset);
			return color( 'hsl(21, 100%,' + luminence + '%)' );
		}
		else {
			offset = 100 - temperature;
			luminence = parseInt(30 + offset);
			return color( 'hsl(0, 84%,' + luminence + '%)' );
		}
	}

	/**
	 * Change the image particle position based off of temperature
	 * @param: {Number} temperature: The temperature of the day
	 * @return {Number}: The amout the particle should move
	 */
	function changeMovement( temperature ) {
		if ( temperature < 20 ) {
			return 0;
		}
		else if ( temperature < 40 ) {
			return 1;
		}
		else if ( temperature < 60 ) {
			return 2;
		}
		else if ( temperature < 80 ) {
			return 6;
		}
		else {
			return 8;
		}
	}
}
