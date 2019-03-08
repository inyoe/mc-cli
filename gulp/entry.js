const gulp = require('gulp');


gulp.task('dev', gulp.series('scss', 'htmlInclude', 'browserSync'));


gulp.task('build', gulp.series('clearDist',
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
                               'htmlFormatModule'));