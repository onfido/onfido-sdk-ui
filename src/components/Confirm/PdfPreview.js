import { h, Component } from 'preact'
import PDFObject from 'pdfobject'

class PdfViewer extends Component {
  options = {
    'width': '92%',
    'height': '290px',
    'max-height': '70vh',
    'border': 0,
    fallbackLink: "<a href='[url]'><div id='pdfIcon'/></a>"
  }
  componentDidMount() {
    const { pdfPreview } = this.props;
    PDFObject.embed(pdfPreview, '#pdfContainer', this.options);
  }

  render() {
    return <div id='pdfContainer' />;
  }
}

export default PdfViewer
