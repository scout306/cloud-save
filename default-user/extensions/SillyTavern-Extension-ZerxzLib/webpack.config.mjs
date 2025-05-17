import path from 'node:path';
import fs from 'node:fs';
import TerserPlugin from 'terser-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import * as url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sillyTavern = __dirname.substring(0, __dirname.lastIndexOf('public') + 6);
const manifest = JSON.parse(fs.readFileSync('./manifest.json', 'utf8'));
let { js: scriptFilepath } = manifest;
scriptFilepath = path.dirname(path.join(__dirname, scriptFilepath));
const relativePath = path.relative(scriptFilepath, sillyTavern);

export default {
    experiments: {
        outputModule: true,
    },
    devtool: 'source-map',
    target: 'browserslist',
    entry: {
        'zerxzLib': { import: './src/index.ts' },
        // 'react': { import: ['react', 'react-dom'] },
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist/'),
        chunkFilename: '[name].[contenthash].chunk.js',
        asyncChunks: true,
        chunkLoading: 'import',
        clean: true,
        library: {
            type: 'module',
        },
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
        plugins: [new TsconfigPathsPlugin({ extensions: ['.ts', '.js', '.tsx', '.jsx'], baseUrl: './src/', configFile: path.join(__dirname, 'tsconfig.json') })],
        alias: {},
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: ['@svgr/webpack', 'url-loader'],
            },

            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: {
                                auto: true,
                                localIdentName:
                                    "[hash:base64:5]",
                            },
                        },
                    },
                ],
                include: /\.module\.css$/,
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
                exclude: /\.module\.css$/,
            },
            {
                test: /\.[jt]sx?$/,
                exclude: [
                    /node_modules/,
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: [

                            ['@babel/preset-env', {}],
                            ['@babel/preset-typescript', { allowDeclareFields: true }],

                        ],
                        plugins: [
                            //     // ['@babel/plugin-proposal-class-properties', {}],
                            //     ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true, version: "2023-11" }],
                            //     ["@babel/plugin-transform-class-properties", { "loose": true }],
                            // "@babel/plugin-transform-typescript"
                        ]
                    },
                },
            },

        ],
    },
    optimization: {

        minimize: true,
        minimizer: [new TerserPlugin({ extractComments: false })],
        splitChunks: {
            chunks: 'async',
            minSize: 20000,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                },
                default: {
                    name: 'default',
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    externals: [
        ({ context, request }, callback) => {
            let scriptPath = path.join(context, request);
            const basenameDir = path.basename(__dirname);
            if (/^@silly-tavern/.test(request)) {
                let script = (`${relativePath}\\${request.replace('@silly-tavern/', '')}`).replace(/\\/g, '/');
                script = path.extname(script) === '.js' ? script : `${script}.js`;
                return callback(null, script);
            }
            if (!scriptPath.includes(basenameDir)) {
                let isJs = path.extname(scriptPath) === '.js';
                if (!isJs) {
                    isJs = fs.existsSync(`${scriptPath}.js`);
                    scriptPath = isJs ? `${scriptPath}.js` : scriptPath;
                }
                if (isJs) {
                    const script = (relativePath + scriptPath.replace(sillyTavern, '')).replace(/\\/g, '/');
                    return callback(null, script);
                }
            }
            console.log('External: ', scriptPath);
            console.log('External: ', request);
            callback();
        },
        /^(jquery|\$)$/i
    ],
};
