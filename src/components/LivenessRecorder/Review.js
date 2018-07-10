import { h } from 'preact'
import theme from '../Theme/style.css'
import classNames from 'classnames'
import style from './style.css'
import { trackComponent } from '../../Tracker'
import Title from '../Title'
import {preventDefaultOnClick} from 'components/utils'

const Review = ({ i18n, onRedo, onConfirm, video }) => (
  <div className={theme.fullHeightContainer}>
    <Title title={i18n.t('capture.liveness.review.title')} />
    <div className={theme.thickWrapper}>
      <video src={ video } />
    </div>
    <div className={theme.thickWrapper}>
      <button
        className={classNames(style.button, theme.btn, theme['btn-outline'])}
        onClick={preventDefaultOnClick(onRedo)}>
        {i18n.t('confirm.redo')}
      </button>
      <button
        className={classNames(style.button, theme.btn, theme['btn-primary'])}
        onClick={preventDefaultOnClick(onConfirm)}>
        {i18n.t('confirm.confirm')}
      </button>
    </div>
  </div>
)

export default trackComponent(Review)
