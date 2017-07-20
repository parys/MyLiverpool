//var IsDevBuild = process.argv.indexOf("--env.prod") < 0;
//var Path = require("path");
//var Webpack = require("webpack");
//var ExtractTextPlugin = require("extract-text-webpack-plugin");
//var ExtractCss = new ExtractTextPlugin("vendor.css");
//var WebpackNotifierPlugin = require("webpack-notifier");
//var Merge = require("webpack-merge");
//var CopyWebpackPlugin = require("copy-webpack-plugin");

//var SharedConfig = {
//    resolve: {
//        extensions: [".js"]
//    },
//    module: {
//        loaders: [
//            {
//                test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/,
//                loader: "url-loader?limit=100000"
//            },
//            {
//                test: /\.json$/,
//                loader: require.resolve("json-loader")
//            }
//        ]
//    },
//    entry: {
//        vendor: [
//            "@angular/common",
//            "@angular/compiler",
//            "@angular/core",
//            "@angular/http",
//            "@angular/material",
//            "@angular/platform-browser",
//            "@angular/platform-browser-dynamic",
//            "@angular/router",
//            "@angular/platform-server",
//            "zone.js",
//            "bootstrap/dist/css/bootstrap.min.css",
//            "@angular/material/prebuilt-themes/indigo-pink.css",
//            "event-source-polyfill",
//            "rxjs",
//            "ng2-auto-complete",
//            "ngx-pagination",
//          //  "ng2-page-scroll",
//            "tinymce/tinymce.min.js"
//        ]
//    },
//    output: {
//        publicPath: "/js/",
//        filename: "[name].js",
//        library: "[name]_[hash]"
//    },
//    plugins: [
//      //  new Webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
//        new Webpack.ContextReplacementPlugin(/\@angular\b.*\b(bundles|linker)/, Path.join(__dirname, "./angular2app")), // Workaround for https://github.com/angular/angular/issues/11580
//     //   new Webpack.IgnorePlugin(/^vertx$/), // Workaround for https://github.com/stefanpenner/es6-promise/issues/100
//     //   new Webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, require.resolve("node-noop")) // Workaround for https://github.com/andris9/encoding/issues/16
//    ]
//};

//var ClientBundleConfig = Merge(SharedConfig,
//{
//    output: { path: Path.join(__dirname, "wwwroot", "js") },
//    module: {
//        loaders: [
//            { test: /\.css(\?|$)/, loader: ExtractCss.extract(["css-loader"]) }
//        ]
//    },
//    plugins: [
//            ExtractCss,
//            new Webpack.DllPlugin({
//                path: Path.join(__dirname, "wwwroot", "js", "[name]-manifest.json"),
//                name: "[name]_[hash]"
//            }),
//            new CopyWebpackPlugin([
//                { from: "node_modules/tinymce/skins/", to: "../src/" },
//                { from: "node_modules/tinymce/plugins/", to: "../src/plugins/" },
//                { from: "node_modules/tinymce/themes/", to: "../src/themes/" }
//            ])
//        ]
//        .concat(IsDevBuild
//            ? [
//                new WebpackNotifierPlugin({ title: "vendorBuild-client", alwaysNotify: true }),
//                new CopyWebpackPlugin([//{ from: "node_modules/swagger-ui/dist", to: "../swagger/" },
//                ])
//            ]
//            : [
//                new Webpack.optimize.UglifyJsPlugin({
//                    compress: { warnings: false },
//                    output: {
//                        comments: false
//                    },
//                    minimize: true
//                })
//            ])
//});

////var ServerBundleConfig = Merge(SharedConfig, {
////    target: "node",
////    resolve: {
////        mainFields: ["main"]
////    },
////    output: {
////        path: Path.join(__dirname, "angular2app", "js"),
////        libraryTarget: "commonjs2"
////    },
////    module: {
////        loaders: [{ test: /\.css(\?|$)/, loader: "style-loader!css-loader" }]
////    },
////    entry: { vendor: ["aspnet-prerendering"] },
////    plugins: [
////        new Webpack.DllPlugin({
////            path: Path.join(__dirname, "angular2app", "js", "[name]-manifest.json"),
////            name: "[name]_[hash]"
////        }),
////        new WebpackNotifierPlugin({title: "vendorBuild-server", alwaysNotify: true })
////    ]
////});

//module.exports = [ClientBundleConfig
//   // , ServerBundleConfig
//];