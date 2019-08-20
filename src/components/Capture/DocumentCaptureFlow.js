import { h, Component } from 'preact'
import { appendToTracking } from '../../Tracker'
import Document from './Document'
import { DocumentFrontConfirm, DocumentBackConfirm } from '../Confirm'

class DocumentCaptureFlow extends Component {

  constructor(props) {
    super(props)
    const { step, stepIndexToLastView } = this.props
    const lastViewDisplayed = stepIndexToLastView[step]
    const initialViewIndex = lastViewDisplayed ? getViewIndex(lastViewDisplayed) : 0
    this.state = {
      currentView: allDocumentCaptureViews[initialViewIndex],
      error: null
    }
  }

  handleCapture = () => this.continueToNextView()

  handleConfirm = () => {
    const { documentType, nextStep } = this.props
    const { currentView } = this.state
    if ((currentView === 'frontConfirm' && !isDoubleSidedDocument(documentType)) || currentView === 'backConfirm') {
      nextStep(currentView)
    } else {
      this.continueToNextView()
    }
  }

  handleRetake = () => this.backToPreviousView()

  backToPreviousView = () => this.setState({ currentView: getPreviousView(this.state.currentView) })

  continueToNextView = () => this.setState({ currentView: getNextView(this.state.currentView) })

  handleBackToPreviousViewRequest = () => {
    const currentViewIndex = getViewIndex(this.state.currentView)
    if (currentViewIndex === 0) {
      this.props.previousStep()
    } else {
      this.backToPreviousView()
    }
  }

  componentDidMount() {
    this.props.events.on('backToPreviousView', this.handleBackToPreviousViewRequest)
  }

  componentWillUnmount() {
    this.props.events.removeAllListeners('backToPreviousView')
  }

  render() {
    const { currentView } = this.state
    if (currentView === 'backConfirm') {
      return (
        <DocumentBackConfirm
          { ...this.props }
          onConfirm={ this.handleConfirm }
          onRetake={ this.handleRetake } />
      )
    }
    if (currentView === 'backCapture') {
      return (
        <DocumentBackCapture
        { ...this.props }
        side="back"
        onCapture={ this.handleCapture }
        onRetake={ this.handleRetake } />
      )
    }
    if (currentView === 'frontConfirm') {
      return (
        <DocumentFrontConfirm
          { ...this.props }
          onConfirm={ this.handleConfirm }
          onRetake={ this.handleRetake } />
      )
    }
    return (
      <DocumentFrontCapture
        { ...this.props }
        side="front"
        onCapture={ this.handleCapture }
        onRetake={ this.handleRetake } />
    )
  }

}

const allDocumentCaptureViews = [
  'frontCapture',
  'frontConfirm',
  'backCapture',
  'backConfirm'
]
const getViewIndex = currentView => allDocumentCaptureViews.findIndex(view => view === currentView)
const getNextView = currentView => {
  const nextIndex = getViewIndex(currentView) + 1
  return allDocumentCaptureViews[nextIndex]
}
const getPreviousView = currentView => {
  const previousIndex = getViewIndex(currentView) - 1
  return allDocumentCaptureViews[previousIndex]
}

const isDoubleSidedDocument = docType => {
  const doubleSidedDocs = new Set(['driving_licence', 'national_identity_card'])
  return doubleSidedDocs.has(docType)
}

const DocumentFrontCapture = appendToTracking(Document, 'front_capture')
const DocumentBackCapture = appendToTracking(Document, 'back_capture')

export default DocumentCaptureFlow
