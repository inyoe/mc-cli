const gulp = require('gulp'),
      through = require('through2'),
      replace = require('gulp-replace'),
      htmlmin = require('gulp-htmlmin'),
      fileInclude = require('gulp-file-include'),
      revCollector = require('gulp-rev-collector'),
      config = require('../config');


const { path: { SOURCE_HTML, SOURCE_PUBLIC, SOURCE_VIEW, DIST_HTML, revPath },
        replace: { html: REPLACE_HTML },
        html: HTML_MIN,
        public: { KEYWORDS, DESCRIPTION } } = config;

const REPLACE_TOTAL = global.env && config.replace.hasOwnProperty(`html_${global.env}`) ?
                        REPLACE_HTML.concat(config.replace[`html_${global.env}`]) :
                        REPLACE_HTML;


const fnHtmlInclude = function(file) {
    const target = typeof file === 'string' ?
                    file :
                    SOURCE_HTML + '**/*.html';

    return gulp.src(target, { base: SOURCE_HTML })
        .pipe(fileInclude({
            prefix: '@@',
            basepath: SOURCE_PUBLIC,
            context: {
                keywords: KEYWORDS,
                description: DESCRIPTION,
                aCss: [],
                aScript: [],
                module: ''
            }
        }))
        .pipe(gulp.dest(SOURCE_VIEW))
        .pipe((() => {
            return through.obj(function(file, enc, done) {
                global.commandName === 'dev' && fnHtmlFormatModule(file.path);
                this.push(file);
                return done();
            });
        })());
}




gulp.task('htmlInclude', fnHtmlInclude);




gulp.task('htmlRev', function() {
    let stream = gulp.src([revPath + '*.json', SOURCE_VIEW + '**/*.html', ]);
    
    REPLACE_TOTAL.forEach((item, index) => {
        stream = stream.pipe(replace(item[0], item[1]));
    })

    return stream.pipe(revCollector())
                 .pipe(htmlmin(HTML_MIN))
                 .pipe(gulp.dest(DIST_HTML));
})




const fnHtmlFormatModule = function(file) {
    const URL = global.commandName === 'dev' ? SOURCE_VIEW : DIST_HTML;
    const target = typeof file === 'string' ? file : URL + '**/*.html';

    return gulp.src(target, { base: URL })
        .pipe(replace(/(data\-module\=\S*)\.js/g, '$1'))
        .pipe(gulp.dest(URL));
}




gulp.task('htmlFormatModule', fnHtmlFormatModule);




global.fnHtmlInclude = fnHtmlInclude;