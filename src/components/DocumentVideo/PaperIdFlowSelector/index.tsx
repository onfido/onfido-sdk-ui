import { h, FunctionComponent } from 'preact'
import { memo } from 'preact/compat'

import { useLocales } from '~locales'
import style from './style.scss'

import type { CaptureFlows } from '~types/docVideo'
import type { DocumentTypes } from '~types/steps'

type IdFlows = Extract<CaptureFlows, 'cardId' | 'paperId'>

type IdFlowButtonProps = {
  idType: IdFlows
  onClick: () => void
  title: string
}

const TITLE_KEY_BY_DOCUMENT_TYPE: Partial<Record<DocumentTypes, string>> = {
  driving_licence: 'doc_capture.prompt.title_license',
  national_identity_card: 'doc_capture.prompt.title_id',
}

const BUTTON_COPY_BY_ID_TYPE = {
  cardId: 'doc_capture.prompt.button_card',
  paperId: 'doc_capture.prompt.button_paper',
}

const IdFlowButton: FunctionComponent<IdFlowButtonProps> = ({
  idType,
  onClick,
  title,
}) => (
  <button className={style[idType]} onClick={onClick}>
    <span className={style.icon} />
    <span className={style.text}>{title}</span>
    <span className={style.chevron} />
  </button>
)

export type Props = {
  documentType: DocumentTypes
  onSelectFlow: (captureFlow: IdFlows) => void
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
      <IdFlowButton
        idType="cardId"
        onClick={() => onSelectFlow('cardId')}
        title={translate('doc_capture.prompt.button_card')}
      />
      <IdFlowButton
        idType="paperId"
        onClick={() => onSelectFlow('paperId')}
        title={translate('doc_capture.prompt.button_paper')}
      />
    </div>
  )
}

export default memo(PaperIdFlowSelector)
