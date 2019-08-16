import { h, Component } from 'preact'
import { appendToTracking } from '../../Tracker'
import Document from './Document'
import { DocumentFrontConfirm, DocumentBackConfirm } from '../Confirm'

class DocumentCaptureFlow extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentView: allDocumentCaptureViews[0],
      error: null
    }
  }

  handleCapture = () => {
    const { documentType, nextStep } = this.props
    const { currentView } = this.state
    if ((currentView === 'frontConfirm' && !isDoubleSidedDocument(documentType)) || currentView === 'backConfirm') {
      nextStep()
    } else {
      console.log('next view:', getNextView(this.state.currentView))
      this.setState({
        currentView: getNextView(this.state.currentView)
      })
    }
  }

  handleConfirm = () => {
    this.setState({
      currentView: getNextView(this.state.currentView)
    })
  }

  handleRetake = () => {
    this.setState({
      currentView: getPreviousView(this.state.currentView)
    })
  }

  render() {
    const { currentView } = this.state
    if (currentView === 'backConfirm') {
      return <DocumentBackConfirm { ...this.props } onConfirm={ this.handleConfirm } onRetake={ this.handleRetake } />
    }
    if (currentView === 'backCapture') {
      return <DocumentBackCapture { ...this.props } side="back" onCapture={ this.handleCapture } onRetake={ this.handleRetake } />
    }
    if (currentView === 'frontConfirm') {
      return <DocumentFrontConfirm { ...this.props } onConfirm={ this.handleConfirm } onRetake={ this.handleRetake } />
    }
    return <DocumentFrontCapture { ...this.props } side="front" onCapture={ this.handleCapture } onRetake={ this.handleRetake } />
  }

}

const allDocumentCaptureViews = [
  'frontCapture',
  'frontConfirm',
  'backCapture',
  'backConfirm'
]
const getCurrentIndex = currentView => allDocumentCaptureViews.findIndex(view => view === currentView)
const getNextView = currentView => {
  const nextIndex = getCurrentIndex(currentView) + 1
  return allDocumentCaptureViews[nextIndex]
}
const getPreviousView = currentView => {
  const previousIndex = getCurrentIndex(currentView) - 1
  return allDocumentCaptureViews[previousIndex]
}

const isDoubleSidedDocument = documentType => {
  const doubleSidedDocs = new Set(['driving_licence', 'national_identity_card'])
  return doubleSidedDocs.has(documentType)
}

const DocumentFrontCapture = appendToTracking(Document, 'front_capture')
const DocumentBackCapture = appendToTracking(Document, 'back_capture')

export default DocumentCaptureFlow
