import { h, FunctionComponent } from 'preact'
import { useCallback, useContext, useState } from 'preact/compat'
import { useSelector } from 'react-redux'

import { LocaleContext } from '~locales'
import { uploadDocument } from '~utils/onfidoApi'
import Button from '../../Button'
import Spinner from '../../Spinner'
import style from './style.scss'

import type { RootState } from 'components/ReduxAppWrapper/store/reducers'
import type { ApiRequest } from '~types/api'
import type { CapturePayload } from '~types/redux'
import type { StepComponentDocumentProps } from '~types/routers'

export type Props = {
  onRedo: () => void
} & StepComponentDocumentProps

const Confirm: FunctionComponent<Props> = ({
  documentType,
  nextStep,
  onRedo,
  token,
}) => {
  const [loading, setLoading] = useState(false)
  const { translate } = useContext(LocaleContext)

  const apiUrl = useSelector<RootState, string>(
    (state) => state.globals.urls.onfido_api_url
  )
  const documentFront = useSelector<RootState, CapturePayload>(
    (state) => state.captures.document_front
  )
  const documentBack = useSelector<RootState, CapturePayload>(
    (state) => state.captures.document_back
  )

  const onUploadDocument = useCallback(async () => {
    setLoading(true)

    try {
      await uploadDocument(
        {
          file: documentFront.blob,
          sdkMetadata: documentFront.sdkMetadata,
          side: 'front',
          type: documentType,
        },
        apiUrl,
        token
      )

      await uploadDocument(
        {
          file: documentBack.blob,
          sdkMetadata: documentBack.sdkMetadata,
          side: 'back',
          type: documentType,
        },
        apiUrl,
        token
      )

      nextStep()
    } catch (apiRequest) {
      setLoading(false)
      const { response, status } = apiRequest as ApiRequest
      console.log('error:', { response, status })
    }
  }, [documentType, nextStep, token, apiUrl, documentFront, documentBack])

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
