import { h } from 'preact'
import Title from '../Title'
import theme from '../Theme/style.css'
import style from './style.css'
import {preventDefaultOnClick} from '../utils'
import { trackComponent } from '../../Tracker'

const localisedDescriptions = (i18n) =>
  [i18n.t('welcome.description_p_1'), i18n.t('welcome.description_p_2')]

const Welcome = ({title, descriptions, nextStep, i18n}) => {
  const welcomeTitle = title ? title : i18n.t('welcome.title')
  const welcomeDescriptions = descriptions ? descriptions : localisedDescriptions(i18n)
  return (
    <div>
      <button onClick={() => {throw new Error('This error should be tracked')}}>Click here to trigger an exception</button>
      <Title title={welcomeTitle} />
      <div className={theme.thickWrapper}>
        <div className={style.text}>
          {welcomeDescriptions.map(description => <p>{description}</p>)}
        </div>
        <button
          href=''
          className={`${theme.btn} ${theme["btn-centered"]} ${theme["btn-primary"]}`}
          onClick={preventDefaultOnClick(nextStep)}>
          {i18n.t('welcome.next_button')}
        </button>
      </div>
    </div>
  )
}

export default trackComponent(Welcome)
