// @flow
import { h } from 'preact'
import classNames from 'classnames'
import PageTitle from '../PageTitle'
import Button from '../Button'
import { localised, type LocalisedType } from '../../locales'
import { trackComponent } from '../../Tracker'
import withCrossDeviceWhenNoCamera from '../Capture/withCrossDeviceWhenNoCamera'
import { compose } from '~utils/func'
import theme from '../Theme/style.scss'
import style from './style.scss'

type Props = {
  nextStep: Function,
} & LocalisedType

const LOCALES_MAPPING = {
  actions: {
    className: 'twoActionsIcon',
    localeKey: 'video_intro.list_item_actions',
  },
  speak: {
    className: 'speakOutLoudIcon',
    localeKey: 'video_intro.list_item_speak',
  },
}

const Intro = ({ translate, parseTranslatedTags, nextStep }: Props) => (
  <div className={theme.fullHeightContainer}>
    <PageTitle title={translate('video_intro.title')} />
    <div className={classNames(theme.thickWrapper, style.introCopy)}>
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
                  style[LOCALES_MAPPING[key].className]
                )}
              />
              {parseTranslatedTags(
                LOCALES_MAPPING[key].localeKey,
                ({ text }) => (
                  <span className={style.bolder}>{text}</span>
                )
              )}
            </li>
          )
        })}
      </ul>
    </div>
    <div className={theme.thickWrapper}>
      <Button variants={['primary', 'centered', 'lg']} onClick={nextStep}>
        {translate('video_intro.button_primary')}
      </Button>
    </div>
  </div>
)

export default trackComponent(
  compose(localised, withCrossDeviceWhenNoCamera)(Intro),
  'video_intro'
)
