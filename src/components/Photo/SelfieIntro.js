import * as React from 'react'
import { h, Component } from 'preact'
import PageTitle from '../PageTitle'
import style from './style.css'
import theme from '../Theme/style.css'
import classNames from 'classnames'
import Button from '../Button'
import { localised } from '../../locales'
import { trackComponent } from '../../Tracker'
import withCrossDeviceWhenNoCamera from '../Capture/withCrossDeviceWhenNoCamera'
import withCameraDetection from '../Capture/withCameraDetection'
import { compose } from '~utils/func'


const InstructionsPure = ({listScreenReaderText, instructions}) => (
    <div className={classNames(style.thinWrapper, style.introCopy)}>
      <ul className={style.introBullets} aria-label={listScreenReaderText}>
      {
        instructions.map(instruction =>
          <li className={style.introBullet}>
            <span className={classNames(style.introIcon, style[`${instruction.key}Icon`])} />
            <span className={classNames(style.bolder, style.introText)}>{instruction.text}</span>
          </li>
        )
      }
      </ul>
    </div>
)

class Intro extends Component<Props, State> {

  render() {
    const { translate, nextStep } = this.props
    const instructions = [
      { key: "selfie", text: translate("capture.face.intro.selfie_instruction") },
      { key: "glasses", text: translate("capture.face.intro.glasses_instruction") }
    ]
    return <div className={theme.fullHeightContainer}>
      <PageTitle title={translate("capture.face.intro.title")} subTitle={translate("capture.face.intro.subtitle")} />
      <InstructionsPure listScreenReaderText={translate("capture.face.intro.accessibility.selfie_capture_tips")} instructions={instructions} />
      <div className={theme.thickWrapper}>
        <Button
          variants={['primary', 'centered', 'lg']}
          onClick={nextStep}
        >
          {translate("continue")}
        </Button>
      </div>
    </div>
  }
}

export default trackComponent(compose(
  localised,
  withCameraDetection,
  withCrossDeviceWhenNoCamera,
)(Intro), 'selfie_intro')
