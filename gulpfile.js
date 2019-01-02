const env = process.argv.indexOf('dev') >= 0 ? 'dev' : 'build';

const gulp            = require('gulp'),
	  del             = require('del'),
      fs              = require('fs'),
      through         = require('through2'),
      uglify          = require('gulp-uglify'),
	  sass            = require('gulp-sass'),
      autoprefixer    = require('gulp-autoprefixer'),
      csso            = require('gulp-csso'),
      sourcemaps      = require('gulp-sourcemaps'),
      replace         = require('gulp-replace'),
      rev             = require('gulp-rev'),
      revCollector    = require('gulp-rev-collector'),
      tinypng         = require('gulp-tinypng-compress'),
      fileInclude     = require('gulp-file-include'),
      spritesmith     = require('gulp.spritesmith'),
      merge           = require('merge-stream'),
      htmlmin         = require('gulp-htmlmin'),
      browserSync     = require('browser-sync').create(),
      Mock            = require('mockjs'),
      proxyMiddleware = require('http-proxy-middleware');

const config = require('./gulpconfig');

const MOCK_MODULES = './mock/module/*.js';
let   mockList = require('./mock')();


const { DIST, SOURCE, STATIC, CSS, SCSS, JS, IMG, HTML, PUBLIC, VIEW, SPRITE } = config.path;
const { KEYWORDS: SEO_KEYWORDS, DESCRIPTION: SEO_DESCRIPTION } = config.public;
const DIST_CSS      = DIST + STATIC + CSS,
      DIST_JS       = DIST + STATIC + JS,
      DIST_IMG      = DIST + STATIC + IMG,
      DIST_HTML     = DIST,
      DIST_OTHER    = DIST + STATIC + 'other/',
      SOURCE_CSS    = SOURCE + STATIC + CSS,
      SOURCE_SCSS   = SOURCE + STATIC + SCSS,
      SOURCE_JS     = SOURCE + STATIC + JS,
      SOURCE_IMG    = SOURCE + STATIC + IMG,
      SOURCE_HTML   = SOURCE + HTML,
      SOURCE_VIEW   = SOURCE + VIEW,
      SOURCE_PUBLIC = SOURCE + PUBLIC,
      sSprite       = SOURCE + STATIC + SPRITE,
      tinyPath      = SOURCE + STATIC + 'tinypngBak/',
      revPath       = './rev/';

const { js: EXCLUDE_JS, css: EXCLUDE_CSS, img: EXCLUDE_IMG } = config.exclude;

const OTHER_FILES = config.others.map((item) => {
            return SOURCE + item;
        });




