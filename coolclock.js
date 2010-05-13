/**
 * CoolClock 2.0.1
 * Copyright 2010, Simon Baird
 * Released under the BSD License.
 *
 * Display an analog clock using canvas.
 * http://randomibis.com/coolclock/
 *
 */

// Constructor for CoolClock objects
window.CoolClock = function(canvasId,displayRadius,skinId,showSecondHand,gmtOffset) {
	return this.init(canvasId,displayRadius,skinId,showSecondHand,gmtOffset);
}

// Config contains some defaults, and clock skins
CoolClock.config = {
	tickDelay: 1000,
	longTickDelay: 15000,
	defaultRadius: 85,
	renderRadius: 100,
	defaultSkin: "swissRail",

	skins:	{
		// There are more skins in moreskins.js
		// Try making your own skin by copy/pasting one of these and tweaking it
		swissRail: {
			outerBorder: { lineWidth: 2, radius:95, color: "black", alpha: 1 },
			smallIndicator: { lineWidth: 2, startAt: 88, endAt: 92, color: "black", alpha: 1 },
			largeIndicator: { lineWidth: 4, startAt: 79, endAt: 92, color: "black", alpha: 1 },
			hourHand: { lineWidth: 8, startAt: -15, endAt: 50, color: "black", alpha: 1 },
			minuteHand: { lineWidth: 7, startAt: -15, endAt: 75, color: "black", alpha: 1 },
			secondHand: { lineWidth: 1, startAt: -20, endAt: 85, color: "red", alpha: 1 },
			secondDecoration: { lineWidth: 1, startAt: 70, radius: 4, fillColor: "red", color: "red", alpha: 1 }
		},
		chunkySwiss: {
			outerBorder: { lineWidth: 4, radius:97, color: "black", alpha: 1 },
			smallIndicator: { lineWidth: 4, startAt: 89, endAt: 93, color: "black", alpha: 1 },
			largeIndicator: { lineWidth: 8, startAt: 80, endAt: 93, color: "black", alpha: 1 },
			hourHand: { lineWidth: 12, startAt: -15, endAt: 60, color: "black", alpha: 1 },
			minuteHand: { lineWidth: 10, startAt: -15, endAt: 85, color: "black", alpha: 1 },
			secondHand: { lineWidth: 4, startAt: -20, endAt: 85, color: "red", alpha: 1 },
			secondDecoration: { lineWidth: 2, startAt: 70, radius: 8, fillColor: "red", color: "red", alpha: 1 }
		},
		chunkySwissOnBlack: {
			outerBorder: { lineWidth: 4, radius:97, color: "white", alpha: 1 },
			smallIndicator: { lineWidth: 4, startAt: 89, endAt: 93, color: "white", alpha: 1 },
			largeIndicator: { lineWidth: 8, startAt: 80, endAt: 93, color: "white", alpha: 1 },
			hourHand: { lineWidth: 12, startAt: -15, endAt: 60, color: "white", alpha: 1 },
			minuteHand: { lineWidth: 10, startAt: -15, endAt: 85, color: "white", alpha: 1 },
			secondHand: { lineWidth: 4, startAt: -20, endAt: 85, color: "red", alpha: 1 },
			secondDecoration: { lineWidth: 2, startAt: 70, radius: 8, fillColor: "red", color: "red", alpha: 1 }
		}

	},

	// Test for IE so we can nurse excanvas in a couple of places
	isIE: !!document.all,

	// Will store (a reference to) each clock here, indexed by the id of the canvas element
	clockTracker: {},

	// For giving a unique id to coolclock canvases with no id
	noIdCount: 0
};

