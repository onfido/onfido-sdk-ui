import * as React from 'react'
import { h, Component } from 'preact'
import PageTitle from '../PageTitle'
import style from './style.css'
import theme from '../Theme/style.css'
import classNames from 'classnames'
import Button from '../Button'
import { localised } from '../../locales'

const InstructionPure = (instruction) => (
    <li key={instruction.key} className={style.introBullet}>
      <span className={classNames(style.introIcon, style[`${instruction.key}Icon`])} />
      <span className={classNames(style.bolder, style.introText)}>{instruction.text}</span>
    </li>
)

const RenderInstructions = (instructions) => (
    <div className={classNames(style.thinWrapper, style.introCopy)}>
      <ul className={style.introBullets} aria-label="TODO">
      {
        instructions.map(instruction =>
          <InstructionPure instruction={instruction} />
        )
      }
      </ul>
    </div>
)

class Intro extends Component<Props, State> {

  render() {
    const { translate, nextStep } = this.props
    return <div className="theme.fullHeightContainer">
      <PageTitle title={translate("capture.face.intro.title")} subTitle={translate("capture.face.intro.subtitle")} />
      <RenderInstructions instructions={[{key:"selfie", text: translate("capture.face.intro.selfie_instruction")}, {key:"glasses", text: translate("capture.face.intro.glasses_instruction")}]} />
      <div className={theme.thickWrapper}>
        <Button
          variants={['primary', 'centered']}
          onClick={nextStep}
        >
          {translate("continue")}
        </Button>
      </div>
    </div>
  }
}

export default localised(Intro)