gulp.task('jsUglify', () => {
    const source = [SOURCE_JS + '**/*.js'],
          replaceList = config.replace.js,
          { key, removeKey } = config.proxy,
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

    if (removeKey && key) {
        replaceList.push([key, '']);
    }
    replaceList.forEach((item, index) => {
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


gulp.task('jsRev', () => {
    return gulp.src([revPath + '*.json', DIST_JS + '**/*.js'])
            .pipe(revCollector())
            .pipe(gulp.dest(DIST_JS));
})

gulp.task('copyExcludeJs', () => {
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


gulp.task('copyOther', () => {
    return gulp.src(OTHER_FILES, { base: SOURCE})
            .pipe(gulp.dest(DIST));
})


const fnScss = (file) => {
    const target = (typeof file === 'string' && file.indexOf('module_') < 0) ? file : SOURCE_SCSS + '**/*.scss';

    return new Promise((resolve, reject) => {
        return setTimeout(() => {
            return gulp.src(target, { base: SOURCE_SCSS })
                    .pipe(sourcemaps.init())
                    .pipe(sass().on('error', (e) => {
                        console.log('====Sass Error====');
                        return reject(e) && this.end();
                    }))
                    .pipe(autoprefixer('last 2 version'))
                    .pipe(sourcemaps.write())
                    .pipe(gulp.dest(SOURCE_CSS))
                    .on('end', resolve)
                    .pipe(browserSync.stream());
        }, 500);
    }).catch((e) => {
        return console.error(e.messageFormatted);
    });
}

gulp.task('scss', fnScss)


gulp.task('cssMinify', () => {
    return gulp.src([SOURCE_CSS + '**/*.css', '!' + SOURCE_CSS + '**/module_*.css'])
    		.pipe(csso())
    		.pipe(rev())
    		.pipe(gulp.dest(DIST_CSS))
    		.pipe(rev.manifest('rev-css.json'))
    		.pipe(gulp.dest(revPath));
})


gulp.task('tinypng', () => {
    const source = [SOURCE_IMG + '**/*.png'];

    EXCLUDE_IMG.forEach((item) => {
        source.push('!' + SOURCE_IMG + item);
    })

    return gulp.src(source)
        .pipe(tinypng({
            key: config.tinypngKey,
            sigFile: tinyPath + '.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest(tinyPath));
});


gulp.task('imgRev', () => {
    const source = [SOURCE_IMG + '**/*.*'];

    if (config.tinypngKey) {
        source.push('!' + SOURCE_IMG + '**/*.png', tinyPath + '**/*.png');
    }

    EXCLUDE_IMG.forEach((item) => {
        source.push('!' + SOURCE_IMG + item);
        source.push('!' + tinyPath + item);
    })

	return gulp.src(source)
            .pipe(rev())
			.pipe(gulp.dest(DIST_IMG))
			.pipe(rev.manifest('rev-img.json'))
			.pipe(gulp.dest(revPath));
})

gulp.task('copyExcludeImg', () => {
    const source = EXCLUDE_IMG.map((item) => {
        return SOURCE_IMG + item;
    })

    return new Promise((resolve, reject) => {
        if (source.length) {
            return gulp.src(source, { base: SOURCE_IMG })
                    .pipe(gulp.dest(DIST_IMG))
                    .on('end', resolve);
        } else {
            return resolve();
        }
    })
})



gulp.task('cssRev', () => {
    return gulp.src([revPath + '*.json', DIST_CSS + '**/*.css'])
            .pipe(revCollector())
            .pipe(gulp.dest(DIST_CSS));
})


const fnHtmlInclude = (file) => {
    const target = typeof file === 'string' ? file : SOURCE_HTML + '**/*.html';

    return gulp.src(target, { base: SOURCE_HTML })
        .pipe(fileInclude({
            prefix: '@@',
            basepath: SOURCE_PUBLIC,
            context: {
                keywords: SEO_KEYWORDS,
                description: SEO_DESCRIPTION,
                aCss: [],
                aScript: [],
                module: ''
            }
        }))
        .pipe(gulp.dest(SOURCE_VIEW))
        .pipe((() => {
            return through.obj(function(file, enc, cb) {
                env === 'dev' && fnHtmlFormatModule(file.path);
                this.push(file);
                return cb();
            });
        })());
}
gulp.task('htmlInclude', fnHtmlInclude);


gulp.task('htmlRev', () => {
    const replaceList = config.replace.html;

    let stream = gulp.src([revPath + '*.json', SOURCE_VIEW + '**/*.html', ]);
    
    replaceList.forEach((item, index) => {
        stream = stream.pipe(replace(item[0], item[1]));
    })

    return stream.pipe(revCollector())
                 .pipe(htmlmin(config.htmlminOptions))
                 .pipe(gulp.dest(DIST_HTML));
})


const fnHtmlFormatModule = (file) => {
    const URL = env === 'dev' ? SOURCE_VIEW : DIST_HTML;
    const target = typeof file === 'string' ? file : URL + '**/*.html';

    return gulp.src(target, { base: URL })
        .pipe(replace(/(data\-module\=\S*)\.js/g, '$1'))
        .pipe(gulp.dest(URL));
}
gulp.task('htmlFormatModule', fnHtmlFormatModule)



gulp.task('clearDist', () => {
    return del([DIST + '**/**', revPath + '**/**', SOURCE_VIEW + '**/**', SOURCE_CSS + '**/**']);
})


gulp.task('sprite', () => {
    const spriteData = gulp.src([sSprite + 'i-*.png'])
        .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'module_sprite.scss',
        cssTemplate:(data)=> {
            const { ratio, unit } = config.sprite;

            let arr = [`.icon{display:inline-block; background-image:url(../img/sprite.png); background-size:${(data.spritesheet.width / ratio) + unit}; background-repeat:no-repeat; vertical-align:middle; -webkit-transition:none; -moz-transition:none; transition:none;}\n\n`];

            data.sprites.forEach((sprite) => {
                arr.push(
                    `.${sprite.name.replace('-hover', ':hover')}{width:${(sprite.width / ratio) + unit}; height:${(sprite.height / ratio) + unit}; background-position:${(sprite.offset_x / ratio) + unit} ${(sprite.offset_y / ratio) + unit};}\n`
                )
            });
            return arr.join('');
        }
    }));

    const imgStream = spriteData.img
        .pipe(gulp.dest(SOURCE_IMG));

    const cssStream = spriteData.css
        .pipe(gulp.dest(SOURCE_SCSS));

    return merge(imgStream, cssStream);
});


gulp.task('browserSync', () => {
    const { key, removeKey, target } = config.proxy,
          { router } = config,
          totalRouter = {},
          _STATIC = STATIC.charAt(STATIC.length - 1) === '/' ? STATIC.substring(0, STATIC.length - 1) : STATIC;

    const logDataList = (data, title, showValue=false) => {
        if (data) {
            console.log(`[\u001b[32m${title}\u001b[0m]:\n --------------------------------------`);
            for (let key in data) {
                console.log('    ' + key + (showValue ? ' \u001b[36m-->\u001b[0m ' + data[key] : ''));
            }
            console.log(' --------------------------------------\n');
        }
    }

    let middlewareProxy;

    if (key) {
        if (target) {
            middlewareProxy = proxyMiddleware(key, {
                                    target,
                                    changeOrigin: true,
                                    pathRewrite: function(path, req) {
                                        return removeKey ? path.replace(key, '') : path;
                                    }
                                });
        } else {
            middlewareProxy = {
                route: key,
                handle: (req, res, next) => {
                    if (mockList && mockList.hasOwnProperty(req.url)) {
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify(Mock.mock(mockList[req.url])));
                    }
                    next()
                }
            }
        }
    }

    if (router.length) {
        for (let item of router) {
            totalRouter[item.path] = SOURCE_VIEW + item.total;
        }
    }
    totalRouter['/' + _STATIC] = SOURCE + _STATIC;

    logDataList(totalRouter, 'Route', true);
    logDataList(mockList, 'Mock');

    browserSync.init({
        open: 'external',
        port: config.port,
        server: {
            baseDir: SOURCE_VIEW,
            middleware: middlewareProxy ? [middlewareProxy] : null,
            routes: totalRouter
        },
        startPath: config.startPath
    });

    gulp.watch(SOURCE_JS + '**/*.js').on('change', browserSync.reload);
    gulp.watch(SOURCE_IMG + '**/*.*', browserSync.reload);
    gulp.watch(sSprite + '*.png').on('change', () => {
        setTimeout(() => {
            fnSprite();
            browserSync.reload();
        }, 500);
    });
    gulp.watch(SOURCE_SCSS + '**/*.scss').on('change', file => fnScss(file));
    gulp.watch(SOURCE_HTML + '**/*.html').on('change', file => {
        fnHtmlInclude(file);
        setTimeout(browserSync.reload, 100);
    });
    gulp.watch(SOURCE_PUBLIC + '*.html').on('change', gulp.series('htmlInclude', browserSync.reload));
    gulp.watch(MOCK_MODULES).on('change', () => {
        mockList = require('./mock')();
        setTimeout(() => {
            logDataList(mockList, 'Mock');
            browserSync.reload();
        }, 100);
    })
})




gulp.task('dev', gulp.series('scss', 'htmlInclude', 'browserSync'));



const buildTaskList = [
    'clearDist',
    'sprite',
    'tinypng',
    'imgRev',
    'copyExcludeImg',
    'jsUglify',
    'jsRev',
    'copyExcludeJs',
    'scss',
    'cssMinify',
    'cssRev',
    'copyOther',
    'htmlInclude',
    'htmlRev',
    'htmlFormatModule'
];

if (!config.tinypngKey) {
    buildTaskList.splice(buildTaskList.indexOf('tinypng'), 1);
}

if (!OTHER_FILES.length) {
    buildTaskList.splice(buildTaskList.indexOf('copyOther'), 1);
}

gulp.task('build', gulp.series(...buildTaskList));