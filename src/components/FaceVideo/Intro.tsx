import { h, FunctionComponent } from 'preact'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'

import { localised } from '~locales'
import PageTitle from '../PageTitle'
import { trackComponent } from '../../Tracker'
import withCrossDeviceWhenNoCamera from '../Capture/withCrossDeviceWhenNoCamera'
import {
  VIDEO_INTRO_LOCALES_MAPPING,
  VideoIntroTypes,
} from '~utils/localesMapping'
import theme from '../Theme/style.scss'
import style from './style.scss'

import type { WithLocalisedProps } from '~types/hocs'
import type { StepComponentFaceProps } from '~types/routers'

type FaceVideoIntroProps = {
  nextStep: () => void
} & StepComponentFaceProps

type Props = FaceVideoIntroProps & WithLocalisedProps

const VIDEO_INTRO_TYPES: VideoIntroTypes[] = ['actions', 'speak']

const Intro: FunctionComponent<Props> = ({
  translate,
  parseTranslatedTags,
  nextStep,
  steps,
  autoFocusOnInitialScreenTitle,
}) => {
  const isFirstScreen = steps[0].type === 'face'
  return (
    <div className={theme.fullHeightContainer}>
      <PageTitle
        title={translate('video_intro.title')}
        shouldAutoFocus={isFirstScreen && autoFocusOnInitialScreenTitle}
      />
      <div className={style.introCopy}>
        <ul
          className={style.introBullets}
          aria-label={translate('video_intro.list_accessibility')}
        >
          {VIDEO_INTRO_TYPES.map((key) => {
            return (
              <li key={key} className={style.introBullet}>
                <span
                  className={classNames(
                    style.introIcon,
                    style[VIDEO_INTRO_LOCALES_MAPPING[key].className]
                  )}
                />
                {parseTranslatedTags(
                  VIDEO_INTRO_LOCALES_MAPPING[key].localeKey,
                  ({ text }) => (
                    <span className={style.bolder}>{text}</span>
                  )
                )}
              </li>
            )
          })}
        </ul>
      </div>
      <div className={theme.contentMargin}>
        <Button
          type="button"
          variant="primary"
          className={classNames(theme['button-centered'], theme['button-lg'])}
          onClick={nextStep}
          data-onfido-qa="liveness-continue-btn"
        >
          {translate('video_intro.button_primary')}
        </Button>
      </div>
    </div>
  )
}

export default trackComponent(
  localised(withCrossDeviceWhenNoCamera(Intro)),
  'video_intro'
)
