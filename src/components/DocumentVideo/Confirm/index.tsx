import { h, FunctionComponent } from 'preact'
import { useCallback, useContext, useState } from 'preact/compat'
import { useSelector } from 'react-redux'

import { LocaleContext } from '~locales'
import { uploadDocument } from '~utils/onfidoApi'
import Button from '../../Button'
import Spinner from '../../Spinner'
import style from './style.scss'

import type { RootState } from 'components/ReduxAppWrapper/store/reducers'
import type { ApiResponse, ApiRequest } from '~types/api'
import type { DocumentSides } from '~types/commons'
import type { CapturePayload } from '~types/redux'
import type { StepComponentDocumentProps } from '~types/routers'
import type { DocumentTypes } from '~types/steps'

export type Props = {
  onRedo: () => void
} & StepComponentDocumentProps

const promisifiedUploadDocument = (
  type: DocumentTypes,
  side: DocumentSides,
  payload: CapturePayload,
  url: string,
  token: string
): Promise<ApiResponse> =>
  new Promise((resolve, reject) => {
    const { blob: file, sdkMetadata } = payload

    uploadDocument(
      { file, side, sdkMetadata, type },
      url,
      token,
      (apiResponse) => resolve(apiResponse),
      (apiRequest) => reject(apiRequest)
    )
  })

const Confirm: FunctionComponent<Props> = ({ documentType, onRedo, token }) => {
  const [loading, setLoading] = useState(false)
  const { translate } = useContext(LocaleContext)

  const apiUrl = useSelector<RootState, string>(
    (state) => state.globals.urls.onfido_api_url
  )
  const documentFront = useSelector<RootState, CapturePayload>(
    (state) => state.captures.document_front
  )

  const onUploadDocument = useCallback(async () => {
    setLoading(true)

    try {
      const response = await promisifiedUploadDocument(
        documentType,
        'front',
        documentFront,
        apiUrl,
        token
      )
      console.log('response', response)
      setLoading(false)
    } catch (apiRequest) {
      const { response, status } = apiRequest as ApiRequest
      console.log('error:', { response, status })
    }
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
