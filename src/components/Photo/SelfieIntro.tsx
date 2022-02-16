import { h } from 'preact'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'
import { localised } from '~locales'
import { WithLocalisedProps } from '~types/hocs'
import { TranslateCallback } from '~types/locales'
import { StepComponentFaceProps } from '~types/routers'
import { trackComponent } from '../../Tracker'
import withCrossDeviceWhenNoCamera from '../Capture/withCrossDeviceWhenNoCamera'
import PageTitle from '../PageTitle'
import ScreenLayout from '../Theme/ScreenLayout'
import theme from '../Theme/style.scss'
import style from './style.scss'

type Instruction = { key: string; text: string }
type IntroProps = WithLocalisedProps & StepComponentFaceProps

const InstructionsPure = ({
  listScreenReaderText,
  instructions,
}: {
  listScreenReaderText: string
  instructions: Instruction[]
}) => (
  <div className={theme.scrollableContent}>
    <ul className={style.introBullets} aria-label={listScreenReaderText}>
      {instructions.map((instruction) => (
        <li
          className={style.introBullet}
          key={`instruction_${instruction.key}`}
        >
          <span
            className={classNames(
              style.introIcon,
              style[`${instruction.key}Icon`]
            )}
          />
          <span className={classNames(style.bolder, style.introText)}>
            {instruction.text}
          </span>
        </li>
      ))}
    </ul>
  </div>
)

const Actions = ({
  nextStep,
  translate,
}: {
  nextStep: () => void
  translate: TranslateCallback
}) => (
  <Button
    type="button"
    variant="primary"
    className={classNames(theme['button-centered'], theme['button-lg'])}
    onClick={nextStep}
    data-onfido-qa="selfie-continue-btn"
  >
    {translate('selfie_intro.button_primary')}
  </Button>
)

const Intro = ({
  translate,
  nextStep,
  steps,
  autoFocusOnInitialScreenTitle,
}: IntroProps) => {
  const instructions: Array<Instruction> = [
    {
      key: 'selfie',
      text: translate('selfie_intro.list_item_face_forward'),
    },
    {
      key: 'glasses',
      text: translate('selfie_intro.list_item_no_glasses'),
    },
  ]
  const actions = <Actions {...{ nextStep, translate }} />
  const isFirstScreen = steps[0].type === 'face'

  return (
    <ScreenLayout actions={actions}>
      <div className={theme.fullHeightContainer}>
        <PageTitle
          title={translate('selfie_intro.title')}
          subTitle={translate('selfie_intro.subtitle')}
          shouldAutoFocus={isFirstScreen && autoFocusOnInitialScreenTitle}
        />
        <InstructionsPure
          listScreenReaderText={translate('selfie_intro.list_accessibility')}
          instructions={instructions}
        />
      </div>
    </ScreenLayout>
  )
}

export default trackComponent(
  localised(withCrossDeviceWhenNoCamera(Intro)),
  'selfie_intro'
)
