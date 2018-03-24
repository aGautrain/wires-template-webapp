var gulp = require('gulp-help')(require('gulp'));
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
var webserver = require('gulp-webserver');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var pump = require('pump');
var del = require('del');
var ftp = require('vinyl-ftp');
var runSequence = require('run-sequence');

var config = require('./config');
var logger = require('./logger');

gulp.task('lint', 'Analyze JS code with JSHint', function (cb) {
  pump([
        gulp.src('src/assets/js/*.js'),
		jshint(),
		jshint.reporter('default')
    ],
	cb
  );
});

gulp.task('js', 'Uglify scripts into dist/assets/js/', ['lint'], function (cb) {
  pump([
		// Processing homemade scripts
        gulp.src('src/assets/js/*.js'),
		uglify(),
        gulp.dest('dist/assets/js'),
		
		// Processing lib scripts
		gulp.src('src/assets/js/lib/*.js'),
		uglify(),
        gulp.dest('dist/assets/js')
    ],
	cb
  );
});


gulp.task('imgs', 'Minify images into dist/assets/imgs/', function (cb) {
  pump([
        gulp.src('src/assets/imgs/*'),
		imagemin(),
        gulp.dest('dist/assets/imgs')
    ],
	cb
  );
});


gulp.task('app', 'Copy app folder from src/ to dist/', function (cb) {
  pump([
        gulp.src('src/app/*'),
        gulp.dest('dist/app')
    ],
	cb
  );
});


gulp.task('clean', 'Remove content of dist/', function() {
	del(['dist']);
});

gulp.task('webserver', 'Launch webserver including livereload', ['default'], function(cb) {
	pump([
			gulp.src('dist/app'),
			webserver({
				livereload: true,
				directoryListing: true,
				fallback: 'lost.html',
				open: true
			})
	  ],
	  cb
  );
});

gulp.task('deploy', 'Deploy code onto FTP hosting provider given config.js', ['default'], function(cb) {
	const connection = ftp.create(config.ftpAuthentication); // loading conf file
	const globs = ["dist/app/**", "dist/assets/**"]; // folders to deploy
	
	logger.showAuthentications(config.ftpAuthentication);
	
	pump([
		gulp.src(globs, {base:'.', buffer:false}),
		connection.newer('/www/public_gulp'),
		connection.dest('/www/public_gulp')
	],
	cb);
	//console.log(config.ftpAuthentication);
});


// gulp.task('default', 'Populate dist/ -- see js, imgs, app', ['clean', 'lint', 'js', 'app']);

gulp.task('default', function(done) {
    runSequence('clean', 'js', 'app', function() {
        done();
    });
});
