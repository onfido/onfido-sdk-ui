import { h } from 'preact'
import DynamicFlow from '../flow'
import CrossDeviceFlow from './CrossDeviceFlow'

const FlowChanger = props => (
  <DynamicFlow {...props}>
    <CrossDeviceFlow />
  </DynamicFlow>
)