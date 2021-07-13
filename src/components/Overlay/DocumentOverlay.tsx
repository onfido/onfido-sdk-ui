import { h, FunctionComponent } from 'preact'
import style from './style.scss'

import type { DocumentTypes } from '~types/steps'

type DocumentSizes = 'id1Card' | 'id3Card' | 'rectangle'

type Props = {
  type?: DocumentTypes
}

const ID1_SIZE_DOCUMENTS = new Set<DocumentTypes>([
  'driving_licence',
  'national_identity_card',
])

const getDocumentSize = (type?: DocumentTypes): DocumentSizes => {
  if (!type) {
    return 'rectangle'
  }

  return ID1_SIZE_DOCUMENTS.has(type) ? 'id1Card' : 'id3Card'
}

const DocumentOverlay: FunctionComponent<Props> = ({ type }) => {
  const size = getDocumentSize(type)

  return (
    <div>
      <span className={style[size]} />
    </div>
  )
}

export default DocumentOverlay
