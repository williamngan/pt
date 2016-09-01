var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var coffee = require('gulp-coffee');
var insert = require('gulp-insert');
var es = require('event-stream');
var babel = require('gulp-babel');
var runSequence = require('run-sequence');

// Define Paths
var path = {
  src: {
    core: "./src/coffee/core/",
    extend: "./src/coffee/extend/"
  },
  dist: {
    core: "./dist/core/",
    extend: "./dist/extend/",
    path: "./dist/"
  },
  demoEs6: {
    src: "./demo/es6/src/",
    dist: "./demo/es6/dist/"
  }
};



// To rebuild all in sequence:
// 1) "build",
// 2) "namespace" to add namespace versions,
// 3) "module" to add npm module.exports versions,
// 4) "min" to create minified version



// Define class sequence manually. To be modularize later.
// Parent classes needs to be defined before its extended children
var coreElems = [
  "Const", "Matrix", "Util", "Timer",
  "Space", "CanvasSpace", "DOMSpace",
  "SVGForm", "SVGSpace",
  "Form",
  "Point", "Vector", "Color",
  "Circle", "Particle", "ParticleSystem",
  "Pair", "Line", "Rectangle", "Grid",
  "PointSet", "Curve", "Triangle"
];
var coreFiles = coreElems.map(function(n) { return path.src.core+n+".coffee"; } );

var extendElems = [
  "Easing", "GridCascade", "ParticleEmitter", "ParticleField", "QuadTree",
  "SamplePoints", "StripeBound", "UI", "Noise", "Delaunay", "Shaping"
];
var extendFiles = extendElems.map(function(n) { return path.src.extend+n+".coffee"; } );

var licenseText = "\n/* Licensed under the Apache License, Version 2.0. (http://www.apache.org/licenses/LICENSE-2.0). Copyright 2015-2016 William Ngan. (https://github.com/williamngan/pt/) */\n\n";
var licenseTextCoffee = "\n### Licensed under the Apache License, Version 2.0. (http://www.apache.org/licenses/LICENSE-2.0). Copyright 2015-2016 William Ngan. (https://github.com/williamngan/pt/) ###\n\n";

function handleError( error ) {
  gutil.log( error.stack );
  this.emit( 'end' );
}

gulp.task('default', ["watch"]);


// Watch
// This just rebuild the pt-core.js and pt-extend.js files without doing the full re-build.
gulp.task('watch', function() {
  gulp.watch( path.src.core+"*.coffee", ['core']);
  gulp.watch( path.src.extend+"*.coffee", ['extend']);
  gulp.watch( path.demoEs6.src+"*.js", ['es6-demo']);
});


gulp.task('build', ["pt", "core", "core-files"]);

gulp.task('namespace', function() {
  var before = "window.Pt = {};(function() {";
  var after = "\n}).call(Pt);";

  var pt = gulp.src( path.dist.path+'pt.js' )
    .pipe( rename('pt-ns.js') )
    .pipe( insert.prepend(before) ).pipe( insert.append(after) )
    .pipe( gulp.dest( path.dist.path ) );

  var core = gulp.src( path.dist.core+'pt-core.js' )
    .pipe( rename('pt-core-ns.js') )
    .pipe( insert.prepend(before) ).pipe( insert.append(after) )
    .pipe( gulp.dest( path.dist.core ) );

  /*
  var extend = gulp.src( path.dist.extend+'pt-extend.js' )
    .pipe( rename('pt-extend-ns.js') )
    .pipe( insert.prepend(before) ).pipe( insert.append(after) )
    .pipe( gulp.dest( path.dist.extend ) );
  */

  return es.concat(pt, core);

});


gulp.task('module', function() {
  var before = "var Pt = {}; (function() {";
  var after = "\n}).call(Pt); module.exports = Pt;";

  return gulp.src( path.dist.path+'pt.js' )
    .pipe( insert.prepend(before) ).pipe( insert.append(after) )
    .pipe( gulp.dest( path.dist.path+"/module/" ) );

});

gulp.task('min', ["core-min", "core-ns-min", "pt-min", "pt-ns-min"]);

gulp.task('rebuildAll', function(callback) {
  runSequence(
    ["pt", "core", "core-files"],
    'namespace',
    'module',
    ["core-min", "core-ns-min", "pt-min", "pt-ns-min"],
    callback);
});

