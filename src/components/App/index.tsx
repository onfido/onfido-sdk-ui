import { h, FunctionComponent } from 'preact'
import ReduxAppWrapper from '../ReduxAppWrapper/'
import ModalApp, { ModalAppProps } from './ModalApp'

const App: FunctionComponent<ModalAppProps> = ({
  options,
  internalConfiguration,
}) => (
  <ReduxAppWrapper>
    <ModalApp options={options} internalConfiguration={internalConfiguration} />
  </ReduxAppWrapper>
)

export default App
