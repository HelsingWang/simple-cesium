// webpack.config.js

const cesiumSource = 'node_modules/cesium/Source'; // Cesium源码路径。
const onePackage = false; // 是否打包成一个文件。
const nodeEnv = process.env.NODE_ENV; // 编译模式。
const webpack = require('webpack'); // 访问内置的插件。
const path = require("path"); // 路径组件。
const HtmlWebpackPlugin = require('html-webpack-plugin'); // HTML插件。
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 拷贝文件插件。
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // Bundle分析插件。
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

const config = {
    mode: nodeEnv, // 编译模式："production" | "development" | "none"。
    context: __dirname, // 基础目录
    entry: {
        "simple-cesium": "./src/index.js"
    }, // 入口：string | object | array。这里应用程序开始执行，webpack开始打包。
    output: {
        filename: onePackage ? "[name].all.js" : "[name].js", // 输出文件名："[name].[hash:8].js", "bundle.js" | "[name].js" | "[chunkhash].js"。
        path: path.resolve(__dirname, "dist"), // path.join(__dirname,'dist'), // 输出路径，一般为绝对路径。
        // publicPath: "/assets/", // 输出解析文件的目录，设置之后所有资源文件会自动加上这个路径，url地址是相对于HTML页面的。
        chunkFilename: "[name].js", // 未被列入entry中，却又需要被打包出来的文件命名配置。
        library: "SimpleCesium", // 导出库的名称。
        libraryTarget: "umd" // 导出库的类型。常用umd模式，让输出的内容支持amd、commonJS模式加载。
    }, // 输出，webpack如何输出结果的相关选项。
    devServer: {
        hot: true, // 是否启用热更新。
        contentBase: path.join(__dirname, "dist"), // 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要。
        // openPage: "index.html", // 指定打开的页面。指定路径会改变URL地址。
        compress: true, // 是否启用gzip压缩。
        port: 9999, // 端口号。
        lazy: false // 当启用lazy时，dev-server只有在请求时才编译包(bundle)。这意味着webpack不会监视任何文件改动。我们称之为“惰性模式”。
    }, // 开发调试工具
    module: {
        rules: [
            {
                test: /\.css$/i, // 正则表达式，表示.css后缀的文件。
                use: ["style-loader", 'css-loader'] // 针对css文件使用的loader，注意有先后顺序，数组项越靠后越先执行。
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                include: [
                    path.resolve(__dirname, "src")
                ],
                exclude: [
                    // /node_modules/,
                    path.resolve(__dirname, "public") // 与html-webpack-plugin插件冲突，会导致title无法替换，因此排除此目录。
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                loader: "url-loader",
                options: {
                    name: "./Assets/sc/[name].[ext]", // 这个路径其实是为了兼容Cesium的资源文件目录
                    limit: 10240 // 超过10K的不转换base64
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        // new BundleAnalyzerPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            },
            CESIUM_BASE_URL: JSON.stringify("")
        }),
        new HtmlWebpackPlugin({ // 打包输出HTML
            title: "Simple Cesium", // 给模板中的html注入标题，需要在模板的html中指明配置，<%= htmlWebpackPlugin.options.title %>
            filename: "index.html", // 指index定要生成的html路径，基于输出目录。
            template: "public/index.html", // 指定html模板文件路径。这里的模板类型可以是任意你喜欢的模板，可以是 html、jade、ejs、hbs，等等，但是要注意的是，使用自定义的模板文件时，需要提前安装对应的loader，否则webpack不能正确解析。
            inject: "body", // 注入选项。1.true：默认值，script标签位于html文件的body底部；2.body：script标签位于html文件的body底部（同true）；3.head：script标签位于head标签内；4.false：不插入生成的js文件，只是单纯的生成一个html文件。
            favicon: "public/favicon.ico", // 给生成的html文件生成一个favicon，属性值为favicon文件所在的路径名。
            hash: true, // 给生成的js文件一个独特的hash值，该hash值是该次webpack编译的hash值。默认值为false。
            cache: true, // 默认是true，表示内容变化的时候是否生成一个新的文件。
            showErrors: true, // 默认是true，作用是如果webpack编译出现错误，webpack会将错误信息包裹在一个pre标签内，属性的默认值为 true，也就是显示错误信息，开启这个方便定位错误。
            //chunks:['index','main'], // 主要用于多入口文件，当你有多个入口文件，编译后生成多个打包后的文件，那么chunks就能选择你要使用那些js文件，如果不设置则默认全部引入。
            //excludeChunks:['main.js'], // 排除掉一些js。
            minify: nodeEnv === "production" ? { // 压缩html文件。属性值是一个压缩选项或者false。默认值为false，即不对生成的html文件进行压缩。
                caseSensitive: true, // 是否对大小写敏感，默认false。
                collapseBooleanAttributes: true, // 是否简写boolean格式的属性如：disabled="disabled" 简写为disabled  默认false。
                collapseWhitespace: true, // 是否删除空格与换行符，默认false。
                minifyCSS: true, // 是否压缩内联css（使用clean-css进行的压缩），默认值false。
                minifyJS: true, // 是否压缩html里的js（使用uglify-js进行的压缩）。
                preventAttributesEscaping: true, // 是否阻止属性值转义。
                removeAttributeQuotes: true, // 是否移除属性的引号，默认false。
                removeComments: true, // 是否删除注释，默认false。
                removeCommentsFromCDATA: true, // 是否从CDATA中删除注释，默认false。
                removeEmptyAttributes: true, // 是否删除空属性，默认false。
                removeOptionalTags: false, // 是否删除可选的标签，若开启此项，生成的html中没有body和head，html也未闭合。
                removeRedundantAttributes: true, // 是否删除多余的属性。
                removeScriptTypeAttributes: true, // 是否删除script的类型属性，在h5下面script的type默认值：text/javascript 默认值false。
                removeStyleLinkTypeAttributes: true, // 是否删除style的类型属性，type="text/css" 同上。
                useShortDoctype: true, // 是否使用短文档类型，默认false。
            } : {}
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: path.join(cesiumSource, "../Build/Cesium/Workers"), to: "Workers"},
                {from: path.join(cesiumSource, "../Build/Cesium/Assets"), to: "Assets"},
                {from: path.join(cesiumSource, "../Build/Cesium/Widgets"), to: "Widgets"},
                {from: path.join(cesiumSource, "../Build/Cesium/ThirdParty"), to: "ThirdParty"}
            ]
        }), // 拷贝Cesium资源、控件、WebWorker到静态目录。
    ],
    optimization: {
        splitChunks: onePackage ? {} : {
            chunks: "initial", // 从哪些chunks里面抽取代码，还可以通过函数来过滤所需的chunks："initial" | "async" | "all" | function。
            minSize: 30000, // 抽取出来的文件在压缩前的最小大小，默认为30000。
            maxSize: 0, // 抽取出来的文件在压缩前的最大大小，默认为0，表示不限制最大大小。
            minChunks: 1, // 被引用次数，默认为1。如common中minChunks为2，表示将被两次以上引用的代码抽离成common。
            maxAsyncRequests: 6, // 按需加载chunk的并发请求数量，默认为5。
            maxInitialRequests: 4, // 页面初始加载时的并发请求数量，默认为3。
            automaticNameDelimiter: '~', // 抽取出来的文件的自动生成名字的分割符，默认为~。
            cacheGroups: {
                vendor: {
                    name: "simple-cesium.runtime", // 抽取出来文件的名字，表示自动生成文件名。
                    test: /[\\/](node_modules|thirdParty)[\\/]/,
                    chunks: "all",
                    priority: 10 // 优先级。
                },
                common: {
                    name: "simple-cesium.common",
                    test: /[\\/]src[\\/]/,
                    minChunks: 2,
                    minSize: 0, // 如果被多次引用的通用代码文件不超过minSize，则不会被抽离。
                    chunks: "all",
                    priority: 15,
                    reuseExistingChunk: true
                }
            } // 缓存组。
        },
        // runtimeChunk: {
        //     name: 'simple-cesium.manifest'
        // },
        // minimize: nodeEnv === 'production', // 是否压缩代码。
    },
    resolve: {
        alias: {
            'cesium': '/node_modules/cesium' // 在resolve中设置cesium别名，这样在引入的时候就可以根据别名找到Cesium的包。
        }
    },
};

module.exports = config;