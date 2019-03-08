const gulp = require('gulp'),
      rev = require('gulp-rev'),
      spritesmith = require('gulp.spritesmith'),
      merge = require('merge-stream'),
      tinypng = require('gulp-tinypng-compress');


const { path: { SOURCE_IMG, DIST_IMG, SOURCE_SCSS, sSprite, tinyPath, revPath },
        image: { SPRITE: { RATIO, UNIT }, TINYPNG_KEY },
        exclude: { img: EXCLUDE_IMG } } = require('../config');


gulp.task('tinypng', function() {
    return new Promise((resolve) => {
            if (TINYPNG_KEY) {
                const source = [SOURCE_IMG + '**/*.png'];

                EXCLUDE_IMG.forEach((item) => {
                    source.push('!' + SOURCE_IMG + item);
                })

                gulp.src(source)
                    .pipe(tinypng({
                        key: TINYPNG_KEY,
                        sigFile: tinyPath + '.tinypng-sigs',
                        log: true
                    }))
                    .pipe(gulp.dest(tinyPath))
                    .on('end', resolve);
            } else {
                resolve();
            }
        });
});




gulp.task('imgRev', function() {
    const source = [SOURCE_IMG + '**/*.*'];

    if (TINYPNG_KEY) {
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




gulp.task('copyExcludeImg', function() {
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




const fnSprite = function() {
    const spriteData = gulp.src([sSprite + 'i-*.png'])
        .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'module_sprite.scss',
        cssTemplate:(data)=> {
            const arr = [`.icon{display:inline-block; background-image:url(../img/sprite.png); background-size:${(data.spritesheet.width / RATIO) + UNIT}; background-repeat:no-repeat; vertical-align:middle; -webkit-transition:none; -moz-transition:none; transition:none;}\n\n`];

            data.sprites.forEach((sprite) => {
                arr.push(
                    `.${sprite.name.replace('-hover', ':hover')}{width:${(sprite.width / RATIO) + UNIT}; height:${(sprite.height / RATIO) + UNIT}; background-position:${(sprite.offset_x / RATIO) + UNIT} ${(sprite.offset_y / RATIO) + UNIT};}\n`
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
}




gulp.task('sprite', fnSprite);




global.fnSprite = fnSprite;