import webpack from 'webpack'
import packageJson from '../../package.json'
import TerserPlugin from 'terser-webpack-plugin'

import { PRODUCTION_BUILD, SDK_ENV } from './constants'

export const minimizer = (banner = false) =>
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
