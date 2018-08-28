import { h } from 'preact'
import Title from '../Title'
import theme from '../Theme/style.css'
import style from './style.css'
import {preventDefaultOnClick} from '../utils'
import { trackComponent } from '../../Tracker'
import {localised} from '../../locales'

const localisedDescriptions = t =>
  [t('welcome.description_p_1'), t('welcome.description_p_2')]

const Welcome = ({title, descriptions, nextStep, t}) => {
  const welcomeTitle = title ? title : t('welcome.title')
  const welcomeDescriptions = descriptions ? descriptions : localisedDescriptions(t)
  return (
    <div>
      <Title title={welcomeTitle} />
      <div className={theme.thickWrapper}>
        <div className={style.text}>
          {welcomeDescriptions.map(description => <p>{description}</p>)}
        </div>
        <button
          href=''
          className={`${theme.btn} ${theme["btn-centered"]} ${theme["btn-primary"]}`}
          onClick={preventDefaultOnClick(nextStep)}>
          {t('welcome.next_button')}
        </button>
      </div>
    </div>
  )
}

export default trackComponent(localised(Welcome))
