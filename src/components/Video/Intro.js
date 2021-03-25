import { h } from 'preact'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'
import PageTitle from '../PageTitle'
import { localised /* , type LocalisedType */ } from '../../locales'
import { trackComponent } from '../../Tracker'
import withCrossDeviceWhenNoCamera from '../Capture/withCrossDeviceWhenNoCamera'
import { VIDEO_INTRO_LOCALES_MAPPING } from '~utils/localesMapping'
import { compose } from '~utils/func'
import theme from '../Theme/style.scss'
import style from './style.scss'

/* type Props = {
  nextStep: Function,
} & LocalisedType */

const Intro = ({ translate, parseTranslatedTags, nextStep }) => (
  <div className={theme.fullHeightContainer}>
    <PageTitle title={translate('video_intro.title')} />
    <div className={style.introCopy}>
      <ul
        className={style.introBullets}
        aria-label={translate('video_intro.list_accessibility')}
      >
        {['actions', 'speak'].map((key) => {
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

export default trackComponent(
  compose(localised, withCrossDeviceWhenNoCamera)(Intro),
  'video_intro'
)
