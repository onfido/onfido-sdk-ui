// @flow
import * as React from 'react'
import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import theme from '../Theme/style.css'
import PageTitle from '../PageTitle'
import Button from '../Button'
import { localised } from '../../locales'
import type { LocalisedType } from '../../locales'
import { trackComponent } from '../../Tracker'

type Props = {
  continueFlow: Function,
} & LocalisedType

const Intro = ({ translate, parseTranslatedTags, continueFlow }: Props) => (
  <div className={theme.fullHeightContainer}>
    <PageTitle title={translate('capture.liveness.intro.title')} />
    <div className={classNames(theme.thickWrapper, style.introCopy)}>
      <ul className={style.introBullets} aria-label={translate('cross_device.selfie_video_actions')}>
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
      <Button
        variants={['primary', 'centered']}
        onClick={continueFlow}
      >
        {translate('capture.liveness.intro.continue')}
      </Button>
    </div>
  </div>
)

export default trackComponent(localised(Intro), 'video_intro')
