import { h } from 'preact'
import Title from '../Title'
import theme from '../Theme/style.css'
import style from './style.css'
import {preventDefaultOnClick} from '../utils'
import { trackComponent } from '../../Tracker'

const Welcome = ({title, descriptions, nextButton, nextStep}) =>
  <div>
    <Title title={title} />
    <div className={theme.thickWrapper}>
      <div className={style.text}>
        {descriptions.map(description => <p>{description}</p>)}
      </div>
      <button
        href=''
        className={`${theme.btn} ${theme["btn-centered"]} ${theme["btn-primary"]}`}
        onClick={preventDefaultOnClick(nextStep)}>
        {nextButton}
      </button>
    </div>
  </div>

Welcome.defaultProps =  {
  title: 'Open your new bank account',
  descriptions: [
    'To open a bank account, we will need to verify your identity.',
    'It will only take a couple of minutes.'
  ],
  nextButton:'Verify Identity'
}

export default trackComponent(Welcome)
