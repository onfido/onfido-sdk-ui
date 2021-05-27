import { h, FunctionComponent } from 'preact'

import { buildIteratorKey } from '~utils'
import { VIDEO_CAPTURE } from '~utils/constants'
import { useLocales } from '~locales'
import style from './style.scss'

const Timeout: FunctionComponent = () => {
  const { parseTranslatedTags } = useLocales()

  const recordingLimit = parseTranslatedTags(
    'welcome.list_item_doc_video_timeout',
    ({ type }) => {
      switch (type) {
        case 'timeout':
          return String(VIDEO_CAPTURE.DOC_VIDEO_TIMEOUT)
        default:
          return ''
      }
    }
  )

  return (
    <div className={style.recordingLimit}>
      <span className={style.timer} />
      <span className={style.text}>{recordingLimit}</span>
    </div>
  )
}

type DefaultContentProps = {
  descriptions?: string[]
  withTimeout?: boolean
}

const Content: FunctionComponent<DefaultContentProps> = ({
  descriptions: customisedDescriptions,
  withTimeout = false,
}) => {
  const { translate } = useLocales()

  const defaultDescriptions = [
    translate('welcome.description_p_1'),
    translate('welcome.description_p_2'),
    translate('welcome.description_p_3'),
  ]

  const descriptions = customisedDescriptions || defaultDescriptions

  return (
    <div className={style.content}>
      <span className={style.subtitle}>{translate('welcome.subtitle')}</span>
      <div className={style.descriptions}>
        {descriptions.map((description) => (
          <p key={`description_${buildIteratorKey(description)}`}>
            {description}
          </p>
        ))}
      </div>
      {withTimeout ? <Timeout /> : <div />}
    </div>
  )
}

export default Content
