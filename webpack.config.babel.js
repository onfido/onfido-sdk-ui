import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import autoprefixer from 'autoprefixer';
import customMedia from 'postcss-custom-media';
import url from 'postcss-url';

const ENV = process.env.NODE_ENV || 'development';

const baseRules = [{
  test: /\.jsx?$/,
  include: [
    `${__dirname}/src`,
    /*
    *  Necessary because preact-compat": "3.4.2" has babel in it,
    *  so webpack2 crashes on UglifyJsPlugin step
    *  see: https://github.com/developit/preact-compat/issues/155
    */
    `${__dirname}/node_modules/preact-compat/src`
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

const basePlugins = [
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(ENV),
      'ONFIDO_URL': JSON.stringify(process.env.ONFIDO_URL || 'https://apidev.onfido.com')
    }
  })
];

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

  devtool: ENV==='production' ? 'source-map' : 'eval-source-map'
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
      disable: ENV!=='production'
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: { collapseWhitespace: true }
    }),
    ... ENV === 'production' ?
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
