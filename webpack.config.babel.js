import 'dotenv/config'
import webpack from 'webpack'
import packageJson from './package.json'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import Visualizer from 'webpack-visualizer-plugin2'
import { dirname, relative, resolve } from 'path'
import CopyPlugin from 'copy-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import nodeExternals from 'webpack-node-externals'

// NODE_ENV can be one of: development | staging | test | production
const NODE_ENV = process.env.NODE_ENV || 'production'

// TEST_ENV can be one of: undefined | deployment when NODE_ENV=test
const TEST_ENV = process.env.TEST_ENV

// For production, test, and staging we should build production ready code
// i.e. fully minified so that testing staging is as realistic as possible
const PRODUCTION_BUILD = NODE_ENV !== 'development'
const SDK_TOKEN_FACTORY_SECRET = process.env.SDK_TOKEN_FACTORY_SECRET || 'NA'
const SDK_ENV = process.env.SDK_ENV || 'idv'

const baseRules = () => {
  return [
    {
      test: /\.(js|ts)x?$/,
      use: [
        'thread-loader',
        {
          loader: 'babel-loader',
          options: { configFile: resolve('babel.config.js') },
        },
      ],
      resolve: {
        fullySpecified: false,
      },
      include: [
        resolve('src'),
        resolve('node_modules/@onfido/castor'),
        resolve('node_modules/@onfido/castor-react'),
        resolve('node_modules/@onfido/castor-icons'),
        resolve('node_modules/strip-ansi'),
        resolve('node_modules/ansi-regex'),
      ],
    },
  ]
}

const baseStyleLoaders = (modules, withSourceMap) => [
  //ref: https://github.com/unicorn-standard/pacomo The standard used for naming the CSS classes
  //ref: https://github.com/webpack/loader-utils#interpolatename The parsing rules used by webpack
  {
    loader: 'css-loader',
    options: {
      sourceMap: withSourceMap,
      modules: modules
        ? {
            getLocalIdent: (context, localIdentName, localName) => {
              const basePath = relative(
                `${__dirname}/src/components`,
                context.resourcePath
              )
              const baseDirFormatted = dirname(basePath).replace('/', '-')
              return `onfido-sdk-ui-${baseDirFormatted}-${localName}`
            },
          }
        : modules,
    },
  },
  ...(modules
    ? [
        {
          loader: 'postcss-loader',
          options: {
            // See postcss.config.js for plugins
            sourceMap: withSourceMap,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: withSourceMap,
          },
        },
      ]
    : []),
]

const baseStyleRules = ({
  disableExtractToFile = false,
  withSourceMap = true,
} = {}) =>
  [
    {
      rule: 'exclude',
      modules: true,
    },
    {
      rule: 'include',
      modules: false,
    },
  ].map(({ rule, modules }) => ({
    test: /\.(css|scss)$/,
    [rule]: [`${__dirname}/node_modules`],
    use: [
      disableExtractToFile ? 'style-loader' : MiniCssExtractPlugin.loader,
      ...baseStyleLoaders(modules, withSourceMap),
    ],
  }))

const WOOPRA_DEV_DOMAIN = 'dev-onfido-js-sdk.com'
const WOOPRA_DOMAIN = 'onfido-js-sdk.com'

const PROD_CONFIG = {
  ONFIDO_API_URL: 'https://api.onfido.com',
  ONFIDO_SDK_URL: 'https://sdk.onfido.com',
  ONFIDO_TERMS_URL: 'https://onfido.com/termsofuse',
  JWT_FACTORY: 'https://token-factory.onfido.com/sdk_token',
  US_JWT_FACTORY: 'https://token-factory.us.onfido.com/sdk_token',
  CA_JWT_FACTORY: 'https://token-factory.ca.onfido.com/sdk_token',
  DESKTOP_SYNC_URL: 'https://sync.onfido.com',
  MOBILE_URL: 'https://id.onfido.com',
  SMS_DELIVERY_URL: 'https://telephony.onfido.com',
  PUBLIC_PATH: `https://assets.onfido.com/web-sdk-releases/${packageJson.version}/`,
  USER_CONSENT_URL: 'https://assets.onfido.com/consent/user_consent.html',
  COUNTRY_FLAGS_SRC: 'https://assets.onfido.com/flags/',
  RESTRICTED_XDEVICE_FEATURE_ENABLED: true,
  WOOPRA_DOMAIN,
}

