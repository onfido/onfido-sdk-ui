import { resolve, dirname, relative } from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { BASE_DIR } from './constants'

export const baseRules = () => {
  return [
    {
      test: /\.(js|ts)x?$/,
      use: {
        loader: 'babel-loader',
        options: { configFile: resolve(BASE_DIR, 'babel.config.js') },
      },
      resolve: {
        fullySpecified: false,
      },
      include: [
        resolve(BASE_DIR, 'src'),
        resolve(BASE_DIR, 'modules'),
        resolve(BASE_DIR, 'node_modules/@onfido/castor'),
        resolve(BASE_DIR, 'node_modules/@onfido/castor-react'),
        resolve(BASE_DIR, 'node_modules/@onfido/castor-icons'),
        resolve(BASE_DIR, 'node_modules/strip-ansi'),
        resolve(BASE_DIR, 'node_modules/ansi-regex'),
        resolve(BASE_DIR, 'node_modules/@sentry'),
      ],
    },
  ]
}

export const baseStyleRules = ({
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
    [rule]: [`${BASE_DIR}/node_modules`],
    use: [
      disableExtractToFile ? 'style-loader' : MiniCssExtractPlugin.loader,
      ...baseStyleLoaders(modules, withSourceMap),
    ],
  }))

const baseStyleLoaders = (modules: boolean, withSourceMap: boolean) => [
  //ref: https://github.com/unicorn-standard/pacomo The standard used for naming the CSS classes
  //ref: https://github.com/webpack/loader-utils#interpolatename The parsing rules used by webpack
  {
    loader: 'css-loader',
    options: {
      sourceMap: withSourceMap,
      modules: modules
        ? {
            getLocalIdent: (
              context: { resourcePath: string },
              _localIdentName: unknown,
              localName: string
            ) => {
              const basePath = relative(
                `${BASE_DIR}/src/components`,
                context.resourcePath
              )
              const baseDirFormatted = dirname(basePath).replace('/', '-')
              return `onfido-sdk-ui-${baseDirFormatted}-${localName}`
            },
          }
        : modules,
    },
  },
  // ref: https://github.com/onfido/onfido-sdk-ui/issues/1804
  // Note: The css vars polyfill (IE11) seems to only support :root vars
  {
    loader: 'string-replace-loader',
    options: {
      search: /color-scheme: light;/,
      replace: '',
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
