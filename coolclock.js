// Constructor for CoolClock objects
window.CoolClock = function(options) {
	return this.init(options);
}

// Config contains some defaults, some skins, and some options
CoolClock.config = {
	// General options and defaults; see README.md
	tickDelay: 1000,
	longTickDelay: 15000,
	defaultRadius: 85,
	renderRadius: 100,
	defaultSkin: "swissRail",
	defaultTextSkin: "std",
	defaultClockTitle: "",
	useServerTime : true,

	// Clock face skins
	skins:	{
		// There are more skins in moreskins.js
		// Try making your own skin by copy/pasting one of these and tweaking it
		swissRail: {
			outerBorder: { lineWidth: 2, radius:95, color: "#555555", alpha: 1 },
			smallIndicator: { lineWidth: 2, startAt: 88, endAt: 92, color: "#555555", alpha: 1 },
			largeIndicator: { lineWidth: 4, startAt: 79, endAt: 92, color: "#555555", alpha: 1 },
			hourHand: { lineWidth: 8, startAt: -15, endAt: 50, color: "#555555", alpha: 1 },
			minuteHand: { lineWidth: 7, startAt: -15, endAt: 75, color: "#555555", alpha: 1 },
			secondHand: { lineWidth: 1, startAt: -20, endAt: 85, color: "#ff5555", alpha: 1 },
			secondDecoration: { lineWidth: 1, startAt: 70, radius: 4, fillColor: "#ff5555", color: "#ff5555", alpha: 1 }
		},
		chunkySwiss: {
			outerBorder: { lineWidth: 4, radius:97, color: "#555555", alpha: 1 },
			smallIndicator: { lineWidth: 4, startAt: 89, endAt: 93, color: "#555555", alpha: 1 },
			largeIndicator: { lineWidth: 8, startAt: 80, endAt: 93, color: "#555555", alpha: 1 },
			hourHand: { lineWidth: 12, startAt: -15, endAt: 60, color: "#555555", alpha: 1 },
			minuteHand: { lineWidth: 10, startAt: -15, endAt: 85, color: "#555555", alpha: 1 },
			secondHand: { lineWidth: 4, startAt: -20, endAt: 85, color: "#ff5555", alpha: 1 },
			secondDecoration: { lineWidth: 2, startAt: 70, radius: 8, fillColor: "#ff5555", color: "#ff5555", alpha: 1 }
		},
		chunkySwissOnBlack: {
			outerBorder: { lineWidth: 4, radius:97, color: "#cccccc", alpha: 1 },
			smallIndicator: { lineWidth: 4, startAt: 89, endAt: 93, color: "#cccccc", alpha: 1 },
			largeIndicator: { lineWidth: 8, startAt: 80, endAt: 93, color: "#cccccc", alpha: 1 },
			hourHand: { lineWidth: 12, startAt: -15, endAt: 60, color: "#cccccc", alpha: 1 },
			minuteHand: { lineWidth: 10, startAt: -15, endAt: 85, color: "#cccccc", alpha: 1 },
			secondHand: { lineWidth: 4, startAt: -20, endAt: 85, color: "#ff5555", alpha: 1 },
			secondDecoration: { lineWidth: 2, startAt: 70, radius: 8, fillColor: "#ff5555", color: "#ff5555", alpha: 1 }
		},
		miliUbuntu: {
			outerBorder: { lineWidth: 2, radius:95, color: "#555555", alpha: 1 },
			smallIndicator: { lineWidth: 2, startAt: 88, endAt: 92, color: "#555555", alpha: 1 },
			largeIndicator: { lineWidth: 4, startAt: 79, endAt: 92, color: "#555555", alpha: 1 },
			hourHand: { lineWidth: 8, startAt: -15, endAt: 50, color: "#555555", alpha: 1 },
			minuteHand: { lineWidth: 7, startAt: -15, endAt: 75, color: "#555555", alpha: 1 },
			secondHand: { lineWidth: 1, startAt: -20, endAt: 85, color: "#f58535", alpha: 1 },
			secondDecoration: { lineWidth: 1, startAt: 70, radius: 4, fillColor: "#f58535", color: "#f58535", alpha: 1 }
		},

	},

	// Digital clock and title skins
	textSkins: {
		std: {
			font: "10px sans-serif",
			color: "#222222",
			titleOffset: -0.6,
			digitalOffset: 0.6,
			showSecs: true,
			showAmPm: true
		},
		stdOnBlack: {
			font: "10px sans-serif",
			color: "#eeeeee",
			titleOffset: -0.6,
			digitalOffset: 0.6,
			showSecs: true,
			showAmPm: true
		},
		miliUbuntu: {
			font: "11px miliUbuntu",	// font class must be defined in a .css file
			color: "#222222",
			titleOffset: -0.6,
			digitalOffset: 0.6,
			showSecs: true,
			showAmPm: true
		}
	},

	// Will store (a reference to) each clock here, indexed by the id of the canvas element
	clockTracker: {},

	// For giving a unique id to CoolClock canvases with no id
	noIdCount: 0,

	// Placeholder for web server time offset
	serverTimeOffset : 0
};

