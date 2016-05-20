import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import customMedia from 'postcss-custom-media';
import url from 'postcss-url';

const ENV = process.env.NODE_ENV || 'development';

const CSS_MAPS = ENV!=='production';

const config = {
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
      'react-dom': 'preact-compat'
    }
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.(less|css)$/,
        include: /src\/components\//,
        loader: ExtractTextPlugin.extract('style?singleton', [
          `css?sourceMap=${CSS_MAPS}`,
          'postcss',
          `less?sourceMap=${CSS_MAPS}`
        ].join('!'))
      },
      {
        test: /\.(less|css)$/,
        exclude: /src\/components\//,
        loader: ExtractTextPlugin.extract('style?singleton', [
          `css?sourceMap=${CSS_MAPS}`,
          `postcss`,
          `less?sourceMap=${CSS_MAPS}`
        ].join('!'))
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(xml|html|txt|md)$/,
        loader: 'raw'
      },
      {
        test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
        loader: ENV==='production' ? 'file?name=[path][name]_[hash:base64:5].[ext]' : 'url'
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
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('style.css', {
      allChunks: true,
      disable: ENV!=='production'
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV)
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
    contentBase: './src',
    historyApiFallback: true
  }
};

if (ENV === 'production') {
  config.plugins.push(
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

export default config
