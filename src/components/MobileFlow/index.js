import style from './style.css'
import { h } from 'preact'

export const MobileOption = () => {
  return (
    <div className={style.container}>
      <div className={style.icon} />
      <div className={style.copy}>
        <div className={style.header}>Need to use your mobile to take photos?</div>
        <p className={style.submessage}>Safely continue verification on your mobile </p>
      </div>
      <div className={style.chevron} />
    </div>
  )
}
