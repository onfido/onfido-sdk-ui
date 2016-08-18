import { h, Component } from 'preact'
import { Link } from 'preact-router'
import theme from '../../style/refactor.css'
import style from './style.css'

const Welcome = ({title, descriptions, nextButton, nextLink}) => {
  return (
    <div>
      <div className={theme.step}>
        <h1 className={theme.title}>{title}</h1>
        <div className={`${style['mtop-large']} ${theme["mbottom-large"]}`}>
          {descriptions.map(description => <p>{description}</p>)}
        </div>
        <Link
          href={nextLink}
          className={`${theme.btn} ${theme["btn-centered"]} ${theme["btn-primary"]}`}>
          {nextButton}
        </Link>
      </div>
    </div>
  )
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
