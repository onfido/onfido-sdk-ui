import { h } from 'preact'
import classNames from 'classnames'
import theme from '../../Theme/style.css'
import style from './style.css'
import Title from '../../Title'
import {trackComponent} from '../../../Tracker'
import {preventDefaultOnClick} from '../../utils'

const Intro = ({i18n, nextStep}) => {
  return (
    <div className={theme.fullHeightContainer}>
      <Title title={i18n.t('proof_of_address.intro.title')} />
      <div className={classNames(theme.thickWrapper, style.content)}>
        <p>{i18n.t('proof_of_address.intro.requirements')}</p>
        {
          ['shows_address', 'matches_signup', 'is_recent'].map(key =>
            <div key={key} className={style.requirement}>
              {i18n.t(`proof_of_address.intro.${key}`)}
            </div>
          )
        }
      </div>
      <div className={theme.thickWrapper}>
        <button
          className={`${theme.btn} ${theme['btn-primary']} ${theme['btn-centered']}`}
          onClick={preventDefaultOnClick(nextStep)}
        >
        {i18n.t('proof_of_address.intro.start')}
        </button>
      </div>
    </div>
  )
}

export default trackComponent(Intro)
