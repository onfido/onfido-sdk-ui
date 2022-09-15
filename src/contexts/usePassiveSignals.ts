import { useEffect, useState } from 'preact/hooks'

import useSdkConfigurationService from '~contexts/useSdkConfigurationService'
import { useSdkOptions } from '~contexts/useSdkOptions'
import { loadExternalScript } from '~utils/dynamicLoading'

const { PASSIVE_SIGNALS_URL } = process.env

export default function usePassiveSignals(token: string | undefined) {
  const sdkConfiguration = useSdkConfigurationService()
  const [sdkOptions] = useSdkOptions()

  const [tracker, setTracker] = useState<PassiveSignals.Tracker | undefined>(
    undefined
  )

  useEffect(() => {
    // Don't load the Passive Signals module by default
    const enabled =
      sdkConfiguration?.device_intelligence?.passive_signals?.enabled || false

    if (!enabled || !token || !PASSIVE_SIGNALS_URL) {
      return
    }

    loadExternalScript(PASSIVE_SIGNALS_URL, () => {
      if (window.OnfidoPassiveSignals) {
        const tracker = new window.OnfidoPassiveSignals({
          jwt: token,
          context: { disable_cookies: sdkOptions.disableAnalyticsCookies },
        })
        setTracker(tracker)
        tracker.track()
      }
    })

    return () => {
      // Stop all the connected tracers
      tracker?.stop()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return tracker
}
