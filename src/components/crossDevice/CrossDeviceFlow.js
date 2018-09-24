import { h, Component } from 'preact'
import Flow, { DynamicFlow } from '../Flow'
import Step from '../Step'
import Host, { CrossDeviceLink, ClientSuccess, CrossDeviceIntro } from '../crossDevice'
import { map } from '../utils/object'
import Complete from '../Complete'

export default function CrossDeviceFlow(props) {
  return (
    <Flow>
    {
      map({
        'intro': CrossDeviceIntro,
        'link': CrossDeviceLink,
        'host': Host,
        'complete': Complete,
      }, (Component, pathname) =>
        <Step pathname={pathname} key={pathname}>
          <Component {...props} />
        </Step>
      )
    }
    </Flow>
  )
}

export const DynamicCrossDeviceFlow = ({ i18n, trackScreen, ...props}) => (
  <DynamicFlow {...props}>
    <CrossDeviceFlow {...{ i18n, trackScreen }} />
  </DynamicFlow>
)