// Define the CoolClock object's methods
CoolClock.prototype = {

	// Initialise using the parameters parsed from the colon delimited class
	init: function(options) {
		// Parse and store the options
		this.canvasId       = options.canvasId;
		this.skinId         = options.skinId || CoolClock.config.defaultSkin;
		this.textSkinId     = options.textSkinId || CoolClock.config.defaultTextSkin;
		this.displayRadius  = options.displayRadius || CoolClock.config.defaultRadius;
		this.renderRadius   = options.renderRadius || CoolClock.config.renderRadius;
		this.showSecondHand = typeof options.showSecondHand == "boolean" ? options.showSecondHand : true;
		this.gmtOffset      = (options.gmtOffset != null && options.gmtOffset != '') ? parseFloat(options.gmtOffset) : null;
		this.showDigital    = typeof options.showDigital == "boolean" ? options.showDigital : false;
		this.clockTitle     = (options.clockTitle != null && options.clockTitle != '') ? options.clockTitle.toString().replace('_',' ') : CoolClock.config.defaultClockTitle;
		this.logClock       = typeof options.logClock == "boolean" ? options.logClock : false;
		this.logClockRev    = typeof options.logClock == "boolean" ? options.logClockRev : false;

		this.tickDelay      = CoolClock.config[ this.showSecondHand ? "tickDelay" : "longTickDelay" ];

		// Get the canvas element
		this.canvas = document.getElementById(this.canvasId);

		// Make the canvas the requested size. It's always square.
		this.canvas.setAttribute("width",this.displayRadius*2);
		this.canvas.setAttribute("height",this.displayRadius*2);
		this.canvas.style.width = this.displayRadius*2 + "px";
		this.canvas.style.height = this.displayRadius*2 + "px";

		// Determine by what factor to relate skin values to canvas positions.
		// renderRadius is the max skin positional value before leaving the
		// canvas. displayRadius is half the width and height of the canvas in
		// pixels. If they are equal, there is a 1:1 relation of skin position
		// values to canvas pixels. Setting both to 200 allows 100px of space
		// around clock skins to add your own things: this is due to current
		// skins maxing out at a positional value of 100.
		this.scale = this.displayRadius / this.renderRadius;

		// Initialise canvas context
		this.ctx = this.canvas.getContext("2d");
		this.ctx.scale(this.scale,this.scale);

		// Keep track of this object
		CoolClock.config.clockTracker[this.canvasId] = this;

		// should we be running the clock?
		this.active = true;
		this.tickTimeout = null;

		// Start the clock going
		//this.tick();

		return this;
	},

	// Draw a circle at point x,y with params as defined in skin
	fullCircleAt: function(x,y,skin) {
		this.ctx.save();
		this.ctx.globalAlpha = skin.alpha;
		this.ctx.lineWidth = skin.lineWidth;

		this.ctx.beginPath();

		this.ctx.arc(x, y, skin.radius, 0, 2*Math.PI, false);

		if (skin.fillColor) {
			this.ctx.fillStyle = skin.fillColor
				this.ctx.fill();
		}
		if (skin.color) {
			this.ctx.strokeStyle = skin.color;
			this.ctx.stroke();
		}
		this.ctx.restore();
	},

	// Draw some text centered vertically and horizontally
	drawTextAt: function(theText,x,y,textSkin) {
		if (!textSkin) textSkin = this.getTextSkin();
		this.ctx.save();
		this.ctx.font = textSkin.font;
		this.ctx.fillStyle = textSkin.color;
		var tSize = this.ctx.measureText(theText);
		// TextMetrics rarely returns a height property: use baseline instead.
		if (!tSize.height) {
			tSize.height = 0;
			this.ctx.textBaseline = 'middle';
		}
		this.ctx.fillText(theText, x - tSize.width/2, y - tSize.height/2);
		this.ctx.restore();
	},

	// Helper of timeText
	lpad2: function(num) {
		return (num < 10 ? '0' : '') + num;
	},

	// Return the angle a hand must be rotated with at every tick
	tickAngle: function(second) {
		// Log algorithm by David Bradshaw
		var tweak = 3; // If it's lower the one second mark looks wrong (?)
		if (this.logClock) {
			return second == 0 ? 0 : (Math.log(second*tweak) / Math.log(60*tweak));
		}
		else if (this.logClockRev) {
			// Flip the seconds then flip the angle (trickiness)
			second = (60 - second) % 60;
			return 1.0 - (second == 0 ? 0 : (Math.log(second*tweak) / Math.log(60*tweak)));
		}
		else {
			return second/60.0;
		}
	},

	// Take time as an (hour, minute, second) tuple and return it as a readable string
	timeText: function(hour,min,sec) {
		var s = CoolClock.config.textSkins[this.textSkinId];
		return '' +
			(s.showAmPm ? ((hour%12)==0 ? 12 : (hour%12)) : hour) + ':' +
			this.lpad2(min) +
			(s.showSecs ? ':' + this.lpad2(sec) : '') +
			(s.showAmPm ? (hour < 12 ? ' am' : ' pm') : '')
			;
	},

	// Draw a radial line by rotating then drawing a straight line
	// Ha ha, I think I've accidentally used Taus, (see http://tauday.com/)
	radialLineAtAngle: function(angleFraction,skin) {
		this.ctx.save();
		this.ctx.translate(this.renderRadius,this.renderRadius);
		this.ctx.rotate(Math.PI * (2.0 * angleFraction - 0.5));
		this.ctx.globalAlpha = skin.alpha;
		this.ctx.strokeStyle = skin.color;
		this.ctx.lineWidth = skin.lineWidth;

		if (skin.radius) {
			this.fullCircleAt(skin.startAt,0,skin)
		}
		else {
			this.ctx.beginPath();
			this.ctx.moveTo(skin.startAt,0);
			this.ctx.lineTo(skin.endAt,0);
			this.ctx.stroke();
		}
		this.ctx.restore();
	},

	// Draw the clock
	render: function(hour,min,sec) {
		// Get the skins
		var skin = this.getSkin();
		var textSkin = this.getTextSkin();

		// Clear
		this.ctx.clearRect(0,0,this.renderRadius*2,this.renderRadius*2);

		// Draw the outer edge of the clock
		if (skin.outerBorder)
			this.fullCircleAt(this.renderRadius,this.renderRadius,skin.outerBorder);

		// Draw the tick marks. Every 5th one is a big one
		for (var i=0;i<60;i++) {
			(i%5)  && skin.smallIndicator && this.radialLineAtAngle(this.tickAngle(i),skin.smallIndicator);
			!(i%5) && skin.largeIndicator && this.radialLineAtAngle(this.tickAngle(i),skin.largeIndicator);
		}

		var hourA = (hour%12)*5 + min/12.0,
		    minA = min + sec/60.0,
		    secA = sec;

		// Draw the hands
		if (skin.hourHand)
			this.radialLineAtAngle(this.tickAngle(hourA),skin.hourHand);

		if (skin.minuteHand)
			this.radialLineAtAngle(this.tickAngle(minA),skin.minuteHand);

		if (this.showSecondHand && skin.secondHand)
			this.radialLineAtAngle(this.tickAngle(secA),skin.secondHand);

		// Hands decoration
		if (skin.hourDecoration)
			this.radialLineAtAngle(this.tickAngle(hourA), skin.hourDecoration);

		if (skin.minDecoration)
			this.radialLineAtAngle(this.tickAngle(minA), skin.minDecoration);

		if (this.showSecondHand && skin.secondDecoration)
			this.radialLineAtAngle(this.tickAngle(secA),skin.secondDecoration);

		// Write the time
		if (this.showDigital) {
			this.drawTextAt(
					this.clockTitle,
					this.renderRadius,
					this.renderRadius + this.renderRadius * textSkin.titleOffset
				       );
			this.drawTextAt(
					this.timeText(hour,min,sec),
					this.renderRadius,
					this.renderRadius + this.renderRadius * textSkin.digitalOffset
				       );
		}

		if (this.extraRender) {
			this.extraRender(hour,min,sec);
		}
	},

	// Correct the time and call render()
	refreshDisplay: function() {
		var now = Date.now();
		now += CoolClock.config.serverTimeOffset;
		now = new Date(now);
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
		this.tickTimeout = setTimeout("CoolClock.config.clockTracker['"+this.canvasId+"'].tick()",this.tickDelay);
	},

	// Check the canvas element hasn't been removed
	stillHere: function() {
		return document.getElementById(this.canvasId) != null;
	},

	// Stop this clock
	stop: function() {
		this.active = false;
		clearTimeout(this.tickTimeout);
	},

	// Start this clock
	start: function() {
		if (!this.active) {
			this.active = true;
			this.tick();
		}
	},

	// Main tick handler. Refresh the clock then setup the next tick
	tick: function() {
		if (this.stillHere() && this.active) {
			this.refreshDisplay();
			this.nextTick();
		}
	},

	// Return the clock's face skin
	getSkin: function() {
		var skin = CoolClock.config.skins[this.skinId];
		if (!skin) skin = CoolClock.config.skins[CoolClock.config.defaultSkin];
		return skin;
	},

	// Return the clock's digital clock and title skin
	getTextSkin: function() {
		var skin = CoolClock.config.textSkins[this.textSkinId];
		if (!skin) skin = CoolClock.config.textSkins[CoolClock.config.defaultTextSkin];
		return skin;
	},

};

