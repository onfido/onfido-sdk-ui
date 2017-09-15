import { h } from 'preact'
import style from './style.css'

const MobileFlowOption = () => {
  return (
    <div className={style.container}>
      <a href='#'>
        <div className={style.icon} />
        <div className={style.copy}>
          <div className={style.header}>Need to use your mobile to take photos?</div>
          <p className={style.submessage}>Safely continue verification on your mobile </p>
        </div>
      </a>
      <div className={style.chevron} />
    </div>
  )
}

export default MobileFlowOption
