const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require("webpack");
const helper = require('./helper.js');
const ejs = require('ejs');
ejs.cache = false;

//var template = require("ejs-compiled-loader!./file.ejs");

let mode = "production";
mode = "development";
module.exports = (args) => {
	//console.log("args", args)
	return {
		mode,
		entry: {
			index: {
				import: './src/index.js',
			},
			css: {
				import: './src/css.js',
			}
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: '[name].bundle.js',
		},
		plugins: [
			/*new HtmlWebpackPlugin({
				title: "DSLR : MIRROR",
				body: "Hello",
				//inject: false
				filename: "index.html",
				template: 'src/tpl/index.ejs',
			}),*/
			new HtmlWebpackPlugin({
				inject: false,
				filename: "index.html",
				template: 'src/tpl/index.ejs',
				cache: false,
				hash: true,
				templateParameters: (compilation, assets, assetTags, options) => {
					//console.log("assetsassetsassets ############", compilation)
					//compilation.fileDependencies.add("/Users/surindersingh/Documents/dev/local/lit-theme/src/tpl/product.ejs");
					return {
						compilation,
						webpackConfig: compilation.options,
						htmlWebpackPlugin: {
							tags: assetTags,
							files: assets,
							options
						},
						helper,
						products:helper.products,
						addDep:(name)=>{
							//return;
							//console.log("includeincludeinclude ############", compilation)
							const [, tplPath] = options.template.split("!");
							
							const dir = path.dirname(tplPath)
							const file = path.join(dir, name + ".ejs")
							compilation.fileDependencies.add(file)
							//ejs.clearCache();
							console.log("options.template", file)
						},
						include__: (name) => {
							//console.log("includeincludeinclude ############", compilation)
							const [, tplPath] = options.template.split("!");
							const dir = path.dirname(tplPath)
							const file = path.join(dir, name + ".ejs")
							compilation.fileDependencies.add(file)

							//console.log("thisssss", file)
							//console.log("####options.template", options)
							//return fs.readFileSync(file)+"";
							ejs.render(file)
						}
					};
				}
			}),
			new MiniCssExtractPlugin({
				// Options similar to the same options in webpackOptions.output
				// both options are optional
				filename: "[name].css",
				chunkFilename: "[id].css"

			}),
			new webpack.HotModuleReplacementPlugin(),
		],
		module: {
			rules: [{
				test: /\.s[ac]ss$/i,
				use: [
					//mode !== "production"
					//	? "style-loader" : 
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: { import: false }
					},
					{
						loader: "sass-loader",
						options: {
							/*__implementation: require("sass"),*/
							additionalData: "$env: " + process.env.NODE_ENV + ";",
						},
					},
				],
			}, {
				test: /\.css$/i,
				use: [
					//mode !== "production"
					//	? "style-loader" : 
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: { import: false }
					}
				],
			}, {
				test: /\.ejs$/,
				use: {
					loader: 'ejs-compiled-loader',
					options: {
						htmlmin: true,
						htmlminOptions: {
							removeComments: true
						},
						cache: false
					}
				}
			}],
		},
		devServer: {
			static: [{
				directory: path.join(__dirname, 'dist'),
			}, {
				directory: path.join(__dirname, 'public'),
			}, {
				directory: path.join(__dirname, 'node_modules/bootstrap-icons'),
			}],
			compress: true,
			port: 9000,
			hot:true
		},
		optimization: {
			minimizer: [
				// For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
				`...`,
				new CssMinimizerPlugin(),
			],
		},
	}
};