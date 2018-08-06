const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
    entry: {
    	index: './src/index.js',
        login: './src/login.js'
    },
    output: {
        filename: '[name].[hash:4].js',
        // filename: '[name].js',
        path: path.resolve('dist')
    },
    module: {
        rules: [
        	{
        		test: /\.scss$/,
				use : ExtractTextWebpackPlugin.extract({
					fallback  : 'style-loader',
					use       : ['css-loader', 'sass-loader'],
					publicPath: 'dist/'
				})
        	},
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: ['css-loader'],
                    publicPath: 'dist/'
                })
            },
            // {
            //     test:/\.js$/,
            //     use: 'bable-loader',
            //     include: '/src/',
            //     exclude: '/node_modules/'
            // },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name : 'img/[name].[hash:7].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    // 提取公共代码
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {   // 抽离第三方插件
                    test: '/node_modules/',   // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor',  // 打包后的文件名，任意命名    
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10    
                },
                utils: { // 抽离自己写的公共代码，utils这个名字可以随意起
                    chunks: 'initial',
                    name: 'utils',  // 任意命名
                    minSize: 0    // 只要超出0字节就生成一个新包
                }
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './html/index.ejs',
            filename: 'index.html',
            excludeChunks: ['login'],
            hash: true
        }),
        new HtmlWebpackPlugin({
            template: './html/login.ejs',
            filename: 'login.html',
            excludeChunks: ['index'],
            hash: true
        }),
        new ExtractTextWebpackPlugin('[name].[hash:4].css'),
        new CleanWebpackPlugin('dist')
    ],
    mode: 'development'
};

module.exports = config;