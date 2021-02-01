import {
  h,
  Fragment,
  FunctionComponent,
  ComponentChildren,
  VNode,
} from 'preact'
import theme from './style.scss'

type ScreenLayoutProps = {
  children: ComponentChildren
  actions?: VNode
}

const ScreenLayout: FunctionComponent<ScreenLayoutProps> = ({
  children,
  actions,
}) => {
  return (
    <Fragment>
      <div className={theme.scrollableContent}>{children}</div>
      {actions}
    </Fragment>
  )
}

export default ScreenLayout
