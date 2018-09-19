import { h, Component } from 'preact'
import Tree, { Leaf } from '../Tree'
import Host, { CrossDeviceLink, ClientSuccess, CrossDeviceIntro } from '../crossDevice'
import { map } from '../utils/object'
import Complete from '../Complete'

export default function DocumentJourney(props) {
  return (
    <Tree>
    {
      map({
        'intro': CrossDeviceIntro,
        'link': CrossDeviceLink,
        'host': Host,
        'complete': Complete,
      }, (Component, path) =>
        <Leaf path={path} key={path}>
          <Component {...props} />
        </Leaf>
      )
    }
    </Tree>
  )
}
