var HtmlWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
	template: __dirname + '/app/index.html',
	filename: 'index.html',
	inject: 'body'
});

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: [
		'./app/index.js'
	],
	output: {
		filename: "index_bundle.js",
		path: __dirname + '/dist'
	},
	module: {
		loaders: [{
				test: /\.js$/,
				include: __dirname + '/app',
				loader: "babel-loader"
			},
			{ test: /\.json$/, loader: "json-loader" },
			{ test: /\.css$/, loader: ExtractTextPlugin.extract("css-loader")},
			{ test: /\.(png|jpg|jpeg|ico)$/, loader: 'url-loader?limit=8192' }
		]
	},

	plugins: [
		HTMLWebpackPluginConfig,
		new ExtractTextPlugin("./style.css", {allChunks: true})],

	// devtool: '#inline-source-map'
};