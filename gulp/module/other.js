const gulp = require('gulp'),
      del = require('del');


const { path: { SOURCE, SOURCE_VIEW, SOURCE_CSS, DIST, revPath },
        others } = require('../config');


gulp.task('copyOther', function() {
    return new Promise((resolve) => {
                if (others.length) {
                    gulp.src(others.map((item) => {
                                return SOURCE + item;
                            }), { base: SOURCE})
                        .pipe(gulp.dest(DIST))
                        .on('end', resolve);
                } else {
                    resolve();
                }
            });
})


gulp.task('clearDist', function() {
    return del([DIST + '**/**', revPath + '**/**', SOURCE_VIEW + '**/**', SOURCE_CSS + '**/**']);
})