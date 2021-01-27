import { h, Fragment, ComponentType, ComponentChildren } from 'preact'
import theme from './style.scss'

type ScreenLayoutProps = {
  children: ComponentChildren
  actions?: ComponentType
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
