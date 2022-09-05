// @ts-nocheck
import 'dotenv/config'
import runMorph from './build/morph/build.morph'

import { configDist } from './build/webpack/configs/dist.config'
import { configLib } from './build/webpack/configs/lib.config'
import { SDK_ENV } from './build/webpack/constants'

if (process.env.HOT_RELOAD_ENABLED !== 'true') {
  console.log('Running morph')
  runMorph()
  console.log('Completed morph')
}

const distConfig = configDist()

// Note: Enable when you want to test the webpack speed. This breaks all morph injections.
// const measurePlugin = new SpeedMeasurePlugin()
// Workaround for https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/167
// const distConfigWithSpeedMeasures = measurePlugin.wrap(distConfig)
// distConfigWithSpeedMeasures.plugins.push(miniCssExtractPlugin)

export default SDK_ENV === 'Auth' ? [distConfig] : [distConfig, configLib()]
