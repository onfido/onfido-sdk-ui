// @flow
import * as React from 'react'
import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import theme from '../Theme/style.css'
import PageTitle from '../PageTitle'
import Button from '../Button'
import {localised} from '../../locales'
import type { LocalisedType } from '../../locales'
import { trackComponent } from '../../Tracker'
import { compose } from '~utils/func'
import withCameraDetection from '../Capture/withCameraDetection'
import withCrossDeviceWhenNoCamera from '../Capture/withCrossDeviceWhenNoCamera'


type Props = {
  nextStep: void => void,
} & LocalisedType

const Intro = ({ translate, parseTranslatedTags, nextStep }: Props) => (
  <div className={theme.fullHeightContainer}>
    <PageTitle title={translate('capture.liveness.intro.title')} />
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
      <Button
        variants={['primary', 'centered']}
        onClick={nextStep}
      >
        {translate('capture.liveness.intro.continue')}
      </Button>
    </div>
  </div>
)

export default compose(
  withCameraDetection,
  withCrossDeviceWhenNoCamera,
)(trackComponent(localised(Intro), 'video_intro'))
