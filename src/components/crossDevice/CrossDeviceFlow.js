import { h, Component } from 'preact'
import Flow from '../Flow'
import Step from '../Step'
import Host, { CrossDeviceLink, ClientSuccess, CrossDeviceIntro } from '../crossDevice'
import { map } from '../utils/object'
import Complete from '../Complete'

export default function DocumentFlow(props) {
  return (
    <Flow>
    {
      map({
        'intro': CrossDeviceIntro,
        'link': CrossDeviceLink,
        'host': Host,
        'complete': Complete,
      }, (Component, path) =>
        <Step path={path} key={path}>
          <Component {...props} />
        </Step>
      )
    }
    </Flow>
  )
}
