import { h,  Component } from 'preact'
import { connect } from 'react-redux'
import Modal from '../Modal'
import Router from '../Router'
import ReduxAppWrapper from '../ReduxAppWrapper/'
import { LocaleProvider } from '../../locales'
import { enabledDocuments } from '../Router/StepComponentMap'
import * as globals from '../ReduxAppWrapper/store/actions/globals'
import * as captures from '../ReduxAppWrapper/store/actions/captures'
import { RESET_STORE } from '../ReduxAppWrapper/constants'

class ModalApp extends Component {
  componentDidMount() {
    this.prepareInitialStore(this.props.options)
  }

  componentDidUpdate(prevProps) {
    this.prepareInitialStore(this.props.options, prevProps.options)
  }

  prepareInitialStore = (options = {}, prevOptions = {}) => {
    const { userDetails: { smsNumber } = {}, steps} = options
    const { userDetails: { smsNumber: prevSmsNumber } = {}, steps: prevSteps } = prevOptions

    if (smsNumber && smsNumber !== prevSmsNumber) {
      this.props.actions.setMobileNumber({smsNumber})
    }

    if (steps && steps !== prevSteps) {
      const enabledDocs = enabledDocuments(steps)
      if (enabledDocs.length === 1) {
        this.props.actions.setIdDocumentType(enabledDocs[0])
      }
    }
  }

  render= ({options: {useModal, isModalOpen, onModalRequestClose, containerId, shouldCloseOnOverlayClick, ...otherOptions}, ...otherProps }) => {
    return (
      <LocaleProvider language={this.props.options.language}>
          <Modal useModal={useModal} isOpen={isModalOpen} onRequestClose={onModalRequestClose} containerId={containerId} shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}>
              <Router options={otherOptions} {...otherProps} />
          </Modal>
      </LocaleProvider>
    )
  }
}


const mapStateToProps = (state) => ({
  ...state.globals,
  captures: state.captures
})

const mapDispatchToProps = () => ({
  actions: {
    ...globals,
    ...captures,
    reset: RESET_STORE
  }
})

const ConnectedModalApp = connect(mapStateToProps, mapDispatchToProps)(ModalApp)

const App = ({options}) =>
  <ReduxAppWrapper options={options}>
    <ConnectedModalApp options={options}/>
  </ReduxAppWrapper>

export default App
