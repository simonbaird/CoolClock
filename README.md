
CoolClock - The Javascript Analog Clock
=======================================

About CoolClock
---------------

CoolClock is a customisable javascript analog clock.

What's New
----------

_(NB: Needs update)_

- **(19-Aug-2010)** - Release version 2.1, new features include digital (text)
  display and two logClock modes. See logClock demo and demo2.
- **(26-Apr-2010)** - Released new version 2.0 and added source to github. Added note
  about new onload requirements.
- **26-Apr-2010)** - Someone has created a CoolClock plugin for SongBird. Go check
  it out.

Requirements
------------

CoolClock requires canvas suport therefore it works best in Firefox, Safari or
Chrome. It can work in IE via the use of ExplorerCanvas however in IE it
refreshes slowly, doesn't render as nicely and the second hand decoration is
disabled due to a rendering glitch. CoolClock does not use Flash.

Using CoolClock
---------------

Download `coolclock.js`, `moreskins.js` and `excanvas.js` and put them in the
same folder as your html file.  In the head section of your html file add the
following:

````Html
<!--[if IE]><script type="text/javascript" src="excanvas.js"></script><![endif]-->
<script type="text/javascript" src="coolclock.js"></script>
<script type="text/javascript" src="moreskins.js"></script>
````

Now there are two approaches to enabling your clocks, depending on whether your
page uses jQuery. If your page uses jQuery and jQuery is loaded before
coolclock.js is loaded, then you don't have to do anything more.

If your page doesn't use jQuery then you need to add
`onload="CoolClock.findAndCreateClocks()"` to your body tag, (or the equivalent
in your preferred javascript framework). For example, your body tag might look
like this:

````Html
<body onload="CoolClock.findAndCreateClocks()">
````


Somewhere in the body of your html file add the following:

````Html
<canvas id="clockid" class="CoolClock:Skin:Radius:noSeconds:GMTOffset"></canvas>
````

The colon delimited fields after CoolClock in the class control the appearance of the clock. The fields are as follows:

<table>
<tr><td>`CoolClock`</td><td>Required</td>

<td>Without that your canvas will be left alone</td></tr>

<tr><td>`Skin`</td><td>Optional. Default is "swissRail"</td>

<td>Specifies which skin to use. CoolClock currently includes seven skins,
"swissRail", "chunkySwiss", "fancy", "machine", "classic", "modern" and
"simple". (The last three were created by Bonstio for use with his Google
Gadget). It's easy to create your own additional skins</td></tr>

<tr><td>`Radius`</td><td>Optional. Default is 85</td>

<td>Specifies the radius in pixels of the clock</td></tr>

<tr><td>`noSeconds`</td><td>Optional</td>

<td>If you include "noSeconds" as the last field then the clock will have no
second hand. Use if your CPU usage is too high</td></tr>

<tr><td>`GMTOffset`</td><td>Optional</td>

<td>If you don't specify anything you get local time. If you specify a value
here (in hours) it will be used as an offset from GMT (UTC). Eg, put -5 to
indicate 5 hours behind GMT. You can specify fractions of hours, eg
+2.5</td></tr>

</table>

You should be able to omit fields to indicate you want the default values, eg
`CoolClock:::noSeconds` means default skin and default size with no second
hand.

If you want to add a real css class to your clock canvases you can do so by
adding a space then the class. For example:

````Html
<canvas id="clk1" class="CoolClock:fancy myClock"></canvas>
````

And of course you can add styles directly if you need to, eg:

