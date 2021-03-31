import { FunctionComponent, h } from 'preact'
import PageTitle from '../PageTitle'
import classNames from 'classnames'
import { Button } from '@onfido/castor-react'
import { localised, useLocales } from '../../locales'
import { trackComponent } from '../../Tracker'
import withCrossDeviceWhenNoCamera from '../Capture/withCrossDeviceWhenNoCamera'
import { compose } from '~utils/func'
import theme from '../Theme/style.scss'
import style from './style.scss'
import { StepComponentBaseProps } from '~types/routers'

const InstructionsPure = ({ listScreenReaderText, instructions }) => (
  <div className={classNames(theme.thickWrapper, theme.scrollableContent)}>
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

const Intro: FunctionComponent<StepComponentBaseProps> = ({ nextStep }) => {
  const { translate } = useLocales()

  const instructions = [
    {
      key: 'selfie',
      text: translate('selfie_intro.list_item_face_forward'),
    },
    {
      key: 'glasses',
      text: translate('selfie_intro.list_item_no_glasses'),
    },
  ]

  return (
    <div className={theme.fullHeightContainer}>
      <PageTitle
        title={translate('selfie_intro.title')}
        subTitle={translate('selfie_intro.subtitle')}
      />
      <InstructionsPure
        listScreenReaderText={translate('selfie_intro.list_accessibility')}
        instructions={instructions}
      />
      <div className={classNames(theme.thickWrapper, style.buttonContainer)}>
        <Button variant="primary" kind="action" onClick={nextStep}>
          {translate('selfie_intro.button_primary')}
        </Button>
      </div>
    </div>
  )
}

export default trackComponent(
  //@ts-ignore
  compose(localised, withCrossDeviceWhenNoCamera)(Intro),
  'selfie_intro'
)
