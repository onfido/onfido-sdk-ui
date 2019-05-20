import { h, Component } from 'preact'
import PDFObject from 'pdfobject'
import { preventDefaultOnClick } from '~utils'
import { withBlobPreviewUrl } from './hocs';
import style from './style.css'

const IEPdfBlobLink = ({blob}) => {
  // Object urls created from Blobs don't work on IE11 and Edge, so we use this component as a fallback
  // Without this component PDFObject would display an error instead of the expected PDFObject link fallback.
  const downloadPDF = () => {
    window.navigator.msSaveOrOpenBlob(blob, 'document.pdf')
  }
  return <a href='#'
    onClick={preventDefaultOnClick(downloadPDF)}
    className={style.pdfIcon}
  />
}

let i = 0

class PDFPreview extends Component {
  constructor(props){
    super(props)
    this.id = 'pdfContainer' + (i++)
  }
  options = {
    width: '100%',
    height: (290 / 16) + 'em', // aiming for 290px, assuming an 1em size of 16px
    'max-height': '70vh',
    border: 0,
    fallbackLink: `<a href='[url]' class=${style.pdfIcon} download/>`
  }

  embedPDF(previewUrl){
    PDFObject.embed(previewUrl, `#${this.id}`, this.options);
  }

  componentDidMount() {
    const { previewUrl } = this.props;
    this.embedPDF(previewUrl)
  }
  shouldComponentUpdate () {
    return false;
  }
  componentWillReceiveProps({previewUrl}) {
    if (this.props.pdfPreview !== previewUrl) this.embedPDF(previewUrl)
  }
  render() {
    return <div id={this.id} />
  }
}

const PDFPreviewWithPreviewUrl = withBlobPreviewUrl(PDFPreview)

class PdfViewer extends Component {
  shouldComponentUpdate () {
    return false;
  }

  render() {
    const { blob } = this.props;
    return (
      <div className={style.pdfWrapper}>
        {window.navigator.msSaveOrOpenBlob ?
          <IEPdfBlobLink blob={blob} /> :
          <PDFPreviewWithPreviewUrl blob={blob} />
        }
      </div>
    )
  }
}
export default PdfViewer
