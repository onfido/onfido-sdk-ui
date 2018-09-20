import { h, Component } from 'preact'
import Steps, { Step } from '../Steps'
import Host, { CrossDeviceLink, ClientSuccess, CrossDeviceIntro } from '../crossDevice'
import { map } from '../utils/object'
import Complete from '../Complete'

export default function DocumentJourney(props) {
  return (
    <Steps>
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
    </Steps>
  )
}
