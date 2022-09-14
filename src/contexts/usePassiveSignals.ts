import { useEffect, useState } from 'preact/hooks'

import useSdkConfigurationService from '~contexts/useSdkConfigurationService'
import { loadExternalScript } from '~utils/dynamicLoading'

const { PASSIVE_SIGNALS_URL } = process.env

export default function usePassiveSignals(token: string | undefined) {
  const sdkConfiguration = useSdkConfigurationService()

  const [passiveSignalsTracker, setPassiveSignalsTracker] = useState<
    PassiveSignals.Tracker | undefined
  >(undefined)

  useEffect(() => {
    // Don't load the Passive Signals module by default
    const enabled =
      sdkConfiguration?.device_intelligence?.passive_signals?.enabled || false

    if (!enabled || !token || !PASSIVE_SIGNALS_URL) {
      return
    }

    loadExternalScript(PASSIVE_SIGNALS_URL, () => {
      if (window.PassiveSignalTracker) {
        const tracker = new window.PassiveSignalTracker({ jwt: token })
        setPassiveSignalsTracker(tracker)
        tracker.track()
      }
    })

    return () => {
      // Stop all the connected tracers
      passiveSignalsTracker?.stop()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return passiveSignalsTracker
}
