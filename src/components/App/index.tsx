import { h, FunctionComponent } from 'preact'
import { Icons } from '@onfido/castor-icons'
import ReduxAppWrapper from '../ReduxAppWrapper/'
import ModalApp, { ModalAppProps } from './ModalApp'
import { ErrorBoundary } from '~core/ExceptionHandler'

const App: FunctionComponent<ModalAppProps> = ({ options }) => (
  <ErrorBoundary>
    <ReduxAppWrapper>
      <Icons />
      <ModalApp options={options} />
    </ReduxAppWrapper>
  </ErrorBoundary>
)

export default App
