// Requires
const { series, src, dest, watch } = require('gulp');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const webp = require('gulp-webp');
const concat = require('gulp-concat');

// CSS utilities
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');

// JS utilities
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');

const paths = {
	images: 'src/img/**/*',
	scss: 'src/scss/**/*.scss',
	js: 'src/js/**/*.js',
};

// Function that compiles SASS
function css() {
	return src(paths.scss)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('./build/css'));
}

function mincss() {
	return src('paths.scss')
		.pipe(
			sass({
				outputStyle: 'compressed',
			})
		)
		.pipe(dest('./build/css'));
}

// Function mix JS
function javascript() {
	return src(paths.js)
		.pipe(sourcemaps.init())
		.pipe(concat('bundle.js'))
		.pipe(terser())
		.pipe(sourcemaps.write('.'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(dest('./build/js'));
}

// Function compress WEBP
function images() {
	return src(paths.images)
		.pipe(imagemin())
		.pipe(dest('./build/img'))
		.pipe(notify({ message: 'Minified image' }));
}

function convertWebp() {
	return src(paths.images)
		.pipe(webp())
		.pipe(dest('./build/img'))
		.pipe(notify({ message: 'Version webp Done!' }));
}

// Function for watch changes active
function watchArchives() {
	watch(paths.scss, css);
	watch(paths.js, javascript); // ** = all files,  * =  extension
}

exports.css = css;
exports.mincss = mincss;
exports.images = images;
exports.convertWebp = convertWebp;
exports.watchArchives = watchArchives;

exports.default = series(css, javascript, images, convertWebp, watchArchives);
