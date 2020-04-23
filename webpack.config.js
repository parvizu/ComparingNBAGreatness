var HtmlWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
	template: __dirname + '/app/index.html',
	filename: 'index.html',
	inject: 'body'
});

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: [
		'./app/index.js'
	],
	output: {
		filename: "index_bundle.js",
		// path: __dirname + '/dist'
		path: __dirname
	},
	module: {
		rules: [{
				test: /\.js$/,
				include: __dirname + '/app',
				loader: "babel-loader"
			},
			{ test: /\.css$/, use: [MiniCssExtractPlugin.loader,"css-loader"]},
			// { test: /\.(png|jpg|jpeg|ico)$/, use: { loader: 'file-loader', options: "[name][path].[hash].[ext]"}},
		]
	},

	plugins: [
		HTMLWebpackPluginConfig,
		new MiniCssExtractPlugin("./style.css", {allChunks: true})],

	devtool: '#inline-source-map'
};