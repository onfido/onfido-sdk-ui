import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import customMedia from 'postcss-custom-media';
import url from 'postcss-url';

const ENV = process.env.NODE_ENV || 'development';

const CSS_MAPS = ENV!=='production';

const baseLoaders = [{
  test: /\.jsx?$/,
  exclude: /node_modules/,
  loader: 'babel'
},
{
  test: /\.json$/,
  loader: 'json'
},
{
  test: /\.(xml|txt|md)$/,
  loader: 'raw'
}];

const styleBaseLoaders = [
  //ref: https://github.com/unicorn-standard/pacomo The standard used for naming the CSS classes
  //ref: https://github.com/webpack/loader-utils#interpolatename The parsing rules used by webpack
  'css-loader?sourceMap=${CSS_MAPS}&modules&localIdentName=onfido-sdk-ui-[folder]-[local]',
  `postcss-loader`,
  `less?sourceMap=${CSS_MAPS}`
];

const basePlugins = [
  new webpack.NoErrorsPlugin(),
  new webpack.optimize.DedupePlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(ENV)
  })
];

if (ENV === 'production') {
  basePlugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      }
    })
  )
}

const configDist = {
  context: `${__dirname}/src`,
  entry: './index.js',

  output: {
    library: 'Onfido',
    libraryTarget: 'umd',
    path: `${__dirname}/dist`,
    publicPath: '/',
    filename: 'onfido.min.js'
  },

  resolve: {
    extensions: ['', '.jsx', '.js', '.json', '.less'],
    modulesDirectories: [
      `${__dirname}/src/lib`,
      `${__dirname}/node_modules`,
      `${__dirname}/src`,
      'node_modules'
    ],
    alias: {
      components: `${__dirname}/src/components`,    // used for tests
      style: `${__dirname}/src/style`,
      'react': 'preact-compat',
      'react-dom': 'preact-compat',
      'react-modal': 'react-modal-onfido'
    }
  },

  module: {
    loaders: [
      ...baseLoaders,
      {
        test: /\.(less|css)$/,
        loader: ExtractTextPlugin.extract('style-loader', styleBaseLoaders.join('!'))
      },
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        loader: 'file?name=images/[name]_[hash:base64:5].[ext]'
      },
      {
        test: /\.html$/,
        loader: 'html-loader?interpolate'
      }
    ]
  },

  postcss: () => [
    customMedia(),
    autoprefixer({ browsers: 'last 2 versions' }),
    url({
      url: "inline"
    })
  ],

  plugins: ([
    ...basePlugins,
    new ExtractTextPlugin('style.css', {
      allChunks: true,
      disable: ENV!=='production'
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: { collapseWhitespace: true }
    })
  ]).concat(ENV==='production' ? [
    new webpack.optimize.OccurenceOrderPlugin()
  ] : []),

  stats: { colors: true },

  node: {
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  },

  devtool: ENV==='production' ? 'source-map' : 'cheap-module-eval-source-map',

  devServer: {
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    colors: true,
    publicPath: '/',
    contentBase: './dist',
    historyApiFallback: true
  }
};



const configNpmLib = {
  ...configDist,
  name: 'npm-library',
  output: {
    libraryTarget: 'commonjs2',
    path: `${__dirname}/lib`,
    target: 'web',
    filename: 'index.js'
  },
  module: {
    loaders: [
      ...baseLoaders,
      {
        test: /\.(less|css)$/,
        loader: ['style-loader',...styleBaseLoaders].join('!')
      }
    ]
  },
  plugins: [
    ...basePlugins
  ].concat(ENV==='production' ? [new webpack.optimize.OccurenceOrderPlugin()] : []),
  devServer: undefined
}

export default [configDist,configNpmLib]
