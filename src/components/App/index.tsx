import { h, FunctionComponent } from 'preact'
import ReduxAppWrapper from '../ReduxAppWrapper/'
import ModalApp, { PassedProps as Props } from './ModalApp'

const App: FunctionComponent<Props> = ({ options }) => (
  <ReduxAppWrapper>
    <ModalApp options={options} />
  </ReduxAppWrapper>
)

export default App
