
CoolClock - The Javascript Analog Clock
=======================================

About CoolClock
---------------

This is my fork of CoolClock, a customisable javascript analog clock.

New Features
------------

- **(11-Dec-2013)** - Removed all cruft relating to Internet Explorer and
  ExplorerCanvas. The clock works fine in IE 9.0 or later without them.
- **(11-Dec-2013)** - The clock can now synchronize itself with the web
  server's time. (Note that this is experimental. Testers are much
  appreciated.)
- **(11-Dec-2013)** - Clocks can now have a title, for instance "Local Time",
  or "London, UK".
- **(11-Dec-2013)** - Proper skinning for titles and digital clocks.
- **(11-Dec-2013)** - Numerous cosmetic changes.

Requirements
------------

CoolClock requires canvas suport therefore it works best in Firefox, Safari or
Chrome. It also works with Internet Explorer versions 9 and later. CoolClock
does not use Flash.

Using CoolClock
---------------

Download `coolclock.js` and `moreskins.js` and put them in the
same folder as your html file.  In the head section of your html file add the
following:

````Html
<script type="text/javascript" src="coolclock.js"></script>
````

Or, if you want more skins:

````Html
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
<canvas id="clockid" class="CoolClock:swissRail:std:::+2:showDigital:Nicosia:::"></canvas>
````

The colon delimited fields after CoolClock in the class control the appearance
of the clock. The fields are as follows:

<table>
<tr><td>`CoolClock`</td><td>Required</td>

<td>Without that your canvas will be left alone</td></tr>

<tr><td>`Skin`</td><td>Optional. Default is "swissRail"</td>

<td>Specifies which skin to use for rendering the clock face. Four skins are
defined in coolclock.js: swissRail, chunkySwiss, chunkySwissOnBlack and
miliUbuntu. A lot more can be found in moreskins.js.</td></tr>

<tr><td>`textSkin`</td><td>Optional. Default is "std"</td>

<td>Specifies which skin to use for rendering the title and the digital clock.
Three such skins are defined for you: std, stdOnBlack and
miliUbuntu.</td></tr>

<tr><td>`Radius`</td><td>Optional. Default is 85</td>

<td>Specifies the radius in pixels of the clock.</td></tr>

<tr><td>`noSeconds`</td><td>Optional</td>

<td>If you include "noSeconds" here then the clock will have no second hand.
Use if your CPU usage is too high.</td></tr>

<tr><td>`gmtOffset`</td><td>Optional</td>

<td>If you don't specify anything you get local time (or server time, if your
clocks are sync'ed with the web server). If you specify a value here (in hours)
it will be used as an offset from GMT (UTC). Eg, put -5 to indicate 5 hours
behind GMT. You can specify fractions of hours, eg +2.5</td></tr>

<tr><td>`showDigital`</td><td>Optional</td>

<td>If you put "showDigital" here then a digital clock will be rendered on top
of the clock face</td></tr>

<tr><td>`clockTitle`</td><td>Optional</td>

<td>Add some text here and it will be rendered on top of the clock face, as a
title to the clock. Leave it empty if you don't want a title. Due to the nature
of the class property, if you need spaces in titles, you must substitute them
with underscores. For example: "New_York".</td></tr>

<tr><td>`logClock`</td><td>Optional</td>

<td>Put "logClock" here, and you'll get a logarithmic clock.</td></tr>

<tr><td>`logClockRev`</td><td>Optional</td>

<td>Similarly, put "logClockRev" to get a reverse logarithmic clock.</td></tr>

</table>

You should be able to omit fields to indicate you want the default values, eg
`CoolClock::::noSeconds` means default face skin, default text skin and default
size with no second hand.

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

Creating Your Own Skins
-----------------------

You can design your own clocks by adding entries to CoolClock.config.skins and
CoolClock.config.textSkins. The skin objects' properties are self-explanatory,
so just copy an existing skin and hack away.

Synchronize with Server time
----------------------------

To have your clocks synchronized with the web server's time, set
CoolClock.config.useServerTime to true. This will cause all clocks in your page
to use the server's clock (and not the user's computer clock) as their
reference time.

(Note that this will only change the reference time. You can still use gmtOffset
to have your clocks display different times to that of the server. Also, you
need jQuery for this to work; this is because the code uses Ajax to retrieve
the server time, and we need a framework to provide an Ajax implementation that
is compatible with all browsers.)

Authors
-------

CoolClock was originally created by Simon Baird <simon.baird@gmail.com>.

As for this fork's maintainer: I'm Pantelis Panayiotou <p.panayiotou@gmail.com>
and I need to have this code functioning properly. So, please feel free to send
me bug reports and suggestions.

License
-------

CoolClock is published under a BSD OpenSourceLicense that gives you the freedom
to use it pretty much however you want, including for commercial purposes, as
long as you keep my copyright notice. (You can see the full license text at the
top of coolclock.js).

Changelog
---------

**11-Dec-2013**

- Initial fork (ver. 0.1)
