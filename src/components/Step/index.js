import { h, Component } from 'preact'
import Node from '../Flow/Node'
    
export default ({ pathname, children, isFullScreen = false /* @todo */ }) => (
  <Node pathname={pathname}>
    {children}
  </Node>
)
