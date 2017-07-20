const { AotPlugin } = require('@ngtools/webpack');
var WebpackNotifierPlugin = require("webpack-notifier");

const { root } = require('./helpers');
const clientBundleOutputDir = root('./wwwroot/dist');

/**
 * This is a client config which should be merged on top of common config
 */
module.exports = {
    entry: {
        'main-browser': root('./Client/main.browser.ts')
    },
    output: {
        path: root('./wwwroot/dist'),
    },
    target: 'web',
    plugins: [
        new WebpackNotifierPlugin({ title: "CLIENT", alwaysNotify: true })
    ]
};