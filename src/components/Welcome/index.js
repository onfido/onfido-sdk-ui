import { h, Component } from 'preact'
import theme from '../Theme/style.css'
import style from './style.css'

const Welcome = ({title, descriptions, nextButton, nextCallback}) => {
  return (
    <div>
      <div className={theme.step}>
        <h1 className={theme.title}>{title}</h1>
        <div className={`${style['mtop-large']} ${theme["mbottom-large"]}`}>
          {descriptions.map(description => <p>{description}</p>)}
        </div>
        <a
          href=''
          className={`${theme.btn} ${theme["btn-centered"]} ${theme["btn-primary"]}`}
          onClick={(event) => handleClick(event, nextCallback)}>
          {nextButton}
        </a>
      </div>
    </div>
  )
}

const handleClick = (event, nextCallback) => {
  event.preventDefault()
  nextCallback()
}

Welcome.defaultProps =  {
  title: 'Open your new bank account',
  descriptions: [
    'To open a bank account, we will need to verify your identity.',
    'It will only take a couple of minutes.'
  ],
  nextButton:'Verify Identity'
}

export default Welcome
