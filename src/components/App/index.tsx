import { h, FunctionComponent } from 'preact'
import ReduxAppWrapper from '../ReduxAppWrapper/'
import ModalApp, { ModalAppProps } from './ModalApp'

const App: FunctionComponent<ModalAppProps> = ({ options, configuration }) => (
  <ReduxAppWrapper>
    <ModalApp options={options} configuration={configuration} />
  </ReduxAppWrapper>
)

export default App
