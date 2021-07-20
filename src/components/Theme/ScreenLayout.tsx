import { h, Fragment, FunctionComponent, VNode } from 'preact'
import classNames from 'classnames'
import theme from './style.scss'

type ScreenLayoutProps = {
  actions?: VNode
  className?: string
}

const ScreenLayout: FunctionComponent<ScreenLayoutProps> = ({
  actions,
  children,
  className,
}) => {
  return (
    <Fragment>
      <div className={classNames(theme.scrollableContent, className)}>
        {children}
      </div>
      <div className={theme.actionsContainer}>{actions}</div>
    </Fragment>
  )
}

export default ScreenLayout
