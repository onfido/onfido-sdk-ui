import { h, Fragment, ComponentType, ComponentChildren, VNode } from 'preact'
import theme from './style.scss'

type ScreenLayoutProps = {
  children: ComponentChildren
  actions?: ComponentType | VNode
}

const ScreenLayout = ({ children, actions }: ScreenLayoutProps) => {
  return (
    <Fragment>
      <div className={theme.scrollableContent}>{children}</div>
      {actions && actions}
    </Fragment>
  )
}

export default ScreenLayout
