import { h, FunctionComponent } from 'preact'
import { useContext, useState } from 'preact/compat'

import { LocaleContext } from '~locales'
import Button from '../../Button'
import Spinner from '../../Spinner'
import style from './style.scss'

import type { StepComponentDocumentProps } from '~types/routers'

export type Props = {
  onRedo: () => void
} & StepComponentDocumentProps

const Confirm: FunctionComponent<Props> = ({ onRedo }) => {
  const [loading, setLoading] = useState(false)
  const { translate } = useContext(LocaleContext)

  if (loading) {
    return (
      <div className={style.container}>
        <Spinner />
      </div>
    )
  }

  return (
    <div className={style.container}>
      <Button
        onClick={() => setLoading(true)}
        variants={['primary', 'lg', 'centered']}
      >
        {translate('doc_confirmation.button_primary_upload')}
      </Button>
      <Button onClick={onRedo} variants={['secondary', 'lg', 'centered']}>
        {translate('doc_confirmation.button_primary_redo')}
      </Button>
    </div>
  )
}

export default Confirm
