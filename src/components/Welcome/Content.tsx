import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'

import { buildIteratorKey } from '~utils'
import { VIDEO_CAPTURE } from '~utils/constants'
import { useLocales } from '~locales'
import style from './style.scss'

import type { StepTypes } from '~types/steps'

const getInstructionKeys = (configuredCaptureSteps: StepTypes[]) => {
  const instructionKeys: string[] = []
  const welcomeScreenLocalesMapping: Partial<Record<StepTypes, string>> = {
    poa: 'welcome.list_item_poa',
    document: 'welcome.list_item_doc',
    face: 'welcome.list_item_selfie',
    auth: 'welcome.list_item_selfie',
    activeVideo: 'welcome.list_item_selfie',
  }

  configuredCaptureSteps.forEach((idvStep) => {
    const localeString = welcomeScreenLocalesMapping[idvStep]

    if (localeString) {
      instructionKeys.push(localeString)
    }
  })

  return instructionKeys
}

type BaseProps = {
  captureSteps: StepTypes[]
}

type InstructionsProps = {
  className?: string
  forDocVideo?: boolean
} & BaseProps

const Instructions: FunctionComponent<InstructionsProps> = ({
  className,
  captureSteps,
  forDocVideo = false,
}) => {
  const { translate } = useLocales()

  const instructionKeys = getInstructionKeys(captureSteps)
  const headerKey = forDocVideo
    ? 'welcome.list_header_doc_video'
    : 'welcome.list_header_webcam'

  return (
    <div className={classNames(style.instructions, className)}>
      <span>{translate(headerKey)}</span>
      <ol>
        {instructionKeys.map((itemKey) => (
          <li key={itemKey}>{translate(itemKey)}</li>
        ))}
      </ol>
    </div>
  )
}

type DefaultContentProps = {
  descriptions?: string[]
} & BaseProps

export const DefaultContent: FunctionComponent<DefaultContentProps> = ({
  captureSteps,
  descriptions: customDescriptions,
}) => {
  if (!customDescriptions) {
    return (
      <div className={style.content}>
        <Instructions captureSteps={captureSteps} />
      </div>
    )
  }

  return (
    <div className={style.content}>
      <div className={style.customDescriptions}>
        {customDescriptions.map((description) => (
          <p key={`description_${buildIteratorKey(description)}`}>
            {description}
          </p>
        ))}
      </div>
    </div>
  )
}

export const DocVideoContent: FunctionComponent<BaseProps> = ({
  captureSteps,
}) => {
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
    <div className={style.content}>
      <Instructions captureSteps={captureSteps} forDocVideo />
      <div className={style.recordingLimit}>
        <span className={style.timer} />
        <span className={style.text}>{recordingLimit}</span>
      </div>
    </div>
  )
}