const TEST_DEPLOYMENT_CONFIG = {
  ...PROD_CONFIG,
  PUBLIC_PATH: '/',
  MOBILE_URL: '/',
  WOOPRA_DOMAIN: WOOPRA_DEV_DOMAIN,
}

const TEST_E2E_CONFIG = {
  ...TEST_DEPLOYMENT_CONFIG,
  ONFIDO_API_URL: 'https://localhost:8082/api',
  JWT_FACTORY: 'https://localhost:8082/token-factory/sdk_token',
  US_JWT_FACTORY: 'https://localhost:8082/token-factory/sdk_token',
  CA_JWT_FACTORY: 'https://localhost:8082/token-factory/sdk_token',
  SMS_DELIVERY_URL: 'https://localhost:8080/telephony',
  RESTRICTED_XDEVICE_FEATURE_ENABLED: false,
}

const STAGING_CONFIG = {
  ONFIDO_API_URL: 'https://api.eu-west-1.dev.onfido.xyz',
  ONFIDO_SDK_URL: 'https://mobile-sdk.eu-west-1.dev.onfido.xyz',
  ONFIDO_TERMS_URL: 'https://dev.onfido.com/termsofuse',
  JWT_FACTORY: 'https://sdk-token-factory.eu-west-1.dev.onfido.xyz/sdk_token',
  US_JWT_FACTORY:
    'https://sdk-token-factory.eu-west-1.dev.onfido.xyz/sdk_token',
  CA_JWT_FACTORY:
    'https://sdk-token-factory.eu-west-1.dev.onfido.xyz/sdk_token',
  DESKTOP_SYNC_URL: 'https://cross-device-sync.eu-west-1.dev.onfido.xyz',
  MOBILE_URL: '/',
  SMS_DELIVERY_URL: 'https://telephony.eu-west-1.dev.onfido.xyz',
  PUBLIC_PATH: '/',
  USER_CONSENT_URL: 'https://assets.onfido.com/consent/user_consent.html',
  COUNTRY_FLAGS_SRC: 'https://assets.onfido.com/flags/',
  RESTRICTED_XDEVICE_FEATURE_ENABLED: false,
  WOOPRA_DOMAIN: WOOPRA_DEV_DOMAIN,

  // @TODO: clean-up this config when v4 APIs are live
  USE_V4_APIS_FOR_DOC_VIDEO: process.env.USE_V4_APIS_FOR_DOC_VIDEO,
}

const DEVELOPMENT_CONFIG = {
  ...PROD_CONFIG,
  PUBLIC_PATH: '/',
  MOBILE_URL: '/',
  RESTRICTED_XDEVICE_FEATURE_ENABLED: false,
  WOOPRA_DOMAIN: WOOPRA_DEV_DOMAIN,
}

const CONFIG_MAP = {
  development: DEVELOPMENT_CONFIG,
  staging: STAGING_CONFIG,
  test: TEST_ENV === 'deployment' ? TEST_DEPLOYMENT_CONFIG : TEST_E2E_CONFIG,
  production: PROD_CONFIG,
}

const CONFIG = CONFIG_MAP[NODE_ENV]

const formatDefineHash = (defineHash) => {
  const formatted = {}
  Object.entries(defineHash).forEach(([key, value]) => {
    formatted[`process.env.${key}`] = JSON.stringify(value)
  })
  return formatted
}
const WOOPRA_WINDOW_KEY = 'onfidoSafeWindow8xmy484y87m239843m20'

