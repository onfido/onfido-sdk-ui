import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'
import { resolve } from 'path'

import { baseConfig } from './base.config'
import { basePlugins } from '../plugins'
import { baseRules, baseStyleRules } from '../rules'
import { BASE_DIR } from '../constants'
import { minimizer } from '../utils'

export const configLib = () => ({
  ...baseConfig,
  name: 'npm-library',
  output: {
    library: {
      type: 'umd',
    },
    path: `${BASE_DIR}/lib`,
    filename: 'index.js',
  },
  module: {
    rules: [
      ...baseRules(),
      ...baseStyleRules({
        disableExtractToFile: true,
        withSourceMap: false,
      }),
    ],
  },
  plugins: [
    ...basePlugins('npm'),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  optimization: {
    nodeEnv: false,
    chunkIds: 'named',
    moduleIds: 'named',
    sideEffects: false,
    splitChunks: {
      chunks: 'all',
    },
    minimizer: minimizer(false),
  },
  target: ['web', 'es5'],
  externals: [
    /*
      Note: These packages need to be bundled and are located
      in devDepencencies instead of dependencies in package.json

      When not bundled into the `lib/index.js` these packages will
      cause errors due to multiple causes.

      @onfido/castor
      @onfido/castor-icons
      @onfido/castor-react

      accessible-autocomplete
      array-flat-polyfill
      whatwg-fetch
      custom-event-polyfill
      node-polyglot

      react-redux
      react-webcam-onfido
      qrcode.react
      react-modal
      react-phone-number-input
      react-router-dom
      wpt
    */
    nodeExternals({
      modulesFromFile: {
        // @ts-ignore Outdated typings
        fileName: resolve(BASE_DIR, 'package.json'),
        excludeFromBundle: ['dependencies'],
      },
    }),
  ],
})
