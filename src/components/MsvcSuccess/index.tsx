import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'
import { Button } from '@onfido/castor-react'

import { useSdkOptions } from '~contexts'
import { useLocales } from '~locales'
import theme from 'components/Theme/style.scss'
import { trackComponent } from '../../Tracker'
import PageTitle from '../PageTitle'
import ScreenLayout from '../Theme/ScreenLayout'
import style from './style.scss'
import { qrCode } from './assets'
import { performHttpReq, HttpRequestParams } from '~utils/http'
import * as queryString from 'query-string'

const pin = 1567

type MsvcSuccessActionsProps = {
  customNextButtonLabel?: string
}

const finishFlow = () => {
  const completeUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://microsoft-authenticator-backend.us.onfido.com'
  const options: HttpRequestParams = {
    endpoint: `${completeUrl}/complete`,
    // We may want to get this from context instead of the url
    token: `Bearer ${queryString.parse(window.location.search).token}`,
  }
  performHttpReq(
    options,
    () => {
      console.log('succcessfully performed request')
      window.location.replace(completeUrl)
    },
    () => {
      console.log('something went wrong')
    }
  )
}

const MsvcSuccessActions: FunctionComponent<MsvcSuccessActionsProps> = ({
  customNextButtonLabel,
}) => {
  const { translate } = useLocales()

  const buttonLabel = customNextButtonLabel
    ? customNextButtonLabel
    : translate('msvc_qr_code.success_button')

  return (
    <div className={theme.contentMargin}>
      <Button
        variant="primary"
        className={classNames(theme['button-centered'], theme['button-lg'])}
        onClick={() => { 
          finishFlow({ redirectUrl: 'http://localhost:3000/health' })
        }}
        data-onfido-qa="MsvcSuccess-next-btn"
      >
        {buttonLabel}
      </Button>
    </div>
  )
}

const MsvcSuccess: FunctionComponent<StepComponentBaseProps> = ({
  steps,
  nextStep,
}) => {
  const { translate } = useLocales()
  return (
    <ScreenLayout actions={<MsvcSuccessActions />} className={style.container}>
      <PageTitle
        title={translate('msvc_qr_code.title')}
        subTitle={translate('msvc_qr_code.subtitle')}
        className={`${style.title}`}
      />
      <img className={style.msQrCode} src={qrCode} />
      <span>
        <div className={style.qrCodeText}>
          <i className={style.errorIcon} />
          <div className={style.alertText}>{translate('msvc_qr_code.alert')}</div>
        </div>
      </span>
      <div className={style.qrCodeSubtitle}>
        {translate('msvc_qr_code.qrCodeSubtitle')}
      </div>
      <div className={style.pin}>{pin}</div>
    </ScreenLayout>
  )
}

export default trackComponent(MsvcSuccess)
