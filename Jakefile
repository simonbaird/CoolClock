//
// Jakefile
//
// Mainly for building minified coolclock.js.
// Also adds a version number and license info
// to minified and non-minified source files for
// distribution.
//
// Requirements:
//   sudo npm install -g jake
//   sudo npm install -g uglify-js
//
// Usage:
//   jake # default task is buildAll
//   jake -T # see other tasks
//

var fs = require('fs');

// (Is this kind of thing okay?)
String.prototype.chomp               = function() { return this.replace(/\n$/, '');    }
String.prototype.escapeDoubleQuotes  = function() { return this.replace(/"/g, '\\"');  }
String.prototype.stripTrailingSpaces = function() { return this.replace(/\s+$/mg, ''); }

var projName       = 'CoolClock'
var sourceUrl      = 'https://github.com/simonbaird/CoolClock';
var homeUrl        = 'http://randomibis.com/coolclock/';
var licenseUrl     = 'https://github.com/simonbaird/CoolClock/blob/master/LICENSE'

var licenseText    = fs.readFileSync('LICENSE', 'utf-8').chomp();
var version        = fs.readFileSync('VERSION', 'utf-8').chomp();
var versionFile    = version.replace(/\.|\-/g,'_')

var mainSource     = 'coolclock.js';
var outputDir      = 'build';
var miniTargetVer  = outputDir+'/coolclock.'+versionFile+'.minified.js';
var plainTargetVer = outputDir+'/coolclock.'+versionFile+'.js';
var miniTarget     = outputDir+'/coolclock.minified.js';
var plainTarget    = outputDir+'/coolclock.js';

var uglifyCommand = 'uglifyjs '+mainSource+' --compress';

var longComment = [
  '/*',
  ' * '+projName+' '+version,
  ' * '+homeUrl,
  ' * '+sourceUrl,
  ' *',
  licenseText.replace(/^/mg,' * ').stripTrailingSpaces().escapeDoubleQuotes(),
  ' */'
].join("\n");

var shortComment = [
  '/*',
  projName,
  version,
  licenseUrl,
  '*/'
].join(' ');

//-----------------------------------------------------------------------
task('default', ['buildAll']);

desc('Build all targets');
task('buildAll', [plainTargetVer, miniTargetVer, plainTarget, miniTarget]);

directory(outputDir);

file(miniTargetVer, [outputDir, mainSource, 'Jakefile'], function(){
  jake.exec('(echo "'+shortComment+'"; '+uglifyCommand+') > '+miniTargetVer, function(){
    console.log(miniTargetVer);
    complete();
  });
}, true);

file(plainTargetVer, [outputDir, mainSource, 'Jakefile'], function(){
  jake.exec('(echo "'+longComment+'"; cat '+mainSource+';) > '+plainTargetVer, function(){
    console.log(plainTargetVer);
    complete();
  });
}, true);

// Just copying these seems a but strange, but what else..?
file(miniTarget, [miniTargetVer], function() {
  jake.cpR(miniTargetVer, miniTarget);
});

file(plainTarget, [plainTargetVer], function() {
  jake.cpR(plainTargetVer, plainTarget)
});

desc('Remove generated files');
task('clean', [], function(){
  jake.rmRf(outputDir);
}, true);
