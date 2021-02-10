import { h, FunctionComponent } from 'preact'
import ReduxAppWrapper from '../ReduxAppWrapper/'
import ModalApp, { ModalAppProps } from './ModalApp'

const App: FunctionComponent<ModalAppProps> = ({ options }) => (
  <ReduxAppWrapper>
    <ModalApp options={options} />
  </ReduxAppWrapper>
)

export default App
