import { h } from 'preact'
import theme from '../Theme/style.css'
import classNames from 'classnames'
import style from './style.css'
import { trackComponent } from '../../Tracker'
import Title from '../Title'
import {preventDefaultOnClick} from 'components/utils'

const Intro = ({ i18n, onNext }) => (
  <div className={theme.fullHeightContainer}>
    <Title title={i18n.t('capture.liveness.intro.title')} />
    <div className={theme.thickWrapper}>
      <ul className={style.bullets}>
      {
        ['two_actions', 'speak_out_loud'].map(key =>
          <li key={key} className={style.bullet}>
            <span className={style[`${key}Icon`]} />
            {i18n.t(`capture.liveness.intro.${key}`)}
          </li>
        )
      }
      </ul>
    </div>
    <div className={theme.thickWrapper}>
      <button
        className={classNames(style.button, theme.btn, theme['btn-primary'])}
        onClick={preventDefaultOnClick(onNext)}>
        {i18n.t('capture.liveness.intro.continue')}
      </button>
    </div>
  </div>
)

export default trackComponent(Intro)
