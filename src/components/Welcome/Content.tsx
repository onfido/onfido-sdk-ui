import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'

import { buildIteratorKey } from '~utils'
import { useLocales } from '~locales'
import style from './style.scss'

import type { TranslateCallback } from '~types/locales'

const localisedDescriptions = (translate: TranslateCallback) => [
  translate('welcome.description_p_1'),
  translate('welcome.description_p_2'),
]

type DefaultContentProps = {
  descriptions?: string[]
}

export const DefaultContent: FunctionComponent<DefaultContentProps> = ({
  descriptions,
}) => {
  const { translate } = useLocales()

  const welcomeDescriptions = descriptions
    ? descriptions
    : localisedDescriptions(translate)

  return (
    <div className={style.content}>
      <div className={style.text}>
        {welcomeDescriptions.map((description) => (
          <p key={`description_${buildIteratorKey(description)}`}>
            {description}
          </p>
        ))}
      </div>
    </div>
  )
}

export const DocVideoContent: FunctionComponent = () => {
  const { translate } = useLocales()
  const instructionItemKeys = [
    'doc_video_capture.welcome.instruction_item_1',
    'doc_video_capture.welcome.instruction_item_2',
  ]

  return (
    <div className={classNames(style.content, style.left)}>
      <div className={style.text}>
        <span className={style.caption}>
          {translate('doc_video_capture.welcome.caption')}
        </span>
        <ol className={style.instructions}>
          {instructionItemKeys.map((itemKey) => (
            <li key={itemKey}>{translate(itemKey)}</li>
          ))}
        </ol>
      </div>
      <div className={style.recordingLimit}>
        <span className={style.timer} />
        <span>{translate('doc_video_capture.welcome.limit')}</span>
      </div>
    </div>
  )
}
