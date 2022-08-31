import CopyPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import { baseConfig } from './base.config'
import { baseRules, baseStyleRules } from '../rules'
import { basePlugins } from '../plugins'
import { SDK_ENV, CONFIG, BASE_DIR } from '../constants'
import { minimizer } from '../utils'

export const configDist = () => ({
  ...baseConfig,

  entry: {
    [`onfido${SDK_ENV === 'Auth' ? SDK_ENV : ''}`]: './index.tsx',
    demo: './demo/demo.tsx',
    previewer: './demo/previewer.tsx',
  },
  target: ['web', 'es5'],
  output: {
    library: {
      type: 'umd',
      name: `Onfido${SDK_ENV === 'Auth' ? SDK_ENV : ''}`,
    },
    filename: '[name].min.js',
    path: `${BASE_DIR}/dist`,
    publicPath: CONFIG.PUBLIC_PATH,
    chunkFilename: `onfido${SDK_ENV === 'Auth' ? SDK_ENV : ''}.[name].min.js`,
  },
  module: {
    rules: [
      ...baseRules(),
      ...baseStyleRules(),
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name]_[hash:5][ext]',
        },
      },
    ],
  },

  optimization: {
    nodeEnv: false, // otherwise it gets set by mode, see: https://webpack.js.org/concepts/mode/
    chunkIds: 'named',
    moduleIds: 'named',
    sideEffects: false,
    splitChunks: {
      cacheGroups: {
        defaultVendors: false,
      },
    },
    minimizer: minimizer(true),
  },
  plugins: [
    ...basePlugins(),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: `onfido${SDK_ENV === 'Auth' ? SDK_ENV : ''}.[name].css`,
    }),
    ...(SDK_ENV === 'Auth'
      ? [
          new CopyPlugin({
            patterns: [
              {
                from: `${BASE_DIR}/auth-sdk`,
                to: `${BASE_DIR}/dist/auth-sdk`,
              },
            ],
          }),
        ]
      : []),
    new HtmlWebpackPlugin({
      template: './demo/demo.ejs',
      filename: 'index.html',
      minify: { collapseWhitespace: true },
      inject: 'body',
      JWT_FACTORY: CONFIG.JWT_FACTORY,
      DESKTOP_SYNC_URL: CONFIG.DESKTOP_SYNC_URL,
      chunks: [`onfido${SDK_ENV === 'Auth' ? SDK_ENV : ''}`, 'demo'],
    }),
    new HtmlWebpackPlugin({
      template: './demo/previewer.ejs',
      filename: 'previewer/index.html',
      minify: { collapseWhitespace: true },
      inject: 'body',
      JWT_FACTORY: CONFIG.JWT_FACTORY,
      DESKTOP_SYNC_URL: CONFIG.DESKTOP_SYNC_URL,
      chunks: ['previewer'],
    }),
  ],

  devServer: {
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    server: {
      // Enable chrome://flags/#allow-insecure-localhost in Google Chrome to support invalid https certificates
      type: process.env.HTTPS ? 'https' : 'http',
    },
    hot: true,
    historyApiFallback: true,
    static: './dist',
    // necessary to test in IE with virtual box, since it goes through a proxy, see: https://github.com/webpack/webpack-dev-server/issues/882
    allowedHosts: 'all',
    devMiddleware: {
      publicPath: '/',
    },
  },
})

export const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: 'style.css',
  chunkFilename: `onfido${SDK_ENV === 'Auth' ? SDK_ENV : ''}.[name].css`,
})
