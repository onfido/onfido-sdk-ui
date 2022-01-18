import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'
import { Button } from '@onfido/castor-react'

import ScreenLayout from '../../Theme/ScreenLayout'
import PageTitle from '../../PageTitle'
import { trackComponent } from '../../../Tracker'
import { useLocales } from '~locales'
import theme from '../../Theme/style.scss'
import style from './style.scss'

import type { StepComponentBaseProps } from '~types/routers'

type Props = {
  crossDeviceClientIntroProductName?: string
  crossDeviceClientIntroProductLogoSrc?: string
  nextStep: () => void
} & StepComponentBaseProps

const CrossDeviceClientIntro: FunctionComponent<Props> = ({
  nextStep,
  crossDeviceClientIntroProductName,
  crossDeviceClientIntroProductLogoSrc,
}) => {
  const { translate } = useLocales()
  const defaultSubtitle = translate('cross_device_session_linked.subtitle')
  const subtitle = crossDeviceClientIntroProductName
    ? [defaultSubtitle, crossDeviceClientIntroProductName].join(' ')
    : defaultSubtitle
  return (
    <ScreenLayout
      pageId={'CrossDeviceClientIntro'}
      actions={
        <Button
          type="button"
          variant="primary"
          className={classNames(theme['button-centered'], theme['button-lg'])}
          onClick={nextStep}
          data-onfido-qa="client-session-linked-primary-btn"
        >
          {translate('cross_device_session_linked.button_primary')}
        </Button>
      }
      className={style.container}
    >
      <PageTitle
        title={translate('cross_device_session_linked.title')}
        subTitle={subtitle}
        className={style.pageTitle}
      />
      <div className={style.content}>
        {crossDeviceClientIntroProductLogoSrc ? (
          <img
            className={classNames(theme.icon, style.customIcon)}
            src={crossDeviceClientIntroProductLogoSrc}
            alt="Brand logo"
          />
        ) : (
          <div className={classNames(theme.icon, style.icon)} />
        )}
        <div
          className={classNames(theme.header, style.header)}
          role="heading"
          aria-level="3"
        >
          {translate('cross_device_session_linked.info')}
        </div>
        <div className={classNames(theme.help, style.help)}>
          <ol
            className={theme.helpList}
            aria-label={translate('cross_device_session_linked.info')}
          >
            <li>
              {translate('cross_device_session_linked.list_item_sent_by_you')}
            </li>
            <li>
              {translate('cross_device_session_linked.list_item_desktop_open')}
            </li>
          </ol>
        </div>
      </div>
    </ScreenLayout>
  )
}

export default trackComponent(
  CrossDeviceClientIntro,
  'crossDevice_client_intro'
)