// Define the CoolClock object's methods
CoolClock.prototype = {

	// Initialise using the parameters parsed from the colon delimited class
	init: function(canvasId,displayRadius,skinId,showSecondHand,gmtOffset) {
		// Store the parameters
		this.canvasId = canvasId;
		this.displayRadius = displayRadius || CoolClock.config.defaultRadius;
		this.skinId = skinId || CoolClock.config.defaultSkin;
		this.showSecondHand = typeof showSecondHand == "boolean" ? showSecondHand : true;
		this.tickDelay = CoolClock.config[ this.showSecondHand ? "tickDelay" : "longTickDelay" ];
		this.gmtOffset = gmtOffset != null ? parseFloat(gmtOffset) : gmtOffset;

		// Get the canvas element
		this.canvas = document.getElementById(canvasId);

		// Make the canvas the requested size. It's always square.
		this.canvas.setAttribute("width",this.displayRadius*2);
		this.canvas.setAttribute("height",this.displayRadius*2);
		this.canvas.style.width = this.displayRadius*2 + "px";
		this.canvas.style.height = this.displayRadius*2 + "px";

		// Explain me please...?
		this.renderRadius = CoolClock.config.renderRadius; 
		this.scale = this.displayRadius / this.renderRadius;

		// Initialise canvas context
		this.ctx = this.canvas.getContext("2d");
		this.ctx.scale(this.scale,this.scale);

		// Keep track of this object
		CoolClock.config.clockTracker[canvasId] = this;

		// Start the clock going
		this.tick();

		return this;
	},

	// Draw a circle at point x,y with params as defined in skin
	fullCircleAt: function(x,y,skin) {
		with (this.ctx) {
			save();
			globalAlpha = skin.alpha;
			lineWidth = skin.lineWidth;

			if (!CoolClock.config.isIE) {
				beginPath();
			}

			if (CoolClock.config.isIE) {
				// excanvas doesn't scale line width so we will do it here
				lineWidth = lineWidth * this.scale;
			}

			arc(x, y, skin.radius, 0, 2*Math.PI, false);

			if (CoolClock.config.isIE) {
				// excanvas doesn't close the circle so let's fill in the tiny gap
				arc(x, y, skin.radius, -0.1, 0.1, false);
			}

			if (skin.fillColor) {
				fillStyle = skin.fillColor
				fill();
			}
			else {
				// XXX why not stroke and fill
				strokeStyle = skin.color;
				stroke();
			}
			restore();
		}
	},

	// Draw a radial line by rotating then drawing a straight line
	radialLineAtAngle: function(angleFraction,skin) {
		with (this.ctx) {
			save();
			translate(this.renderRadius,this.renderRadius);
			rotate(Math.PI * (2 * angleFraction - 0.5));
			globalAlpha = skin.alpha;
			strokeStyle = skin.color;
			lineWidth = skin.lineWidth;

			if (CoolClock.config.isIE)
				// excanvas doesn't scale line width so we will do it here
				lineWidth = lineWidth * this.scale;

			if (skin.radius) {
				this.fullCircleAt(skin.startAt,0,skin)
			}
			else {
				beginPath();
				moveTo(skin.startAt,0)
				lineTo(skin.endAt,0);
				stroke();
			}
			restore();
		}
	},

	render: function(hour,min,sec) {
		// Get the skin
		var skin = CoolClock.config.skins[this.skinId];
		if (!skin) skin = CoolClock.config.skins[CoolClock.config.defaultSkin];

		// Clear
		this.ctx.clearRect(0,0,this.renderRadius*2,this.renderRadius*2);

		// Draw the outer edge of the clock
		if (skin.outerBorder)
			this.fullCircleAt(this.renderRadius,this.renderRadius,skin.outerBorder);

		// Draw the tick marks. Every 5th one is a big one
		for (var i=0;i<60;i++) {
			(i%5)  && skin.smallIndicator && this.radialLineAtAngle(i/60,skin.smallIndicator);
			!(i%5) && skin.largeIndicator && this.radialLineAtAngle(i/60,skin.largeIndicator);
		}

		// Draw the hands
		if (skin.hourHand)
			this.radialLineAtAngle((hour+min/60)/12,skin.hourHand);

		if (skin.minuteHand)
			this.radialLineAtAngle((min+sec/60)/60,skin.minuteHand);

		if (this.showSecondHand && skin.secondHand)
			this.radialLineAtAngle(sec/60,skin.secondHand);

		// Second hand decoration doesn't render right in IE so lets turn it off
		if (!CoolClock.config.isIE && this.showSecondHand && skin.secondDecoration)
			this.radialLineAtAngle(sec/60,skin.secondDecoration);
	},

	// Check the time and display the clock
	refreshDisplay: function() {
		var now = new Date();
		if (this.gmtOffset != null) {
			// Use GMT + gmtOffset
			var offsetNow = new Date(now.valueOf() + (this.gmtOffset * 1000 * 60 * 60));
			this.render(offsetNow.getUTCHours(),offsetNow.getUTCMinutes(),offsetNow.getUTCSeconds());
		}
		else {
			// Use local time
			this.render(now.getHours(),now.getMinutes(),now.getSeconds());
		}
	},

	// Set timeout to trigger a tick in the future
	nextTick: function() {
		setTimeout("CoolClock.config.clockTracker['"+this.canvasId+"'].tick()",this.tickDelay);
	},

	// Check the canvas element hasn't been removed
	stillHere: function() {
		return document.getElementById(this.canvasId) != null;
	},

	// Main tick handler. Refresh the clock then setup the next tick
	tick: function() {
		if (this.stillHere()) {
			this.refreshDisplay()
			this.nextTick();
		}
	}
};

// Find all canvas elements that have the CoolClock class and turns them into clocks
CoolClock.findAndCreateClocks = function() {
	// (Let's not use a jQuery selector here so it's easier to use frameworks other than jQuery)
	var canvases = document.getElementsByTagName("canvas");
	for (var i=0;i<canvases.length;i++) {
		// Pull out the fields from the class. Example "CoolClock:chunkySwissOnBlack:1000"
		var fields = canvases[i].className.split(" ")[0].split(":");
		if (fields[0] == "CoolClock") {
			if (!canvases[i].id) {
				// If there's no id on this canvas element then give it one
				canvases[i].id = '_coolclock_auto_id_' + CoolClock.config.noIdCount++;
			}
			// Create a clock object for this element
			new CoolClock(canvases[i].id,fields[2],fields[1],fields[3]!="noSeconds",fields[4]);
		}
	}
};

// If you don't have jQuery then you need a body onload like this: <body onload="CoolClock.findAndCreateClocks()">
// If you do have jQuery and it's loaded already then we can do it right now
if (window.jQuery) jQuery(document).ready(CoolClock.findAndCreateClocks);
