import { h, Component } from 'preact'
import { createComponentList } from './StepComponentMap'
import Welcome from '../Welcome'
import Select from '../Select'
import {FrontDocumentCapture, BackDocumentCapture, FaceCapture} from '../Capture'
import {DocumentFrontConfirm, DocumentBackConfrim, FaceConfirm} from '../Confirm'
import Complete from '../Complete'
import Flow from './Flow'

const masterFlowComponents = (documentType) => {
  return {
    welcome: () => [Welcome],
    face: () => [FaceCapture, FaceConfirm],
    document: () => createDocumentComponents(documentType),
    complete: () => [Complete]
  }
}

const createDocumentComponents = (documentType) => {
  const double_sided_docs = ['driving_licence', 'national_identity_card']
  const frontDocumentFlow = [Select, FrontDocumentCapture, DocumentFrontConfirm]
  if (Array.includes(double_sided_docs, documentType)) {
    return [...frontDocumentFlow, BackDocumentCapture, DocumentBackConfrim]
  }
  return frontDocumentFlow
}

class MasterFlow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      componentsList: this.createComponentListFromProps(this.props)
    }
  }

  createComponentListFromProps = ({documentType, options:{steps}}) => {
    const masterComponents = masterFlowComponents(documentType)
    return createComponentList(masterComponents, steps)
  }

  componentWillReceiveProps() {
    const componentsList = this.state.componentsList
    this.setState({componentsList})
  }

  render = ({options: {...globalUserOptions}, ...otherProps}) => {
    return (
      <div>
        <Flow
          {...{...globalUserOptions, ...otherProps}}
          componentsList={this.state.componentsList}
        />
      </div>
    )
  }
}

export default MasterFlow
