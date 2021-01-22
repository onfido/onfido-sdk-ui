import { h, FunctionComponent } from 'preact'

import type { DocumentTypes } from '~types/steps'

export type DocumentVideoProps = {
  documentType: DocumentTypes
}

type Props = DocumentVideoProps

const DocumentVideo: FunctionComponent<Props> = ({ documentType }) => (
  <div>DocumentVideo for {documentType}</div>
)

export default DocumentVideo
