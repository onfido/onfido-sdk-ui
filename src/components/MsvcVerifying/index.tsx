import { h, FunctionComponent } from 'preact'

import { useLocales } from '~locales'
import ScreenLayout from '../Theme/ScreenLayout'
import style from './style.scss'
import Spinner from '../Spinner'

import PageTitle from '../PageTitle'

const MsvcVerifying: FunctionComponent = () => {
  const { translate } = useLocales()

  return (
    <ScreenLayout className={style.screen}>
      <div className={style.spinner}>
        <Spinner />
      </div>
      <PageTitle
        className={style.container}
        title={translate(`msvc_verifying.title`)}
        subTitle={translate('msvc_verifying.subtitle')}
      />
    </ScreenLayout>
  )
}

export default MsvcVerifying