import { h, Component, FunctionComponent } from 'preact'
import PdfObject from 'pdfobject'
import { preventDefaultOnClick } from '~utils'
import { withBlobPreviewUrl } from './hocs'
import style from './style.scss'

import type { WithBlobPreviewProps } from '~types/hocs'

const IEPdfBlobLink: FunctionComponent<WithBlobPreviewProps> = ({ blob }) => {
  // Object urls created from Blobs don't work on IE11 and Edge, so we use this component as a fallback
  // Without this component PdfObject would display an error instead of the expected PdfObject link fallback.
  const downloadPdf = () => {
    if (window.navigator.msSaveOrOpenBlob)
      window.navigator.msSaveOrOpenBlob(blob, 'document.pdf')
  }

  return (
    <a
      href="#"
      onClick={preventDefaultOnClick(downloadPdf)}
      className={style.pdfIcon}
    />
  )
}

let pdfContainersCounter = 0

type PdfPreviewProps = {
  pdfPreview?: string
  previewUrl?: string
}

class PdfPreview extends Component<PdfPreviewProps> {
  private id: string

  constructor(props: PdfPreviewProps) {
    super(props)
    this.id = `pdfContainer-${pdfContainersCounter++}`
  }

  options = {
    width: '100%',
    height: `${290 / 16}em`, // aiming for 290px, assuming an 1em size of 16px
    'max-height': '70vh',
    border: 0,
    fallbackLink: `<a href='[url]' class=${style.pdfIcon} download/>`,
  }

  embedPDF(previewUrl: string) {
    PdfObject.embed(previewUrl, `#${this.id}`, this.options)
  }

  componentDidMount() {
    const { previewUrl } = this.props
    previewUrl && this.embedPDF(previewUrl)
  }

  shouldComponentUpdate() {
    return false
  }

  componentWillReceiveProps({ previewUrl }: PdfPreviewProps) {
    if (this.props.pdfPreview !== previewUrl && previewUrl) {
      this.embedPDF(previewUrl)
    }
  }

  render() {
    return <div id={this.id} />
  }
}

const PdfPreviewWithPreviewUrl = withBlobPreviewUrl(PdfPreview)

export default class PdfViewer extends Component<WithBlobPreviewProps> {
  shouldComponentUpdate(): boolean {
    return false
  }

  render(): h.JSX.Element {
    const { blob } = this.props

    return (
      <div className={style.pdfWrapper}>
        {typeof window.navigator.msSaveOrOpenBlob === 'function' ? (
          <IEPdfBlobLink blob={blob} />
        ) : (
          <PdfPreviewWithPreviewUrl blob={blob} />
        )}
      </div>
    )
  }
}
