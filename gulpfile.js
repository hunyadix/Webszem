///////////////
// Required  //
///////////////

var gulp           = require("gulp")
var sourcemaps     = require("gulp-sourcemaps")
var uglify         = require("gulp-uglify")
var browser_sync   = require("browser-sync")
var reload 		   = browser_sync.reload
var rename         = require("gulp-rename")
var sass           = require("gulp-ruby-sass")
var plumber        = require("gulp-plumber")
var autoprefixer   = require("gulp-autoprefixer")
var jshint         = require("gulp-jshint")
var jshint_stylish = require("jshint-stylish")
var gulp_notify    = require("gulp-notify")
// var babel          = require("gulp-babel")
var browserify     = require("browserify")
var watchify       = require("watchify")
// var babelify       = require("babelify")
var source         = require("vinyl-source-stream")
var buffer         = require("vinyl-buffer")

////////////////
// Browserify //
////////////////

// var bundler = watchify(browserify("JavaScripts/main.js", {debug: true})
//	.transform(babelify, {presets: ["es2015"]}))

var bundler = watchify(browserify("JavaScript/main.js", {debug: true}))

var rebundle = function()
{
	bundler.bundle()
	.on("error", function(err) 
	{
		console.error(err)
		this.emit("end") 
	})
	.pipe(source("main-bundled.js"))
	.pipe(buffer())
	.pipe(plumber())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sourcemaps.write("./"))
	.pipe(gulp.dest("JavaScripts/"))
	.pipe(reload({stream: true}))
}

//////////////////
// Scripts Task //
//////////////////

gulp.task("scripts", function()
{

	//////////////////
	// Jshint Check //
	//////////////////

	var javascript_sources = 
	[
		"JavaScript/**/*.js", 
		"!JavaScript/**/*-bundled.js",
		"!JavaScript/**/*.min.js"
	]

	/*gulp.src(javascript_sources)
	.pipe(plumber())
	.pipe(jshint(
	{
		laxbreak: true,
		laxcomma: true,
		esnext: true
		//jquery: true
	}))
	.pipe(jshint.reporter("jshint-stylish"))
	.pipe(jshint.reporter("fail"))*/

	///////////
	// Babel //
	///////////

	/*gulp.src(javascript_sources)
	.pipe(rename("main_babelized.js"))
	.pipe(plumber())
	.pipe(babel({presets: ['es2015']}))
	.pipe(gulp.dest("JavaScripts/"))*/

	////////////////
	// Browserify //
	////////////////

	rebundle()
})

/////////////////
// Styles Task //
/////////////////

gulp.task("styles", function()
{
	return sass("SASS/**/style.sass", {style: "compressed"})
	.on('error', sass.logError)
	.pipe(plumber())
	.pipe(autoprefixer(
	{
		browsers: ["last 2 versions"],
		cascade: false
	}))
	.pipe(gulp.dest("CSS/"))
	.pipe(reload({stream: true}))
})

///////////////
// HTML Task //
///////////////

gulp.task("html", function()
{
	gulp.src("index.html")
	.pipe(reload({stream: true}))
})

////////////////
// Watch Task //
////////////////

gulp.task("watch", function()
{
	bundler.on("update", function()
	{
		console.log("-> bundling...")
		rebundle()
	})
	rebundle()
	// gulp.watch("JavaScripts/**/*.js", ["scripts"])
	gulp.watch("SASS/**/*.sass", ["styles"])
	gulp.watch("index.html", ["html"])
})

///////////////////////
// Browser Sync Taks //
///////////////////////

gulp.task("browser-sync", function()
{
	browser_sync.init(
	{
		browser: "/opt/firefox_dev/firefox", 
		server:
		{
			basedir: "."
		}
	})
})

//////////////////
// Default Task //
//////////////////

gulp.task("default", ["styles", "html", "browser-sync", "watch"])