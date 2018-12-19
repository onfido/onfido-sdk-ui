import webpack from 'webpack';
import packageJson from './package.json'
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import autoprefixer from 'autoprefixer';
import customMedia from 'postcss-custom-media';
import url from 'postcss-url';
import mapObject from 'object-loops/map'
import mapKeys from 'object-loops/map-keys'
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import path from 'path';


// NODE_ENV can be one of: development | staging | test | production
const NODE_ENV = process.env.NODE_ENV || 'production'
// For production, test, and staging we should build production ready code
// i.e. fully minified so that testing staging is as realistic as possible
const PRODUCTION_BUILD = NODE_ENV !== 'development'

const baseRules = [
  {
    test: /\.jsx?$/,
    include: [
      `${__dirname}/src`
    ],
    use: ['babel-loader']
  },
  {
    test: /\.json$/,
    use: ['json-loader']
  }
];

const baseStyleLoaders = (modules=true) => [
  //ref: https://github.com/unicorn-standard/pacomo The standard used for naming the CSS classes
  //ref: https://github.com/webpack/loader-utils#interpolatename The parsing rules used by webpack
  {
    loader: 'css-loader',
    options: {
      sourceMap: true,
      modules,
      getLocalIdent: (context, localIdentName, localName) => {
        const basePath = path.relative(`${__dirname}/src/components`, context.resourcePath)
        const baseDirFormatted = path.dirname(basePath).replace('/','-')
        return `onfido-sdk-ui-${baseDirFormatted}-${localName}`
      }
    }
  },
  {
    loader: `postcss-loader`,
    options: {
      plugins: () => [
        customMedia(),
        autoprefixer({ browsers: 'last 2 versions' }),
        url({ url: "inline" })
      ],
      sourceMap: true
    }
  },
  {
    loader: 'less-loader',
    options: {
      sourceMap: true
    }
  }
];



const baseStyleRules = (disableExtractToFile = false) =>
 [{
   rule: 'exclude',
   modules: true
 },
 {
   rule: 'include',
   modules: false
 }].map(({rule, modules})=> ({
   test: /\.(less|css)$/,
   [rule]: [`${__dirname}/node_modules`],
   use: disableExtractToFile ?
    ['style-loader',...baseStyleLoaders(modules)] :
    ExtractTextPlugin.extract({
     fallback: 'style-loader',
     use: baseStyleLoaders(modules)
    })
 }))

const WOOPRA_DEV_DOMAIN = 'dev-onfido-js-sdk.com'
const WOOPRA_DOMAIN = 'onfido-js-sdk.com'

const PROD_CONFIG = {
  'ONFIDO_API_URL': 'https://api.onfido.com',
  'ONFIDO_SDK_URL': 'https://sdk.onfido.com',
  'ONFIDO_TERMS_URL': 'https://onfido.com/termsofuse',
  'ONFIDO_PRIVACY_URL': 'https://onfido.com/privacy',
  'JWT_FACTORY': 'https://token-factory.onfido.com/sdk_token',
  'DESKTOP_SYNC_URL' : 'https://sync.onfido.com',
  'MOBILE_URL' : 'https://id.onfido.com',
  'SMS_DELIVERY_URL': 'https://telephony.onfido.com',
  'PUBLIC_PATH' : `https://assets.onfido.com/web-sdk-releases/${packageJson.version}/`,
  'RESTRICTED_XDEVICE_FEATURE_ENABLED': true,
  WOOPRA_DOMAIN
}

const TEST_CONFIG = { ...PROD_CONFIG,
  PUBLIC_PATH: '/', 'MOBILE_URL' : '/',
  'RESTRICTED_XDEVICE_FEATURE_ENABLED': false,
  'WOOPRA_DOMAIN': WOOPRA_DEV_DOMAIN
}

const STAGING_CONFIG = {
  'ONFIDO_API_URL': 'https://apidev.onfido.com',
  'ONFIDO_SDK_URL': 'https://sdk-staging.onfido.com',
  'ONFIDO_TERMS_URL': 'https://dev.onfido.com/termsofuse',
  'ONFIDO_PRIVACY_URL': 'https://dev.onfido.com/privacy',
  'JWT_FACTORY': 'https://token-factory-dev.onfido.com/sdk_token',
  'DESKTOP_SYNC_URL' : 'https://sync-dev.onfido.com',
  'MOBILE_URL' : '/',
  'SMS_DELIVERY_URL' : 'https://telephony-dev.onfido.com',
  'PUBLIC_PATH' : '/',
  'RESTRICTED_XDEVICE_FEATURE_ENABLED': true,
  'WOOPRA_DOMAIN': WOOPRA_DEV_DOMAIN
}

const DEVELOPMENT_CONFIG = {
  ...TEST_CONFIG,
}

const CONFIG_MAP = {
  development: DEVELOPMENT_CONFIG,
  staging: STAGING_CONFIG,
  test: TEST_CONFIG,
  production: PROD_CONFIG,
}

const CONFIG = CONFIG_MAP[NODE_ENV]

const formatDefineHash = defineHash =>
  mapObject(
    mapKeys(defineHash, key => `process.env.${key}`),
    value => JSON.stringify(value)
  )

const basePlugins = (bundle_name) => ([
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false,
    reportFilename: `${__dirname}/dist/reports/bundle_${bundle_name}_size.html`,
    defaultSizes: 'parsed'
  }),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin(formatDefineHash({
    ...CONFIG,
    NODE_ENV,
    PRODUCTION_BUILD,
    'SDK_VERSION': packageJson.version,
    // Increment BASE_32_VERSION with each release following Base32 notation, i.e AA -> AB
    // Do it only when we introduce a breaking change between SDK and cross device client
    // ref: https://en.wikipedia.org/wiki/Base32
    'BASE_32_VERSION' : 'AL',
    'PRIVACY_FEATURE_ENABLED': false
  }))
])

const baseConfig = {
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
      '~utils': `${__dirname}/src/components/utils/`
    }
  },

  stats: { colors: true },

  node: {
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  },

  devtool: 'source-map'
};


const configDist = {
  ...baseConfig,

  entry: {
    onfido: './index.js',
    demo: './demo/demo.js'
  },

  output: {
    library: 'Onfido',
    libraryTarget: 'umd',
    path: `${__dirname}/dist`,
    publicPath: CONFIG.PUBLIC_PATH,
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

  plugins: [
    ...basePlugins('dist'),
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true,
      disable: !PRODUCTION_BUILD
    }),
    new HtmlWebpackPlugin({
        template: './demo/index.ejs',
        minify: { collapseWhitespace: true },
        inject: 'body',
        JWT_FACTORY: CONFIG.JWT_FACTORY,
        DESKTOP_SYNC_URL: CONFIG.DESKTOP_SYNC_URL,
        chunk: ['main','demo']
    }),
    ... PRODUCTION_BUILD ?
      [
        new UglifyJSPlugin({
          sourceMap: true,
          uglifyOptions: {
            compress: {
              pure_getters: true,
              unsafe: true,
              warnings: false,
            },
            output: {
              beautify: false,
            }
          }
        }),
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false
        })
      ] : []
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
      ...baseStyleRules(true)
    ]
  },
  plugins: [
    ...basePlugins('npm'),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ]
}

const smp = new SpeedMeasurePlugin();

export default [smp.wrap(configDist), configNpmLib]
