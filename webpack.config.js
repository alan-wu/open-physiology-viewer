const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const loaders = require('./webpack.loaders.js');
const path    = require('path');

module.exports = {
	devtool: 'source-map',
	context: __dirname + '/src',
	entry: {
        'test-app/index': [ 'babel-polyfill', 'zone.js/dist/zone.js', './test-app/index.js'],
        'open-physiology-viewer': [ 'babel-polyfill', 'zone.js/dist/zone.js', './index.js' ],
        'open-physiology-viewer-minimal':                                   [ './index.js' ],
        'test-library/index': [ 'babel-polyfill', 'zone.js/dist/zone.js', './test-library/index.js']
    },
	output: {
		path: __dirname + '/dist',
		filename: '[name].js',
		library: 'Apinatomy',
		libraryTarget: 'umd',
		sourceMapFilename: '[file].map',
		/* source-map support for IntelliJ/WebStorm */
		devtoolModuleFilenameTemplate:         '[absolute-resource-path]',
		devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
	},
	module: {
		loaders: loaders
	},
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
        new CopyWebpackPlugin([
            { from: 'test-app/index.html', to: 'test-app/index.html' },
            { from: 'test-app/favicon.ico', to: 'test-app/favicon.ico' },
			{ from: 'test-app/styles', to: 'test-app/styles'},
      { from: 'test-library/index.html', to: 'test-library/index.html' },
      { from: 'test-library/favicon.ico', to: 'test-library/favicon.ico' },
      { from: 'test-library/styles', to: 'test-library/styles'}
        ]),
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)/,
		    path.resolve(__dirname, '../src'), {}
		),
    new webpack.ContextReplacementPlugin(
        /power-assert-formatter[\\\/]lib/,
        path.resolve('./src'),
        {}
    ),
		new webpack.ProvidePlugin({
			'THREE': 'three'
		})
    ]
};
