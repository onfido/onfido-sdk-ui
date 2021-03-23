import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'

import { buildIteratorKey } from '~utils'
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
  descriptions,
}) => {
  if (!descriptions) {
    return (
      <div className={style.content}>
        <Instructions className={style.marginTop} />
      </div>
    )
  }

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
  const { translate } = useLocales()

  return (
    <div className={style.content}>
      <span className={style.subtitle}>
        {translate('welcome.doc_video_subtitle')}
      </span>
      <Instructions />
      <div className={style.recordingLimit}>
        <span className={style.timer} />
        <span className={style.text}>
          {translate('welcome.list_item_doc_video_timeout')}
        </span>
      </div>
    </div>
  )
}
