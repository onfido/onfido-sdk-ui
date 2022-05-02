import { h, FunctionComponent } from 'preact'
import { Icons } from '@onfido/castor-icons'
import ReduxAppWrapper from '../ReduxAppWrapper/'
import ModalApp, { ModalAppProps } from './ModalApp'

const App: FunctionComponent<ModalAppProps> = ({ options }) => (
  <ReduxAppWrapper>
    <Icons />
    <ModalApp options={options} />
  </ReduxAppWrapper>
)

export default App
