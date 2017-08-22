import webpack from 'webpack';
import packageJson from './package.json'
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import customMedia from 'postcss-custom-media';
import url from 'postcss-url';
import mapObject from 'object-loops/map'
import mapKeys from 'object-loops/map-keys'

// ENV can be one of: development | staging | production
const ENV = process.env.NODE_ENV || 'production'
// For production and staging we should build production ready code i.e. fully
// minified so that testing staging is as realistic as possible
const PRODUCTION_BUILD = ENV !== 'development'
const WEBPACK_ENV = PRODUCTION_BUILD ? 'production' : 'development'
// For production we should use the production API, for staging and development
// we should use the staging API
const PRODUCTION_API = ENV === 'production'
const DEV_OR_STAGING = ENV !== 'production'

const baseRules = [{
  test: /\.jsx?$/,
  include: [
    `${__dirname}/src`
  ],
  use: ['babel-loader']
},
{
  test: /\.json$/,
  use: ['json-loader']
},
{
  test: /\.(xml|txt|md)$/,
  use: ['raw-loader']
}];

const baseStyleLoaders = [
  //ref: https://github.com/unicorn-standard/pacomo The standard used for naming the CSS classes
  //ref: https://github.com/webpack/loader-utils#interpolatename The parsing rules used by webpack
  {
    loader: 'css-loader',
    options: {
      sourceMap: true,
      modules: true,
      localIdentName: 'onfido-sdk-ui-[folder]-[local]'
    }
  },
  {
    loader: `postcss-loader`,
    options: {
      plugins: loader => [
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

const PROD_CONFIG = {
  'ONFIDO_API_URL': 'https://api.onfido.com',
  'ONFIDO_SDK_URL': 'https://sdk.onfido.com',
  'JWT_FACTORY': 'https://sdk-jwt-factory-production.herokuapp.com/api/v2',
  'DESKTOP_SYNC_URL' : 'https://onfido-desktop-sync.herokuapp.com',
}

const STAGING_CONFIG = {
  'ONFIDO_API_URL': 'https://apidev.onfido.com',
  'ONFIDO_SDK_URL': 'https://sdk-staging.onfido.com',
  'JWT_FACTORY': 'https://sdk-jwt-factory-staging.herokuapp.com/api/v2',
  'DESKTOP_SYNC_URL' : 'https://onfido-desktop-sync.herokuapp.com',
}

const CONFIG = PRODUCTION_API ? PROD_CONFIG : STAGING_CONFIG

const formatDefineHash = defineHash =>
  mapObject(
    mapKeys(defineHash, key => `process.env.${key}`),
    value => JSON.stringify(value)
  )

const basePlugins = [
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin(formatDefineHash({
    'NODE_ENV': WEBPACK_ENV,
    'ONFIDO_API_URL': CONFIG.ONFIDO_API_URL,
    'ONFIDO_SDK_URL': CONFIG.ONFIDO_SDK_URL,
    'SDK_VERSION': packageJson.version,
    'WOOPRA_DOMAIN': `${DEV_OR_STAGING ? 'dev-':''}onfido-js-sdk.com`,
    'URL_SHORTENER_KEY': 'AIzaSyBkO0zZdL0VNZ1qW1swjAcPJ8H4n4F8104',
    'DESKTOP_SYNC_URL': CONFIG.DESKTOP_SYNC_URL,
  }))
]

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
      'react-modal': 'react-modal-onfido'
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

  devtool: PRODUCTION_BUILD ? 'source-map' : 'eval-source-map'
};


const configDist = {
  ...baseConfig,

  output: {
    library: 'Onfido',
    libraryTarget: 'umd',
    path: `${__dirname}/dist`,
    publicPath: '/',
    filename: 'onfido.min.js'
  },

  module: {
    rules: [
      ...baseRules,
      {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: baseStyleLoaders
        })
      },
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        use: ['file-loader?name=images/[name]_[hash:base64:5].[ext]']
      },
      {
        test: /\.html$/,
        use: ['html-loader?interpolate']
      }
    ]
  },

  plugins: [
    ...basePlugins,
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true,
      disable: !PRODUCTION_BUILD
    }),
    new HtmlWebpackPlugin({
        template: './index.ejs',
        minify: { collapseWhitespace: true },
        inject: 'body',
        JWT_FACTORY: CONFIG.JWT_FACTORY,
        DESKTOP_SYNC_URL: CONFIG.DESKTOP_SYNC_URL,
    }),
    ... PRODUCTION_BUILD ?
      [
        new webpack.optimize.UglifyJsPlugin({
          beautify: false,
          sourceMap: true,
          compress: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            screw_ie8: true,
            warnings: false,
            unused: true,
            dead_code: true
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
      {
        test: /\.(less|css)$/,
        use: ['style-loader',...baseStyleLoaders]
      }
    ]
  },
  plugins: basePlugins
}

export default [configDist, configNpmLib]
