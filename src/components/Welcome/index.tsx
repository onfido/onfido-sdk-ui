import { h, FunctionComponent } from 'preact'
import PageTitle from '../PageTitle'
import Button from '../Button'
import { trackComponent } from '../../Tracker'
import { localised } from '../../locales'
import { buildIteratorKey } from '~utils'
import theme from '../Theme/style.scss'
import style from './style.scss'

import type { TranslateCallback } from '~types/locales'
import type { WithLocalisedProps } from '~types/hocs'
import type { StepComponentWelcomeProps } from '~types/routers'

type Props = StepComponentWelcomeProps & WithLocalisedProps

const localisedDescriptions = (translate: TranslateCallback) => [
  translate('welcome.description_p_1'),
  translate('welcome.description_p_2'),
]

const Welcome: FunctionComponent<Props> = ({
  title,
  descriptions,
  nextButton,
  nextStep,
  translate,
}) => {
  const welcomeTitle = title ? title : translate('welcome.title')
  const welcomeDescriptions = descriptions
    ? descriptions
    : localisedDescriptions(translate)
  const welcomeNextButton = nextButton
    ? nextButton
    : translate('welcome.next_button')
  return (
    <div>
      <PageTitle title={welcomeTitle} />
      <div className={theme.thickWrapper}>
        <div className={style.text}>
          {welcomeDescriptions.map((description) => (
            <p key={`description_${buildIteratorKey(description)}`}>
              {description}
            </p>
          ))}
        </div>
        <Button onClick={nextStep} variants={['centered', 'primary', 'lg']}>
          {welcomeNextButton}
        </Button>
      </div>
    </div>
  )
}

export default trackComponent(localised(Welcome))