// Pt

gulp.task('pt', function() {

  return gulp.src( coreFiles.concat( extendFiles ) )
    .pipe( concat('pt.coffee') )
    .pipe( insert.prepend(licenseTextCoffee) )
    .pipe( sourcemaps.init() )
    .pipe( coffee({bare:true}).on('error', handleError) )
    .pipe( sourcemaps.write(".") )
    .pipe( gulp.dest( path.dist.path ) )
});

gulp.task('pt-min', function() {
  return gulp.src( path.dist.path+'pt.js' )
    .pipe( rename('pt.min.js') )
    .pipe( uglify() )
    .pipe( insert.prepend(licenseText) )
    .pipe( gulp.dest( path.dist.path ) )

});

gulp.task('pt-ns-min', function() {
  return gulp.src( path.dist.path+'pt-ns.js' )
    .pipe( rename('pt-ns.min.js') )
    .pipe( uglify() )
    .pipe( insert.prepend(licenseText) )
    .pipe( gulp.dest( path.dist.path ) )

});

gulp.task('demos', function() {
  return gulp.src( "./demo/*.js" )
    .pipe( insert.prepend("(function() {") ).pipe( insert.append("})();") )
    .pipe( uglify() )
    .pipe( gulp.dest( "./docs/demo/" ) );
});

// Core

gulp.task('core', function() {
  return gulp.src( coreFiles )
    .pipe( concat('pt-core.coffee') )
    .pipe( insert.prepend(licenseTextCoffee) )
    .pipe( sourcemaps.init() )
    .pipe( coffee({bare:true}).on('error', handleError))
    .pipe( sourcemaps.write(".") )
    .pipe( gulp.dest( path.dist.core ) )
});

gulp.task('core-min', function() {
  return gulp.src( path.dist.core+'pt-core.js' )
    .pipe( rename('pt-core.min.js') )
    .pipe( uglify() )
    .pipe( insert.prepend(licenseText) )
    .pipe( gulp.dest( path.dist.core ) )
});

gulp.task('core-ns-min', function() {
  return gulp.src( path.dist.core+'pt-core-ns.js' )
    .pipe( rename('pt-core-ns.min.js') )
    .pipe( uglify() )
    .pipe( insert.prepend(licenseText) )
    .pipe( gulp.dest( path.dist.core ) )
});


gulp.task('core-files', function() {
  gulp.src( path.src.core+'*.coffee' )
    .pipe(sourcemaps.init())
    .pipe( coffee({bare:true}).on('error', handleError))
    .pipe(sourcemaps.write(".map"))
    .pipe( gulp.dest( path.dist.core+"/elements/" ) )
});



// Extend

gulp.task('extend', function() {
  return gulp.src( extendFiles )
    .pipe( concat('pt-extend.coffee') )
    .pipe( insert.prepend(licenseTextCoffee) )
    .pipe( sourcemaps.init() )
    .pipe( coffee({bare:true}).on('error', handleError))
    .pipe( sourcemaps.write(".") )
    .pipe( gulp.dest( path.dist.extend ) )
});


gulp.task('extend-min', function() {
  return gulp.src( path.dist.extend+'pt-extend.js' )
    .pipe( rename('pt-extend.min.js') )
    .pipe( uglify() )
    .pipe( insert.prepend(licenseText) )
    .pipe( gulp.dest( path.dist.extend ) )
});

gulp.task('extend-ns-min', function() {
  return gulp.src( path.dist.extend+'pt-extend-ns.js' )
    .pipe( rename('pt-extend-ns.min.js') )
    .pipe( uglify() )
    .pipe( insert.prepend(licenseText) )
    .pipe( gulp.dest( path.dist.extend ) )
});

gulp.task('extend-files', function() {
  gulp.src( path.src.extend+'*.coffee')
    .pipe(sourcemaps.init())
    .pipe( coffee({bare:true}).on('error', handleError))
    .pipe(sourcemaps.write("./map"))
    .pipe( gulp.dest( path.dist.extend+"/elements/" ) )
});


// ES6 Babel
gulp.task('es6-demo', function () {
    return gulp.src( path.demoEs6.src+"/*.js" )
        .pipe(babel()).on('error', handleError)
        .pipe(gulp.dest( path.demoEs6.dist ));
});
