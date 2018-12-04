module.exports = {
    path: {
        DIST:   'dist/',
        SOURCE: 'src/',
        STATIC: 'assets/',
        CSS:    'css/',
        SCSS:   'scss/',
        JS:     'js/',
        IMG:    'img/',
        HTML:   'html/',
        PUBLIC: 'public/',
        VIEW:   '__view/',
        SPRITE: 'sprite/'
    },
    port: 3018,
    startPath: '/',
    proxy: {
        key: '/api',
        removeKey: true,
        target: ''
    },
    router: [
        {
            path: '/cityList',
            total: 'citys.html'
        }
    ],
    sprite: {
        ratio: 2,
        unit: 'px'
    },
    tinypngKey: '',
    replace: {
        html: [
            [/\/assets/g, '/myStatic/assets']
        ],
        js: [
            [/\/assets/g, '/myStatic/assets']
        ],
        css: []
    },
    exclude: {
        js: [],
        img: []
    },
    others: [],
    htmlminOptions: {
        removeComments: true,
        collapseWhitespace: false,
        collapseBooleanAttributes: false,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
    },
    public: {
        KEYWORDS: 'keywords..',
        DESCRIPTION: 'description...'
    }
}