// Return true if canvas is supported by the browser
CoolClock.isCanvasSupported = function(){
	var elem = document.createElement('canvas');
	return !!(elem.getContext && elem.getContext('2d'));
}

// If we are using server time, calcluate server time offset (note: this will only work if jQuery is present)
CoolClock.calcServerTimeOffset = function() {
	if (window.jQuery && CoolClock.config.useServerTime)
	{
		// Retrieve web server time and give it to CoolClock, then start all clocks
		try {
			var ltb = Date.now();
			jQuery.post("/", null, function (data, status, header) {
				var st = new Date(header.getResponseHeader("Date"));
				st = st.getTime();
				var lta = Date.now();
				var lt = 1000*Math.floor((lta+ltb)/2000);
				CoolClock.config.serverTimeOffset = st-lt;
				// testing: alert("ltb=" + ltb.toString() + " lta=" + lta.toString() + " lt=" + lt.toString() + " st=" + st.toString() + " offset=" + (st-lt).toString());
				
				CoolClock.startAllClocks();
			});
		}
		finally {
			// do nothing
		}
	}
	else {
		// Just start all clocks
		CoolClock.startAllClocks();
	}
}

// Start all clocks
CoolClock.startAllClocks = function() {
	for (var id in CoolClock.config.clockTracker)
	{
		var clock = CoolClock.config.clockTracker[id];
		clock.tick();
	}
}

// Find all canvas elements that have the CoolClock class and turns them into clocks
CoolClock.findAndCreateClocks = function() {
	// If canvas is not supported, do nothing
	if (! CoolClock.isCanvasSupported()) return;

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
			var clock = new CoolClock({
				canvasId:       canvases[i].id,
			    skinId:         fields[1],
			    textSkinId:     fields[2],
			    displayRadius:  fields[3],
			    showSecondHand: fields[4]!='noSeconds',
			    gmtOffset:      fields[5],
			    showDigital:    fields[6]=='showDigital',
			    clockTitle:     fields[7],
			    logClock:       fields[8]=='logClock',
			    logClockRev:    fields[8]=='logClockRev'
			});
		}
	}

	// Calculate server time offset
	CoolClock.calcServerTimeOffset();
};

// If jQuery is present, load all clocks present in the document.
// Note: If you don't have jQuery, you'll have to do these things manually, by putting some Javascript in <body onLoad="...">
if (window.jQuery)
{
	jQuery(document).ready(function() {
		// Load all clocks
		CoolClock.findAndCreateClocks();
	});
}
