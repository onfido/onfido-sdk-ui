import webpack from 'webpack';
import packageJson from './package.json'
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import autoprefixer from 'autoprefixer';
import customMedia from 'postcss-custom-media';
import url from 'postcss-url';
import mapObject from 'object-loops/map'
import mapKeys from 'object-loops/map-keys'
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import Visualizer from 'webpack-visualizer-plugin';
import path from 'path';
import nodeExternals from 'webpack-node-externals'
import dotenv from 'dotenv-safe'

// NODE_ENV can be one of: development | staging | test | production
const NODE_ENV = process.env.NODE_ENV || 'production'
// For production, test, and staging we should build production ready code
// i.e. fully minified so that testing staging is as realistic as possible
const PRODUCTION_BUILD = NODE_ENV !== 'development'

const result = dotenv.config({
  sample: `.env.${NODE_ENV}`,
})
if (result.error) {
  throw result.error
}
const CONFIG = result.parsed

const SDK_TOKEN_FACTORY_SECRET = process.env.SDK_TOKEN_FACTORY_SECRET || 'NA'

const baseRules = [
  {
    test: /\.jsx?$/,
    include: [
      `${__dirname}/src`
    ],
    use: [
      'babel-loader'
    ]
  }
];

const baseStyleLoaders = (modules, withSourceMap) => [
  //ref: https://github.com/unicorn-standard/pacomo The standard used for naming the CSS classes
  //ref: https://github.com/webpack/loader-utils#interpolatename The parsing rules used by webpack
  {
    loader: 'css-loader',
    options: {
      sourceMap: withSourceMap,
      modules: modules ? {
        getLocalIdent: (context, localIdentName, localName) => {
          const basePath = path.relative(`${__dirname}/src/components`, context.resourcePath)
          const baseDirFormatted = path.dirname(basePath).replace('/','-')
          return `onfido-sdk-ui-${baseDirFormatted}-${localName}`
        }
      } : modules
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => [
        customMedia(),
        autoprefixer(),
        url({ url: "inline" })
      ],
      sourceMap: withSourceMap
    }
  },
  {
    loader: 'less-loader',
    options: {
      sourceMap: withSourceMap
    }
  }
];



const baseStyleRules = ({
  disableExtractToFile = false,
  withSourceMap = true
} = {}) =>
  [
    {
      rule: 'exclude',
      modules: true
    },
    {
      rule: 'include',
      modules: false
    }
  ].map(({ rule, modules }) => ({
    test: /\.(less|css)$/,
    [rule]: [`${__dirname}/node_modules`],
    use: [
      disableExtractToFile || !PRODUCTION_BUILD ?
        'style-loader' :
        MiniCssExtractPlugin.loader,
      ...baseStyleLoaders(modules, withSourceMap)
    ]
  }))

const formatDefineHash = defineHash =>
  mapObject(
    mapKeys(defineHash, key => `process.env.${key}`),
    value => JSON.stringify(value)
  )
const WOOPRA_WINDOW_KEY = "onfidoSafeWindow8xmy484y87m239843m20"

const basePlugins = (bundle_name) => ([
  new Visualizer({
    filename: `./reports/statistics.html`
  }),
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false,
    reportFilename: `${__dirname}/dist/reports/bundle_${bundle_name}_size.html`,
    defaultSizes: 'gzip'
  }),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin(formatDefineHash({
    ...CONFIG,
    NODE_ENV,
    PRODUCTION_BUILD,
    'SDK_VERSION': packageJson.version,
    // We use a Base 32 version string for the cross-device flow, to make URL
    // string support easier...
    // ref: https://en.wikipedia.org/wiki/Base32
    // NOTE: please leave the BASE_32_VERSION be! It is updated automatically by
    // the release script 🤖
    'BASE_32_VERSION': 'BC',
    'PRIVACY_FEATURE_ENABLED': false,
    JWT_FACTORY: CONFIG.JWT_FACTORY,
    US_JWT_FACTORY: CONFIG.US_JWT_FACTORY,
    SDK_TOKEN_FACTORY_SECRET,
    WOOPRA_WINDOW_KEY,
    WOOPRA_IMPORT: `imports-loader?this=>${WOOPRA_WINDOW_KEY},window=>${WOOPRA_WINDOW_KEY}!wpt/wpt.min.js`
  }))
])

