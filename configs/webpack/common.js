// shared config (dev and prod)
const {
    resolve
} = require('path');
const {
    CheckerPlugin
} = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const isProduction = process.argv.indexOf("-p") >= 0;
const webpack = require('webpack');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin({
      lightweightTags: true
    });

//color overrides

const tinycolor = require("tinycolor2");
const paletteHigh = "#069AE5";
const paletteLow = "#FFFFFF";
const paletteLight = "#FFFFFF";
const buttonColor = "#04569B";


module.exports = {

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
            moment: 'antd-jalali-moment',
            "@ant-design/icons/lib/dist$": resolve(__dirname, "../../src/lib/icon/antIcons.ts"),
        },
    },
    context: resolve(__dirname, '../../src'),
    module: {
        rules: [{
                test: /\.js$/,
                use: ['babel-loader', 'source-map-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        plugins: ['react-hot-loader/babel', ["import", {
                            "libraryName": "antd",
                            "style": true, // or 'css'
                        }]],
                        presets: ['@babel/preset-react'],
                    }
                }, {
                    loader: "awesome-typescript-loader",

                    options: {
                        errorsAsWarnings: false,
                        useCache: true,
                    }
                }],
            },
            {
                test: /\.(le|c)ss$/,
                use: [!isProduction ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true,
                            modifyVars: {
                                'primary-color': '#80C683',
                                'processing-color': '#80C683',
                                'btn-primary-bg': buttonColor,
                                'btn-default-color': buttonColor,
                                'radio-dot-color': paletteHigh,
                                'label-color': paletteLight,
                                'collapse-header-bg': paletteLow,
                                'radio-button-bg': tinycolor(paletteLow).darken(20).toString(),
                                'radio-button-active-color': tinycolor(paletteHigh).darken(40).toString(),

                                'input-border-color': paletteHigh,
                                'input-bg': paletteLow,
                                'input-addon-bg': paletteLow,
                                'popover-bg': tinycolor(paletteHigh).darken(20).toString(),
                                'popover-color': tinycolor(paletteLight).darken(15).toString(),
                            },
                        }
                    }
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=img/[hash].[ext]',
                    'image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false',
                ],
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: "file-loader"
            },
            {
                test: /\.po$/,
                loader: 'i18next-po-loader'
            }
        ],
    },
    output: {
        publicPath: "/"
    },
    plugins: [
        new CheckerPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html',
            favicon: 'logo.png',
        }),
        new MiniCssExtractPlugin({
            filename: "[name]-[chunkhash].min.css",
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
	new GitRevisionPlugin({
      		lightweightTags: true
    	}),
        new webpack.DefinePlugin({
            DEPLOY_TYPE: JSON.stringify(process.env.DEPLOY_TYPE || "production"),
            VERSION: JSON.stringify(gitRevisionPlugin.version()),
            COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash()),
            BRANCH: JSON.stringify(gitRevisionPlugin.branch())
        }),
    ],
    performance: {
        hints: false,
    },
    optimization: {
        splitChunks: {
            name: true,
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    minChunks: 2
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    minChunks: 1,
                    priority: -10
                }
            }
        },
        runtimeChunk: true,
    }
};
