# MC-CLI
* Gulp & Browser-sync
* HTML: include & minify
* CSS: scss & autoprefixer & minify
* JS: minify(uglify)
* IMG: sprite & tinypng
* Source replace & Router & Request Proxy & Mockjs


## INSTALL
* **Gulp** `npm install gulp@next -g`
* `npm install`


## USAGE
* Development: `npm run dev` or `gulp dev`

* Build: `npm run build` or `gulp build`
> -env=(prod | test | awsl...)

## DETAILS
**./gulp/config.js**
```
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
        PORT: 3018,     //端口
        STATR_PATH: '/',        //起始路径
        PROXY: {        //反向代理
            KEY: '/api',
            REMOVE_KEY: true,
            TARGET: ''
        },
        ROUTER: [       //路由
            {
                PATH: '/cityList',
                TOTAL: 'citys.html'
            }
        ]
    },
    image: {
        SPRITE: {           //雪碧图参数
            RATIO: 2,
            UNIT: 'px'
        },
        TINYPNG_KEY: ''     //申请KEY: https://tinypng.com/developers
    },
    html: {
        removeComments: true,                   //清除注释
        collapseWhitespace: false,              //压缩空格
        collapseBooleanAttributes: false,       //省略布尔属性的值 <input checked="true"/> -> <input />
        removeEmptyAttributes: true,            //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,       //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,    //删除<style>和<link>的type="text/css"
        minifyJS: true,                         //压缩页面JS
        minifyCSS: true                         //压缩页面CSS
    },
    replace: {      //文件内容替换内容规则，html_prod只在 -env=prod 情况下执行
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
    exclude: {      //忽略压缩、替换内容文件
        js: [],
        img: []
    },
    others: [],
    public: {
        KEYWORDS: 'keywords..',         //头部Keywords
        DESCRIPTION: 'description...'   //头部Description
    }
}
```