const baseConfig = {
  mode: PRODUCTION_BUILD ? 'production' : 'development',
  context: `${__dirname}/src`,
  entry: './index.js',

  resolve: {
    extensions: ['.jsx', '.js', '.json', '.less'],
    modules: [
      `${__dirname}/node_modules`,
      `${__dirname}/src`
    ],
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat',
      'react-modal': 'react-modal-onfido',
      '~utils': `${__dirname}/src/components/utils`
    }
  },

  optimization: {
    nodeEnv: false// otherwise it gets set by mode, see: https://webpack.js.org/concepts/mode/
  },

  stats: {
    colors: true,
    // Examine all modules
    maxModules: Infinity,
    // Display bailout reasons
    optimizationBailout: true
  },

  node: {
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  },

  devtool: PRODUCTION_BUILD ? 'source-map' : undefined
};


const configDist = {
  ...baseConfig,

  entry: {
    onfido: './index.js',
    demo: './demo/demo.js',
    previewer: './demo/previewer.js'
  },

  output: {
    library: 'Onfido',
    libraryTarget: 'umd',
    path: `${__dirname}/dist`,
    publicPath: CONFIG.PUBLIC_PATH ?? `${CONFIG.PUBLIC_PATH_PREFIX}/${packageJson.version}/`,
    filename: '[name].min.js',
    chunkFilename: 'onfido.[name].min.js'
  },

  module: {
    rules: [
      ...baseRules,
      ...baseStyleRules(),
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        use: ['file-loader?name=images/[name]_[hash:base64:5].[ext]']
      }
    ]
  },

  optimization: {
    minimizer: [
      ...PRODUCTION_BUILD ?
        [new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          terserOptions: {
            output: {
              preamble: `/* Onfido SDK ${packageJson.version} */`,
              comments: "/^!/"
            }
          }
        })] : []
    ]
  },

  plugins: [
    ...basePlugins('dist'),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: 'onfido.[name].css',
    }),
    new HtmlWebpackPlugin({
        template: './demo/demo.ejs',
        filename: 'index.html',
        minify: { collapseWhitespace: true },
        inject: 'body',
        JWT_FACTORY: CONFIG.JWT_FACTORY,
        DESKTOP_SYNC_URL: CONFIG.DESKTOP_SYNC_URL,
        chunks: ['onfido','demo']
    }),
    new HtmlWebpackPlugin({
        template: './demo/previewer.ejs',
        filename: 'previewer/index.html',
        minify: { collapseWhitespace: true },
        inject: 'body',
        JWT_FACTORY: CONFIG.JWT_FACTORY,
        DESKTOP_SYNC_URL: CONFIG.DESKTOP_SYNC_URL,
        chunks: ['previewer']
    }),
    ...PRODUCTION_BUILD ?
      [new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      })]
    : []
  ],

  devServer: {
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    publicPath: '/',
    contentBase: './dist',
    historyApiFallback: true,
    disableHostCheck: true // necessary to test in IE with virtual box, since it goes through a proxy, see: https://github.com/webpack/webpack-dev-server/issues/882
  }
}

const configNpmLib = {
  ...baseConfig,
  name: 'npm-library',
  output: {
    libraryTarget: 'commonjs2',
    path: `${__dirname}/lib`,
    filename: 'index.js'
  },
  module: {
    rules: [
      ...baseRules,
      ...baseStyleRules({disableExtractToFile:true, withSourceMap: false})
    ]
  },
  plugins: [
    ...basePlugins('npm'),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ],
  target: 'node',
  externals: [nodeExternals({
    modulesFromFile: {
      include: ['dependencies']
    }
  })]
}

const smp = new SpeedMeasurePlugin();

export default [smp.wrap(configDist), configNpmLib]
