const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const EsmWebpackPlugin = require('@purtuga/esm-webpack-plugin')

const resolve = (rel) => path.resolve(__dirname, '..', rel)

const load = (test, ...use) => ({test, use, exclude: /node_modules/})

module.exports = (env) => ({
	mode: (env.prod || env.es) ? 'production' : 'development',
	entry: {
		'code-tex': resolve('src/code-tex.ts'),
	},
	output: {
		path: resolve('dist'),
		filename: (env.prod || env.es) ? `[name].${env.es ? 'es' : 'min'}.js` : `[name].js`,
		library: `CodeTex`,
		libraryTarget: env.es ? 'var' : 'umd',
	},
	module: {
		rules: [
			load(/\.(j|t)s?$/, 'babel-loader'),
			load(/\.styl(us)?$/, 'css-loader', 'stylus-loader'),
			{
				...load(/\.css$/, 'css-loader'),
				exclude: /node_modules\/(?!(highlight\.js))/,
			},
		]
	},
	resolve: {
		extensions: ['.ts', '.js', '.json', '.styl', '.css'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'src': resolve('src'),
			'style': resolve('src/style'),
		},
	},
	plugins: [
		env.esm ? new EsmWebpackPlugin() : {apply: () => null},
		env.dev ? new HtmlWebpackPlugin({
			template: resolve('build/template.html'),
			inject: 'head',
		}) : {apply: () => null},
	],
	devServer: {
		port: 9001,
		historyApiFallback: true,
	},
})
