// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import theme from '../Theme/style.css'
import Title from '../Title'
import { preventDefaultOnClick, checkIfHasWebcam } from '../utils'
import {parseI18nWithXmlTags} from '../../locales'
import { trackComponent } from '../../Tracker'

type Props = {
  allowCrossDeviceFlow: boolean,
  changeFlowTo: (string, ?number, ?boolean) => void,
  i18n: Object,
  nextStep: void => void,
};

class Intro extends Component<Props> {
  componentDidMount() {
    const { changeFlowTo, allowCrossDeviceFlow } = this.props
    checkIfHasWebcam(hasWebcam => {
      if (!hasWebcam && allowCrossDeviceFlow) {
        changeFlowTo('crossDeviceSteps')
      }
    })
  }

  render() {
    const { i18n, nextStep } = this.props
    return (
      <div className={theme.fullHeightContainer}>
        <Title title={i18n.t('capture.liveness.intro.title')} />
        <div className={classNames(theme.thickWrapper, style.introCopy)}>
          <ul className={style.introBullets}>
          {
            ['two_actions', 'speak_out_loud'].map(key =>
              <li key={key} className={style.introBullet}>
                <span className={classNames(style.introIcon, style[`${key}Icon`])} />
                { parseI18nWithXmlTags(i18n, `capture.liveness.intro.${key}`, ({ text }) => (
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
            {i18n.t('capture.liveness.intro.continue')}
          </button>
        </div>
      </div>
    )
  }
}

export default trackComponent(Intro)
