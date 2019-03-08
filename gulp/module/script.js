const fs = require('fs'),
      gulp = require('gulp'),
      rev = require('gulp-rev'),
      uglify = require('gulp-uglify'),
      replace = require('gulp-replace'),
      revCollector = require('gulp-rev-collector'),
      config = require('../config');


const { path: { SOURCE_JS, DIST_JS, revPath },
        server: { PROXY: { KEY, REMOVE_KEY } },
        replace: { js: REPLACE_JS },
        exclude: { js: EXCLUDE_JS } } = config;

const REPLACE_TOTAL = global.env && config.replace.hasOwnProperty(`js_${global.env}`) ?
                        REPLACE_JS.concat(config.replace[`js_${global.env}`]) :
                        REPLACE_JS;



gulp.task('jsUglify', function() {
    const source = [SOURCE_JS + '**/*.js'],
          pathDir = fs.readdirSync(SOURCE_JS),
          folders = [];

    EXCLUDE_JS.forEach((item) => {
        source.push('!' + SOURCE_JS + item);
    })

    pathDir.forEach((item, index) => {
        const fileState = fs.statSync(`${SOURCE_JS}/${item}`);
        fileState.isDirectory() && folders.push(item);
    })

    let stream = gulp.src(source);

    if (REMOVE_KEY && KEY) {
        REPLACE_TOTAL.push([KEY, '']);
    }
    REPLACE_TOTAL.forEach((item, index) => {
        stream = stream.pipe(replace(item[0], item[1]));
    })

    stream = stream.pipe(uglify())
            .pipe(rev())
            .pipe(gulp.dest(DIST_JS))
            .pipe(rev.manifest('rev-js.json'));

    folders.forEach((item, index) => {
        const rule = new RegExp(item === 'module' ? `"${item}\/(\\S+\\.js)"` : `"(${item}\/\\S+)\\.js"`, 'g');
        stream = stream.pipe(replace(rule, '"$1"'));
    })

    return stream.pipe(gulp.dest(revPath));
})




gulp.task('copyExcludeJs', function() {
    const source = EXCLUDE_JS.map((item) => {
        return SOURCE_JS + item;
    })

    return new Promise((resolve, reject) => {
        if (source.length) {
            return gulp.src(source, { base: SOURCE_JS })
                    .pipe(gulp.dest(DIST_JS))
                    .on('end', resolve);
        } else {
            return resolve();
        }
    })
})




gulp.task('jsRev', function() {
    return gulp.src([revPath + '*.json', DIST_JS + '**/*.js'])
            .pipe(revCollector())
            .pipe(gulp.dest(DIST_JS));
})