const gulp = require('gulp'),
      browserSync = require('browser-sync').create(),
      Mock = require('mockjs'),
      proxyMiddleware = require('http-proxy-middleware');


const { path: { SOURCE, SOURCE_VIEW, SOURCE_IMG, SOURCE_SCSS, SOURCE_JS, SOURCE_HTML, SOURCE_PUBLIC, STATIC, sSprite, MOCK_MODULES },
        server: { PORT, STATR_PATH, PROXY: { KEY, REMOVE_KEY, TARGET }, ROUTER } } = require('../config');

let   mockList = require('../mock')();


const logDataList = function(title, data, showValue=false) {
    if (data) {
        console.log(`[\u001b[32m${title}\u001b[0m]:\n --------------------------------------`);
        for (let key in data) {
            console.log('    ' + key + (showValue ? ' \u001b[36m-->\u001b[0m ' + data[key] : ''));
        }
        console.log(' --------------------------------------\n');
    }
}


gulp.task('browserSync', function() {
    global.browserSync = browserSync;

    const totalRouter = {},
          _STATIC = STATIC.charAt(STATIC.length - 1) === '/' ?
                        STATIC.substring(0, STATIC.length - 1) :
                        STATIC;

    let middlewareProxy;

    if (KEY) {
        middlewareProxy = TARGET ? 
                            proxyMiddleware(KEY, {
                                TARGET,
                                changeOrigin: true,
                                pathRewrite: function(path, req) {
                                    return REMOVE_KEY ? path.replace(KEY, '') : path;
                                }
                            }) :
                            {
                                route: KEY,
                                handle: (req, res, next) => {
                                    if (mockList && mockList.hasOwnProperty(req.url)) {
                                        res.setHeader("Content-Type", "application/json");
                                        res.end(JSON.stringify(Mock.mock(mockList[req.url])));
                                    }
                                    next()
                                }
                            }
    }


    ROUTER.forEach((item) => {
        totalRouter[item.PATH] = SOURCE_VIEW + item.TOTAL;
    })
    totalRouter['/' + _STATIC] = SOURCE + _STATIC;

    logDataList('Route', totalRouter, true);
    logDataList('Mock', mockList);



    browserSync.init({
        open: 'external',
        port: PORT,
        server: {
            baseDir: SOURCE_VIEW,
            middleware: middlewareProxy ? [middlewareProxy] : null,
            routes: totalRouter
        },
        startPath: STATR_PATH
    });


    gulp.watch(SOURCE_IMG + '**/*.*', browserSync.reload);
    gulp.watch(SOURCE_JS + '**/*.js').on('change', browserSync.reload);
    gulp.watch(SOURCE_SCSS + '**/*.scss').on('change', file => fnScss(file));
    gulp.watch(SOURCE_PUBLIC + '*.html').on('change', gulp.series('htmlInclude', browserSync.reload));

    gulp.watch(SOURCE_HTML + '**/*.html').on('change', file => {
        global.fnHtmlInclude(file);
        setTimeout(browserSync.reload, 100);
    });
    
    gulp.watch(sSprite + '*.png', done => {
        setTimeout(() => {
            global.fnSprite();
            done();
        }, 500);
    });

    gulp.watch(MOCK_MODULES + '*.js', done => {
        mockList = require('../mock')();
        setTimeout(() => {
            logDataList('Mock', mockList);
            browserSync.reload();
            done();
        }, 100);
    })
})