import { h, FunctionComponent } from 'preact'
import { memo, useEffect, useRef, useState } from 'preact/compat'
import { UIConfigs } from './demoUtils'

import { ServerRegions, SdkHandle, SdkOptions } from '~types/sdk'

/*
The SDK can be consumed either via npm or via global window.
Via npm there are also two ways, via commonjs require or via ES import.
In this case we will use the import via the global `window`.

Alternative import styles:
"commonjs" import style
const Onfido = require('../index')
"es" import style
import * as Onfido from '../index'
*/

const Onfido = window.Onfido || window.OnfidoAuth
/*
  NOTE: For Auth local build, if you get a TypeError in the console saying "Cannot read property 'init' of undefined"
        try using a different import method like import * as Onfido from '../index'
*/

type Props = {
  options: SdkOptions | UIConfigs
  regionCode: ServerRegions
  url: string
  workflow: boolean
}

const SdkMount: FunctionComponent<Props> = ({
  options,
  regionCode,
  url,
  workflow,
}) => {
  const [onfidoSdk, setOnfidoSdk] = useState<SdkHandle | undefined>(undefined)
  const mountEl = useRef(null)

  /**
   * This side effect should run once after the component mounted,
   * and should execute the clean-up function when the component unmounts.
   */
  useEffect(() => {
    if (!(options as SdkOptions).mobileFlow) {
      console.log(
        '* JWT Factory URL:',
        url,
        'for',
        regionCode,
        'in',
        process.env.NODE_ENV
      )
    }

    console.log('Calling `Onfido.init` with the following options:', options)

    if (mountEl.current) {
      const sdk = Onfido.init({
        ...options,
        containerEl: mountEl.current,
      })

      setOnfidoSdk(sdk)

      window.onfidoSdkHandle = sdk
    }

    return () => onfidoSdk && onfidoSdk.tearDown()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!onfidoSdk) {
      return
    }

    if (options.tearDown) {
      onfidoSdk.tearDown()
    } else {
      onfidoSdk.setOptions(options)
    }
  }, [options, onfidoSdk])

  return <div ref={mountEl} />
}

export default memo(SdkMount)
