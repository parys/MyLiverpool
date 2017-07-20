var IsDevBuild = process.argv.indexOf("--env.prod") < 0;
var Path = require("path");
var Webpack = require("webpack");
//var NodeExternals = require("webpack-node-externals");
var Merge = require("webpack-merge");
//var AllFilenamesExceptJavaScript = /\.(?!js(\?|$))([^.]+(\?|$))/;
var WebpackNotifierPlugin = require("webpack-notifier");

// Configuration in common to both client-side and server-side bundles
var SharedConfig = {
    context: __dirname,
    resolve: { extensions: [".js", ".ts"] },
    output: {
        filename: "[name].js",
        publicPath: "/js/" // Webpack dev middleware, if enabled, handles requests for this URL prefix
    },
    module: {
        loaders: [
            //{ test: /\.ts$/, include: /angular2app/, loaders: ["ts-loader?silent=true", "angular2-template-loader"] },
               { test: /\.ts$/, include: /angular2app/, loaders: ["awesome-typescript-loader", "angular2-template-loader"] },
            { test: /\.html$/, loader: "html-loader" },
          // bug  { test: /\.css$/, loader: "style-loader!css-loader" },
            { test: /\.css$/, loader: "raw-loader" },

            { test: /\.(png|jpg|jpeg|gif|svg)$/, loader: "url-loader", query: { limit: 25000 } }
        ]
    },
    plugins: [
// Put webpack plugins here if needed, or leave it as an empty array if not
    ]
};

// Configuration for client-side bundle suitable for running in browsers
var ClientBundleOutputDir = "./wwwroot/js/";
var ClientBundleConfig = Merge(SharedConfig, {
    entry: { 
        'main-client': "./angular2app/main.ts",
      //  "polyfills": [
      //      "./angular2app/polyfills.ts"
      //  ],
     //   "styles": [
     //       "./angular2app/styles.css"
     //   ],
      //  "webworker": [
     //       "./angular2app/workerLoader.ts"
     //   ]
 },
    output: { path: Path.join(__dirname, ClientBundleOutputDir) },
    plugins: [
        new Webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require("./wwwroot/js/vendor-manifest.json")
        })
    ].concat(IsDevBuild ? [
        // Plugins that apply in development builds only
        new Webpack.SourceMapDevToolPlugin({
            filename: "[file].map", // Remove this line if you prefer inline source maps
            moduleFilenameTemplate: Path.relative(ClientBundleOutputDir, "[resourcePath]") // Point sourcemap entries to the original file locations on disk
        }),
        new WebpackNotifierPlugin({ title: "clientBuild", alwaysNotify: true })
    ] : [
        // Plugins that apply in production builds only
        new Webpack.optimize.OccurrenceOrderPlugin(),
        new Webpack.optimize.UglifyJsPlugin()
    ])
});

// Configuration for server-side (prerendering) bundle suitable for running in Node
//var ServerBundleConfig = Merge(SharedConfig, {
//    resolve: { mainFields: ["main"] },
//    entry: { 'main-server': "./angular2app/boot-server.ts" },
//    output: {
//        libraryTarget: "commonjs",
//        path: Path.join(__dirname, "./angular2app/js")
//    },
//    target: "node",
//    devtool: "inline-source-map",
//    externals: [NodeExternals({ whitelist: [AllFilenamesExceptJavaScript] })], // Don't bundle .js files from node_modules
//    plugins: [
//        new WebpackNotifierPlugin({ title: "serverBuild", alwaysNotify: true }),
//                new Webpack.DllReferencePlugin({
//                    context: __dirname,
//                    manifest: require("./angular2app/js/vendor-manifest.json"),
//                    sourceType: "commonjs2",
//                    name: "./vendor"
//                })
//    ]
//});

module.exports = [
    ClientBundleConfig
  //  ,ServerBundleConfig
];