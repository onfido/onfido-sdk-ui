import webpack from 'webpack'
import { ModifySourcePlugin } from 'modify-source-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { getSourceFileAsString } from '../morph/build.morph'
import { GitRevisionPlugin } from 'git-revision-webpack-plugin'
// @ts-ignore
import Visualizer from 'webpack-visualizer-plugin2'
import {
  WOOPRA_WINDOW_KEY,
  SDK_ENV,
  RELEASE_VERSION,
  PRODUCTION_BUILD,
  CONFIG,
  NODE_ENV,
  SDK_TOKEN_FACTORY_SECRET,
  BASE_32_VERSION,
  BASE_DIR,
} from './constants'

const gitRevisionPlugin = new GitRevisionPlugin()

const formatDefineHash = (defineHash: Record<string, unknown>) => {
  const formatted: Record<string, unknown> = {}
  Object.entries(defineHash).forEach(([key, value]) => {
    formatted[`process.env.${key}`] = JSON.stringify(value)
  })
  return formatted
}

export const basePlugins = (bundle_name = '') =>
  [
    !process.env.HOT_RELOAD_ENABLED &&
      new ModifySourcePlugin({
        rules: [
          {
            test: /\.tsx$/,
            modify: (_src, path) => {
              return getSourceFileAsString(path)
            },
          },
        ],
      }),
    new Visualizer({
      filename: `./reports/statistics.html`,
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: `${BASE_DIR}/dist/reports/bundle_${
        bundle_name === 'npm' ? 'npm_size.html' : `${SDK_ENV}_dist_size.html`
      }`,
      defaultSizes: 'gzip',
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin(
      // @ts-ignore
      formatDefineHash({
        ...CONFIG,
        NODE_ENV,
        SDK_ENV,
        PRODUCTION_BUILD,
        SDK_VERSION: RELEASE_VERSION,
        SDK_SOURCE: 'onfido_web_sdk',
        HOT_RELOAD_ENABLED: process.env.HOT_RELOAD_ENABLED,
        BASE_32_VERSION,
        PRIVACY_FEATURE_ENABLED: false,
        JWT_FACTORY: CONFIG.JWT_FACTORY,
        US_JWT_FACTORY: CONFIG.US_JWT_FACTORY,
        CA_JWT_FACTORY: CONFIG.CA_JWT_FACTORY,
        SDK_TOKEN_FACTORY_SECRET,
        WOOPRA_WINDOW_KEY,
        WOOPRA_IMPORT: `imports-loader?this=>Window.prototype["${WOOPRA_WINDOW_KEY}"],window=>Window.prototype["${WOOPRA_WINDOW_KEY}"]!wpt/wpt.js`,
        COMMITHASH: gitRevisionPlugin.commithash(),
      })
    ),
  ].filter(Boolean)
