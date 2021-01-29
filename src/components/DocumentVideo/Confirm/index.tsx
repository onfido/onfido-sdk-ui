import { h, FunctionComponent } from 'preact'
import { useCallback, useContext, useState } from 'preact/compat'
import { useSelector } from 'react-redux'

import { LocaleContext } from '~locales'
import { uploadDocument } from '~utils/onfidoApi'
import Button from '../../Button'
import Spinner from '../../Spinner'
import style from './style.scss'

import type { RootState } from 'components/ReduxAppWrapper/store/reducers'
import type { CapturePayload } from '~types/redux'
import type { StepComponentDocumentProps } from '~types/routers'

export type Props = {
  onRedo: () => void
} & StepComponentDocumentProps

const Confirm: FunctionComponent<Props> = ({ documentType, onRedo, token }) => {
  const [loading, setLoading] = useState(false)
  const { translate } = useContext(LocaleContext)

  const apiUrl = useSelector<RootState, string>(
    (state) => state.globals.urls.onfido_api_url
  )
  const documentFront = useSelector<RootState, CapturePayload>(
    (state) => state.captures.document_front
  )

  const onUploadDocument = useCallback(() => {
    setLoading(true)
    const { blob, sdkMetadata } = documentFront
    uploadDocument(
      { file: blob, side: 'front', sdkMetadata, type: documentType },
      apiUrl,
      token,
      (apiResponse) => {
        console.log('response', apiResponse)
        setLoading(false)
      },
      (apiRequest) => console.log('request', apiRequest)
    )
  }, [apiUrl, documentFront, documentType, token])

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
        onClick={onUploadDocument}
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
