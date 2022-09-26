import { h, FunctionComponent, ComponentType } from 'preact'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'

import { localised } from '~locales'
import PageTitle from '../PageTitle'
import { appendToTracking, trackComponent } from '../../Tracker'
import withCrossDeviceWhenNoCamera from '../Capture/withCrossDeviceWhenNoCamera'
import {
  VIDEO_INTRO_LOCALES_MAPPING,
  VideoIntroTypes,
} from '~utils/localesMapping'
import theme from '../Theme/style.scss'
import style from './style.scss'

import type { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import type { StepComponentFaceProps, StepComponentProps } from '~types/routers'

type Props = StepComponentFaceProps & WithTrackingProps & WithLocalisedProps

const VIDEO_INTRO_TYPES: VideoIntroTypes[] = ['actions', 'speak']

const Intro: FunctionComponent<Props> = ({
  translate,
  parseTranslatedTags,
  trackScreen,
  nextStep,
  steps,
  autoFocusOnInitialScreenTitle,
}) => {
  const isFirstScreen = steps[0].type === 'face'
  return (
    <div className={theme.fullHeightContainer} data-page-id={'FaceVideoIntro'}>
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
          onClick={() => {
            trackScreen('record_video_button_clicked')
            nextStep()
          }}
          data-onfido-qa="liveness-continue-btn"
        >
          {translate('video_intro.button_primary')}
        </Button>
      </div>
    </div>
  )
}

export default appendToTracking(
  trackComponent(localised(withCrossDeviceWhenNoCamera(Intro))),
  'video_intro'
) as ComponentType<StepComponentProps>
