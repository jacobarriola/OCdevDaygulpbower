// Load our plugins
var	gulp			=	require('gulp'),
	sass			=	require('gulp-sass'),  // Our sass compiler
	notify			=	require('gulp-notify'), // Basic gulp notificatin using OS
	minifycss		=	require('gulp-minify-css'), // Minification
	rename			=	require('gulp-rename'), // Allows us to rename our css file prior to minifying 
	autoprefixer	=	require('gulp-autoprefixer'), // Adds vendor prefixes for us
	concat			=	require('gulp-concat'),
	uglify			=	require('gulp-uglify'),
	browserSync		=	require('browser-sync'); // Sends php, js, img and css updates to browser for us



/////////////////////////




// Our browser-sync task.  

gulp.task('browser-sync', function() {
	var files = [
		'**/*.php'
	];

	browserSync.init(files, {
		proxy: 'ocdevday.dev/'
	});
});






// Our 'styles' tasks, which handles our sass actions such as compliling and minification

gulp.task('styles', function() {

	gulp.src('./assets/sass/**/*.scss')
		.pipe(sass({
			outputStyle: 'expanded',
			sourceComments: true
		})
		.on('error', notify.onError(function(error) {
			return "Error: " + error.message;
		}))
		)

		.pipe(autoprefixer({ 
			browsers: ['last 2 versions', 'ie >= 8']
		})) // our autoprefixer - add and remove vendor prefixes using caniuse.com
		
		.pipe(gulp.dest('./assets/dist/css')) // Location of our app.css file
		
		.pipe(browserSync.reload({stream:true})) // CSS injection when app.css file is written
		
		.pipe(rename({suffix: '.min'})) // Create a copy version of our compiled app.css file and name it app.min.css
		
		.pipe(minifycss({
			keepSpecialComments:0
		})) // Minify our newly copied app.min.css file
		
		.pipe(gulp.dest('./assets/dist/css')) // Save app.min.css onto this directory	
		
		.pipe(browserSync.reload({stream:true})) // CSS injection when app.min.css file is written
		
		.pipe(notify({
			message: "Styles task complete!"
		}));
});



// Our JavaScript task, which will concat and minify our js files

gulp.task('js', function() {
  return gulp.src('./assets/js/**/*.js')
	.pipe(concat('app.js'))
	.pipe(gulp.dest('./assets/dist/js'))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify())
	.pipe(gulp.dest('./assets/dist/js'))
	.pipe(notify({
		message: "JS task complete!"
	}));
});

// Our default gulp task.  Fires up all of our tasks upon init (gulp) and watches sass and js directories
gulp.task('default', ['styles', 'js', 'browser-sync'], function() {
	gulp.watch('assets/sass/**/*.scss', ['styles']);
	gulp.watch('assets/js/**/*.js', ['js']);
})
