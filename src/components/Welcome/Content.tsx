import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'

import { buildIteratorKey } from '~utils'
import { VIDEO_CAPTURE } from '~utils/constants'
import { useLocales } from '~locales'
import style from './style.scss'

type InstructionsProps = {
  className?: string
}

const Instructions: FunctionComponent<InstructionsProps> = ({ className }) => {
  const { translate } = useLocales()

  const instructionItemKeys = [
    'welcome.list_item_doc',
    'welcome.list_item_selfie',
  ]

  return (
    <div className={classNames(style.instructions, className)}>
      <span className={style.caption}>
        {translate('welcome.list_header_doc_video')}
      </span>
      <ol>
        {instructionItemKeys.map((itemKey) => (
          <li key={itemKey}>{translate(itemKey)}</li>
        ))}
      </ol>
    </div>
  )
}

type DefaultContentProps = {
  descriptions?: string[]
}

export const DefaultContent: FunctionComponent<DefaultContentProps> = ({
  descriptions: customisedDescriptions,
}) => {
  const { translate } = useLocales()

  const defaultDescriptions = [
    translate('welcome.description_p_1'),
    translate('welcome.description_p_2'),
  ]

  const descriptions = customisedDescriptions || defaultDescriptions

  return (
    <div className={style.content}>
      <div className={style.customDescriptions}>
        {descriptions.map((description) => (
          <p key={`description_${buildIteratorKey(description)}`}>
            {description}
          </p>
        ))}
      </div>
    </div>
  )
}

export const DocVideoContent: FunctionComponent = () => {
  const { parseTranslatedTags, translate } = useLocales()

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
    <div className={style.content}>
      <span className={style.subtitle}>
        {translate('welcome.doc_video_subtitle')}
      </span>
      <Instructions />
      <div className={style.recordingLimit}>
        <span className={style.timer} />
        <span className={style.text}>{recordingLimit}</span>
      </div>
    </div>
  )
}
