import { join, resolve } from 'path'
import { readdirSync } from 'fs'
const { camelCase } = require('lodash')
const webpack = require('webpack')
const { TsConfigPathsPlugin, CheckerPlugin } = require('awesome-typescript-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TypedocWebpackPlugin = require('typedoc-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const env = process && process.env && process.env.NODE_ENV
const dev = !(env && env === 'production')

/**
 * Update this variable if you change your library name
 */
const libraryName = 'node-private-tools'
const plugins = [
    new CheckerPlugin(),
    new TsConfigPathsPlugin(),
    new webpack.DefinePlugin({
        VERSION: JSON.stringify(require('./package.json').version)
    }),
    new CopyWebpackPlugin([
        { context: 'src/schemas', from: '*.json', to: 'schemas' },
    ]),
]

let entry: string | string[] = [
    // bundle the client for hot reloading
    `./src/${libraryName}.ts`
]

if (dev === false) {
    plugins.push(new TypedocWebpackPlugin(
        {
            theme: 'minimal',
            out: 'docs',
            target: 'es6',
            ignoreCompilerErrors: true
        },
        'src'
    ))
    entry = join(__dirname, `src/${libraryName}.ts`)
} else {
    plugins.push(new webpack.HotModuleReplacementPlugin())
}

export default {
    entry: {
        index: entry
    },
    // Currently cheap-module-source-map is broken https://github.com/webpack/webpack/issues/4176
    devtool: 'source-map',
    output: {
        path: join(__dirname, 'dist'),
        libraryTarget: 'commonjs',
        filename: `${libraryName}.js`
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            handlebars: 'handlebars/dist/handlebars.min.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'awesome-typescript-loader'
                    },
                ]
            }
        ]
    },
    plugins: plugins,
    target: 'node',
    externals: [nodeExternals()],
}
