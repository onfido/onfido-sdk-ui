// @flow
import * as React from 'react'
import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import theme from '../Theme/style.css'
import Title from '../Title'
import {preventDefaultOnClick} from '../utils'
import {localised} from '../../locales'
import type { LocalisedType } from '../../locales'
import { trackComponent } from '../../Tracker'

type Props = {
  nextStep: void => void,
} & LocalisedType

const Intro = ({ translate, parseTranslatedTags, nextStep }: Props) => (
  <div className={theme.fullHeightContainer}>
    <Title title={translate('capture.liveness.intro.title')} />
    <div className={classNames(theme.thickWrapper, style.introCopy)}>
      <ul className={style.introBullets}>
      {
        ['two_actions', 'speak_out_loud'].map(key =>
          <li key={key} className={style.introBullet}>
            <span className={classNames(style.introIcon, style[`${key}Icon`])} />
            { parseTranslatedTags(`capture.liveness.intro.${key}`, ({ text }) => (
               <span className={style.bolder}>{text}</span>
            ))}
          </li>
        )
      }
      </ul>
    </div>
    <div className={theme.thickWrapper}>
      <button
        className={classNames(theme.btn, theme['btn-primary'], theme['btn-centered'])}
        onClick={preventDefaultOnClick(nextStep)}>
        {translate('capture.liveness.intro.continue')}
      </button>
    </div>
  </div>
)

export default trackComponent(localised(Intro), 'video_intro')
