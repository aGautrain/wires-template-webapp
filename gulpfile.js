var gulp = require('gulp');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
var webserver = require('gulp-webserver');
var pump = require('pump');

gulp.task('compress', function (cb) {
  pump([
        gulp.src('src/assets/js/*.js'),
		uglify(),
        gzip({append: true}),
        gulp.dest('dist/assets/js')
    ],
	cb
  );
});

gulp.task('webserver', function(cb) {
	  pump([
			gulp.src('src/app'),
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