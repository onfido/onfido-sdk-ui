import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'
import { useLocales } from '~locales'
import { Button } from '@onfido/castor-react'
import PageTitle from 'components/PageTitle'
import ScreenLayout from '../Theme/ScreenLayout'
import theme from 'components/Theme/style.scss'
import style from './style.scss'

type ActionsProps = {
  onPrimaryButtonClick(): void
}

const LoadError: FunctionComponent<ActionsProps> = ({
  onPrimaryButtonClick,
}) => {
  const { translate } = useLocales()
  return (
    <ScreenLayout
      actions={
        <Button
          type="button"
          variant="primary"
          className={classNames(theme['button-centered'], theme['button-lg'])}
          onClick={onPrimaryButtonClick}
          data-onfido-qa="userConsentReloadScreenBtn"
        >
          {translate('user_consent_load_fail.button_primary')}
        </Button>
      }
    >
      <div className={style.contentFlexbox}>
        <div>
          <i className={`${theme.icon} ${style.errorIcon}`} />
          <PageTitle
            title={translate('user_consent_load_fail.title')}
            subTitle={translate('user_consent_load_fail.detail')}
          />
        </div>
      </div>
    </ScreenLayout>
  )
}

export default LoadError
