import { h, FunctionComponent } from 'preact'
import { memo } from 'preact/compat'

import { useLocales } from '~locales'
import style from './style.scss'

import type { CaptureFlows } from '~types/docVideo'
import type { DocumentTypes } from '~types/steps'

export type Props = {
  documentType: DocumentTypes
  onSelectFlow: (
    captureFlow: Extract<CaptureFlows, 'cardId' | 'paperId'>
  ) => void
}

const TITLE_KEY_BY_DOCUMENT_TYPE: Partial<Record<DocumentTypes, string>> = {
  driving_licence: 'doc_capture.prompt.title_license',
  national_identity_card: 'doc_capture.prompt.title_id',
}

const PaperIdFlowSelector: FunctionComponent<Props> = ({
  documentType,
  onSelectFlow,
}) => {
  const { translate } = useLocales()

  const { [documentType]: titleKey } = TITLE_KEY_BY_DOCUMENT_TYPE

  if (!titleKey) {
    return null
  }

  return (
    <div className={style.paperIdFlowSelector}>
      <span className={style.title}>{translate(titleKey)}</span>
      <button className={style.cardId} onClick={() => onSelectFlow('cardId')}>
        <span className={style.icon} />
        <span className={style.text}>
          {translate('doc_capture.prompt.button_card')}
        </span>
        <span className={style.chevron} />
      </button>
      <button className={style.paperId} onClick={() => onSelectFlow('paperId')}>
        <span className={style.icon} />
        <span className={style.text}>
          {translate('doc_capture.prompt.button_paper')}
        </span>
        <span className={style.chevron} />
      </button>
    </div>
  )
}

export default memo(PaperIdFlowSelector)
