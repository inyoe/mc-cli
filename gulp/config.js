const DIST   = 'dist/',
      SOURCE = 'src/',
      STATIC = 'assets/',
      CSS    = 'css/',
      SCSS   = 'scss/',
      JS     = 'js/',
      IMG    = 'img/',
      HTML   = 'html/',
      PUBLIC = 'public/',
      VIEW   = '__view/',
      SPRITE = 'sprite/';

module.exports = {
    path: {
        DIST,
        SOURCE,
        STATIC,
        CSS,
        SCSS,
        JS,
        IMG,
        HTML,
        PUBLIC,
        VIEW,
        SPRITE,
        DIST_CSS      : DIST + STATIC + CSS,
        DIST_JS       : DIST + STATIC + JS,
        DIST_IMG      : DIST + STATIC + IMG,
        DIST_HTML     : DIST,
        DIST_OTHER    : DIST + STATIC + 'other/',
        SOURCE_CSS    : SOURCE + STATIC + CSS,
        SOURCE_SCSS   : SOURCE + STATIC + SCSS,
        SOURCE_JS     : SOURCE + STATIC + JS,
        SOURCE_IMG    : SOURCE + STATIC + IMG,
        SOURCE_HTML   : SOURCE + HTML,
        SOURCE_VIEW   : SOURCE + VIEW,
        SOURCE_PUBLIC : SOURCE + PUBLIC,
        sSprite       : SOURCE + STATIC + SPRITE,
        tinyPath      : SOURCE + STATIC + 'tinypngBak/',
        revPath       : './rev/',
        MOCK_MODULES  : 'gulp/mock/module/'
    },
    server: {
        PORT: 3018,
        STATR_PATH: '/',
        PROXY: {
            KEY: '/api',
            REMOVE_KEY: true,
            TARGET: ''
        },
        ROUTER: [
            {
                PATH: '/cityList',
                TOTAL: 'citys.html'
            }
        ]
    },
    image: {
        SPRITE: {
            RATIO: 2,
            UNIT: 'px'
        },
        TINYPNG_KEY: ''
    },
    html: {
        removeComments: true,
        collapseWhitespace: false,
        collapseBooleanAttributes: false,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
    },
    replace: {
        html: [
                [/\/assets/g, '/myStatic/assets'],
        ],
        html_prod: [
                ['城市列表', '城市列表_生产环境']
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
    public: {
        KEYWORDS: 'keywords..',
        DESCRIPTION: 'description...'
    }
}