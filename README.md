# MC-CLI
* Gulp & Browser-sync
* HTML: include & minify
* CSS: scss & autoprefixer & minify
* JS: minify(uglify)
* IMG: sprite & tinypng
* Source replace & Router & Request Proxy & Mockjs
<br>
<br>

## INSTALL
* **Gulp** `npm install gulp@next -g`
* `npm install`
<br>
<br>

## USAGE
* Development: `npm run dev` or `gulp dev`
* Build: `npm run build` or `gulp build`
<br>
<br>

## DETAILS
**./gulpconfig.js**

`module.exports = {
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
    port: 3018,     //端口
    startPath: '/', //起始路径
    proxy: {        //反向代理
        key: '/api',
        removeKey: true,
        target: ''
    },
    router: [       //路由
        {
            path: '/cityList',
            total: 'citys.html'
        }
    ],
    sprite: {       //雪碧图参数
        ratio: 2,
        unit: 'px'
    },
    tinypngKey: '', //https://tinypng.com/developers
    replace: {      //文件替换内容规则
        html: [
            [/\/assets/g, '/myStatic/assets']
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
    htmlminOptions: {
        removeComments: true,                 //清除注释
        collapseWhitespace: false,            //压缩
        collapseBooleanAttributes: false,     //省略布尔属性的值 <input checked="true"/> -> <input />
        removeEmptyAttributes: true,          //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,     //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,  //删除<style>和<link>的type="text/css"
        minifyJS: true,                       //压缩页面JS
        minifyCSS: true                       //压缩页面CSS
    },
    public: {
        KEYWORDS: 'keywords..',         //头部Keywords
        DESCRIPTION: 'description...'   //头部Description
    }
}`