const basePlugins = (bundle_name = '') => [
  new Visualizer({
    filename: `./reports/statistics.html`,
  }),
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false,
    reportFilename: `${__dirname}/dist/reports/bundle_${
      bundle_name === 'npm' ? 'npm_size.html' : `${SDK_ENV}_dist_size.html`
    }`,
    defaultSizes: 'gzip',
  }),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin(
    formatDefineHash({
      ...CONFIG,
      NODE_ENV,
      SDK_ENV,
      PRODUCTION_BUILD,
      SDK_VERSION: packageJson.version,
      SDK_SOURCE: 'onfido_web_sdk',
      // We use a Base 32 version string for the cross-device flow, to make URL
      // string support easier...
      // ref: https://en.wikipedia.org/wiki/Base32
      // NOTE: please leave the BASE_32_VERSION be! It is updated automatically by
      // the release script 🤖
      BASE_32_VERSION: 'DK',
      PRIVACY_FEATURE_ENABLED: false,
      JWT_FACTORY: CONFIG.JWT_FACTORY,
      US_JWT_FACTORY: CONFIG.US_JWT_FACTORY,
      CA_JWT_FACTORY: CONFIG.CA_JWT_FACTORY,
      SDK_TOKEN_FACTORY_SECRET,
      WOOPRA_WINDOW_KEY,
      WOOPRA_IMPORT: `imports-loader?this=>Window.prototype["${WOOPRA_WINDOW_KEY}"],window=>Window.prototype["${WOOPRA_WINDOW_KEY}"]!wpt/wpt.js`,
    })
  ),
]

const baseConfig = {
  mode: PRODUCTION_BUILD ? 'production' : 'development',
  context: `${__dirname}/src`,
  entry: './index.tsx',

  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.scss', '.json'],
    modules: [`${__dirname}/node_modules`, `${__dirname}/src`],
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      '~contexts': `${__dirname}/src/contexts`,
      '~locales': `${__dirname}/src/locales`,
      '~types': `${__dirname}/src/types`,
      '~utils': `${__dirname}/src/components/utils`,
      '~supported-documents': `${__dirname}/src/supported-documents`,
      '~auth-sdk': `${__dirname}/auth-sdk/FaceTec`,
      'socket.io-client': resolve(
        'node_modules/socket.io-client/dist/socket.io.js'
      ),
    },
  },

  stats: {
    preset: PRODUCTION_BUILD ? 'errors-warnings' : 'normal',
    errorDetails: PRODUCTION_BUILD,
    colors: true,
    // Display bailout reasons
    optimizationBailout: false,
  },

  node: {
    global: true,
    __filename: false,
    __dirname: false,
  },

  devtool: PRODUCTION_BUILD ? 'source-map' : 'eval-cheap-module-source-map',
}

const configDist = () => ({
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
    path: `${__dirname}/dist`,
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
    splitChunks: {
      cacheGroups: {
        defaultVendors: false,
      },
    },
    minimizer: minimizer(true),
  },
  plugins: [
    ...basePlugins(),
    ...(SDK_ENV === 'Auth'
      ? [
          new CopyPlugin({
            patterns: [
              {
                from: `${__dirname}/auth-sdk`,
                to: `${__dirname}/dist/auth-sdk`,
              },
            ],
          }),
        ]
      : []),
    // see MiniCssExtractPlugin on the bottom of the file...
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
    allowedHosts: 'all', // necessary to test in IE with virtual box, since it goes through a proxy, see: https://github.com/webpack/webpack-dev-server/issues/882
    devMiddleware: {
      publicPath: '/',
    },
  },
})

const minimizer = (banner = false) =>
  PRODUCTION_BUILD
    ? [
        new TerserPlugin({
          parallel: true,
          extractComments: false,
        }),
        banner &&
          new webpack.BannerPlugin({
            banner: () => {
              return `Onfido${SDK_ENV === 'Auth' ? SDK_ENV : 'IDV'} SDK ${
                packageJson.version
              }`
            },
          }),
      ].filter(Boolean)
    : []

const configNpmLib = () => ({
  ...baseConfig,
  name: 'npm-library',
  output: {
    library: {
      type: 'umd',
    },
    path: `${__dirname}/lib`,
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
        file: resolve('package.json'),
        excludeFromBundle: ['dependencies'],
      },
    }),
  ],
})

// Workaround for https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/167
const smp = new SpeedMeasurePlugin()
const configWithSpeedMeasures = smp.wrap(configDist())
configWithSpeedMeasures.plugins.unshift(
  new MiniCssExtractPlugin({
    filename: 'style.css',
    chunkFilename: `onfido${SDK_ENV === 'Auth' ? SDK_ENV : ''}.[name].css`,
  })
)

export default SDK_ENV === 'Auth'
  ? [configWithSpeedMeasures]
  : [configWithSpeedMeasures, configNpmLib()]
