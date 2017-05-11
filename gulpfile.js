var
	gulp       = require('gulp'),
	pug        = require('gulp-pug'),
	less       = require('gulp-less'),
	watch      = require('gulp-watch'),
	uglify     = require('gulp-uglifyjs'),
	cleanCSS   = require('gulp-clean-css'),
	inlineCSS  = require('gulp-inline-css'),
	livereload = require('gulp-livereload'),
	gulpsync   = require('gulp-sync')(gulp),

	path = require('path'),
	pkg  = require('./package.json'),

	src = {
		less   : './source/less/*.less',
		pug    : './source/pug/*.pug',
		inline : './temp/html/*.html'
	}
	,temp = {
		less   : './temp/css/',
		pug    : './temp/html/'
	}
	,build = {
		inline : './'
	};

function swallowError (error) {
	console.log(error.toString());
	this.emit('end');
};

gulp.task('less', function() {
	return gulp.src(src.less)
		.pipe(less())
		.on('error', swallowError)
		.pipe(gulp.dest(temp.less))
		.pipe(livereload());
});

gulp.task('pug', function buildHTML() {
	return gulp.src(src.pug)
		.pipe(pug({
			pretty: true
		}))
		.on('error', swallowError)
		.pipe(gulp.dest(temp.pug))
		.pipe(livereload());
});

gulp.task('inline', function() {
	return gulp.src(src.inline)
		.pipe(inlineCSS({
			applyStyleTags: true,
			applyLinkTags: true,
			removeStyleTags: true,
			removeLinkTags: false,
			preserveMediaQueries: true
		}))
		.pipe(gulp.dest(build.inline))
		.pipe(livereload());
});

gulp.task('default', gulpsync.sync(['less','pug','inline']));

gulp.task('watch', function () {
	gulp.watch('source/less/**/*.less', gulpsync.sync(['less','pug','inline']));
	gulp.watch('source/pug/**/*.pug', gulpsync.sync(['less','pug','inline']));
	gulp.start('default');
});




