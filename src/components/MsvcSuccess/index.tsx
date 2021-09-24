import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'
import { Button } from '@onfido/castor-react'

import { useLocales } from '~locales'
import theme from 'components/Theme/style.scss'
import { trackComponent } from '../../Tracker'
import PageTitle from '../PageTitle'
import ScreenLayout from '../Theme/ScreenLayout'
import style from './style.scss'
import { qrCode } from './assets'
import { performHttpReq, HttpRequestParams } from '~utils/http'
import { StepComponentBaseProps } from '~types/routers'

const pin = 1567

type MsvcSuccessActionsProps = {
  onFinishFlow: () => void
}

type Props = {
  rpJwt: string
  msQrCode: string
  msPin: string
} & StepComponentBaseProps

const finishFlow = (rpToken: string) => {
  const completeUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://microsoft-authenticator-backend.us.onfido.com'
  const options: HttpRequestParams = {
    endpoint: `${completeUrl}/complete`,
    // this should be passed in as a set up variable
    token: `Bearer ${rpToken}`,
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
  onFinishFlow = finishFlow,
}) => {
  const { translate } = useLocales()

  return (
    <div className={theme.contentMargin}>
      <Button
        variant="primary"
        className={classNames(theme['button-centered'], theme['button-lg'])}
        onClick={() => {
          onFinishFlow
        }}
        data-onfido-qa="msvcSuccess-next-btn"
      >
        {translate('msvc_qr_code.success_button')}
      </Button>
    </div>
  )
}

const MsvcSuccess: FunctionComponent<Props> = ({
  rpJwt,
  msQrCode = qrCode,
  msPin = pin,
}) => {
  const { translate } = useLocales()

  const actions = (
    <MsvcSuccessActions
      onFinishFlow={() => {
        finishFlow(rpJwt)
      }}
    />
  )
  return (
    <ScreenLayout actions={actions} className={style.container}>
      <PageTitle
        title={translate('msvc_qr_code.title')}
        subTitle={translate('msvc_qr_code.subtitle')}
        className={`${style.title}`}
      />
      <img className={style.msQrCode} src={msQrCode} />
      <span>
        <div className={style.qrCodeText}>
          <i className={style.errorIcon} />
          <div className={style.alertText}>
            {translate('msvc_qr_code.alert')}
          </div>
        </div>
      </span>
      <div className={style.qrCodeSubtitle}>
        {translate('msvc_qr_code.qrCodeSubtitle')}
      </div>
      <div className={style.pin}>{msPin}</div>
    </ScreenLayout>
  )
}

export default trackComponent(MsvcSuccess)
