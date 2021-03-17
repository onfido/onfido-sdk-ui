import { useEffect, useState } from 'preact/compat'

import type { DocumentTypes } from '~types/steps'

export type RecordState =
  | 'hideButton'
  | 'showButton'
  | 'holdingStill'
  | 'success'

type RecordTransition = {
  state: RecordState
  transit: () => void
}

/**
 * For intro step:
 *  -> showButton (wait for next step)
 * For next steps (passport):
 *  -> hideButton (wait 3s)
 *  -> showButton (wait for click)
 *  -> holdingStill (wait 6s)
 *  -> success (wait for next step)
 * For next steps (other documents):
 *  -> hideButton (wait 3s)
 *  -> showButton (wait for click)
 *  -> success (wait next step)
 */
const useTransition = (
  documentType: DocumentTypes,
  stepNumber: number
): RecordTransition => {
  const [currentState, setCurrentState] = useState<RecordState>('hideButton')

  return {
    state: currentState,
    transit: () => console.log('transit'),
  }
}

export default useTransition
