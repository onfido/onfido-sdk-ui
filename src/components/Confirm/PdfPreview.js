import { h, Component } from 'preact'
import PDFObject from 'pdfobject'
import {preventDefaultOnClick} from '../utils'

const FallbackView = ({blob}) => {
  const downloadPDF = (e) => {
    window.navigator.msSaveOrOpenBlob(blob, 'document.pdf')
  }
  return (
    <div>
      <a href='#' onClick={preventDefaultOnClick(downloadPDF)}><div id='pdfIcon'></div></a>
    </div>
  )
}

class PDFPreview extends Component {
  options = {
    'width': '92%',
    'height': '290px',
    'max-height': '70vh',
    'border': 0,
    fallbackLink: "<a href='[url]'><div id='pdfIcon'></div></a>"
  }

  embedPDF(previewUrl){
    PDFObject.embed(previewUrl, '#pdfContainer', this.options);
  }

  componentDidMount() {
    const { previewUrl } = this.props;
    this.embedPDF(previewUrl)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return false;
  }
  componentWillReceiveProps({previewUrl}) {
    if (this.props.pdfPreview !== previewUrl) this.embedPDF(previewUrl)
  }
  render() {
    return <div id='pdfContainer' />;
  }
}

class PdfViewer extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    return false;
  }

  render() {
    const { blob, previewUrl } = this.props;
    return (
      <div>
        {window.navigator.msSaveOrOpenBlob ?
          <FallbackView blob={blob} /> :
          <PDFPreview previewUrl={previewUrl}/>
        }
      </div>
    )
  }
}
export default PdfViewer
