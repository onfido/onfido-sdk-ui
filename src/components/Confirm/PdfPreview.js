import { h, Component } from 'preact'
import PDFObject from 'pdfobject'

class PdfViewer extends Component {
  componentDidMount() {
    const { pdfBlob, containerId } = this.props;
    console.log('supports PDF:', PDFObject.supportsPDFs)

    PDFObject.embed(pdfBlob, '#testPDF');
  }

  render() {
    const { width, height, containerId } = this.props;

    return <div style={{ width, height }} id='testPDF' />;
  }
}

PdfViewer.defaultProps = {
  width: '100%',
  height: '100%',
  containerId: 'pdf-viewer'
}

export default PdfViewer