````Html
<canvas id="clk2" style="display:block;" class="CoolClock:fancy"></canvas>
`````

The id can be anything but it should be unique of course.

Creating Your Own Skin
----------------------

You can design your own clock by creating a CoolClock "skin". Take a look at
the CoolClock.config section the javascript file. Copy and paste an existing
skin, for example copy these nine lines:

````JavaScript
swissRail: {
  outerBorder: { lineWidth: 1, radius:95, color: "black", alpha: 1 },
  smallIndicator: { lineWidth: 2, startAt: 89, endAt: 93, color: "black", alpha: 1 },
  largeIndicator: { lineWidth: 4, startAt: 80, endAt: 93, color: "black", alpha: 1 },
  hourHand: { lineWidth: 8, startAt: -15, endAt: 50, color: "black", alpha: 1 },
  minuteHand: { lineWidth: 7, startAt: -15, endAt: 75, color: "black", alpha: 1 },
  secondHand: { lineWidth: 1, startAt: -20, endAt: 85, color: "red", alpha: 1 },
  secondDecoration: { lineWidth: 1, startAt: 70, radius: 4, fillColor: "red", color: "red", alpha: 1 }
},
````

Name your skin, eg change "swissRail" to "mySkin". Your skin is now available
for use. Change the settings in your skin to change the look of your clock. The
numbers refer to a percentage of the radius, so `startAt: 0, endAt: 50` means a
line from the center to 50% of the way to the edge. Alpha means the
transparency of the element where `alpha: 1` means solid. For example `alpha: 0.5`
means 50% transparent. Use the other skins for examples.

At present you can only use certain predefined elements. In a possible future
version of CoolClock skins may support any number of clock elements.

If you make a nice skin and would like to share it then send it to me at
<simon.baird@gmail.com>.

SongBird Add-on
---------------

You can get CoolClock as a [SongBird Add-on][songbird]. (Created by another Simon, not me...)

[songbird]: http://addons.songbirdnest.com/addon/1640

Google Gadget
-------------

There is a [Google Gadget][gadget] created by [Bonstio][] that you can use on your Google
home page. (Bonstio also created some lovely new skins in Google blue which I
have now incorporated here). Note that currently you can't use the gadget on
any page. It can only be used on GooglePages or your iGoogle Personalized Home
Page.

[gadget]: http://www.google.com/ig/directory?url=http://bonstio.googlepages.com/cool_clock_mod.xml&synd=ig
[Bonstio]: http://bonstio.net/index.php?option=content&task=view&id=60

TiddlyWiki Plugin Version
-------------------------

You can get CoolClock as an old and currently unmaintained TiddlyWiki plugin
called [CoolClockPlugin][].

There is also a version of the Plugin with [some documentation in Catalan][paco] created by Paco Rivière.


[CoolClockPlugin]: http://mptw2.tiddlyspot.com/#Clock2
[paco]: http://pacoriviere.googlepages.com/TiddlyWikica.html#Rellotge

Author
------

CoolClock was created by Simon Baird. Send feedback and suggestions to
<simon.baird@gmail.com> or add a comment to the blog post mentioned below.

License
-------

CoolClock is published under a BSD OpenSourceLicense that gives you the freedom
to use it pretty much however you want, including for commercial purposes, as
long as you keep my copyright notice. (You can see the full license text at the
top of coolclock.js).

Changelog
---------

**27-Apr-2010 (version 2.0)**

- No new features but code cleanup and jQuery 'awareness'. Removed
  addLoadEvent stuff since it was flakey, so now it's up to you to add an
  onload if you need it. Added code to github.

**02-Nov-2007 (version 1.0.6)**

- Added some more fantastic skins created by securephp.
- Moved extra skins to moreskins.js.

**26-Oct-2007 (version 1.0.5)**

- Added two new skins created by securephp.
- Updated excanvas to latest version. (It helped a little, the circles are
  much smoother than they were).

**9-Nov-2006 (version 1.0.4)**

- Added three new skins created by Bonstio.

**21-Aug-2006 (version 1.0.3)**

- Added option for specifying timezone as suggested in [blog comments][comments].

[comments]: http://glosoli.blogspot.com/2006/08/coolclock.html#comments

**16-Aug-2006 (version 1.0.2)**

- Added two little workarounds for IE rendering glitches, scale the
  lineWidth and fill in the little gap in full circles.

**16-Aug-2006 (version 1.0.1)**

- Hide the second hand decoration in IE since it doesn't draw it correctly.
- Noticed there is a bug with my use of addLoadEvent that means your clock
  won't work if you have a body onload. Haven't fixed yet but added a
  comment about it.

**6-Aug-2006**

- Added IE support via ExporerCanvas.

**5-Aug-2006 (version 1.0.0)**

- First release. Adapted from my TiddlyWiki plugin.

TODO
----

_(NB: Needs update)_

- There is no way to tell between am and pm
- Be able to specify a solid background
- Be able to add numbers to the clock and images
- The TiddlyWiki plugin is not properly maintained and using old code
- Test with Opera
- Test with newest version of excanvas

Comments
--------

You can leave comments on this [blog post][blog].

[blog]: http://glosoli.blogspot.com/2006/08/coolclock.html

Note On Spelling
----------------

Since I'm an Australian it probably should be an "analogue" clock but
personally I prefer to omit the "ue" in analogue. (And also the extra "me" in
"programme"). But I will stick with other "proper" spellings such as "customise
favourite colour".
