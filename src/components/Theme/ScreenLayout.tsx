import { h, Fragment, FunctionComponent, VNode } from 'preact'
import classNames from 'classnames'
import theme from './style.scss'

type ScreenLayoutProps = {
  actions?: VNode
  className?: string
  pageId?: string
}

const ScreenLayout: FunctionComponent<ScreenLayoutProps> = ({
  actions,
  children,
  className,
  pageId,
}) => {
  return (
    <Fragment>
      <div
        className={classNames(theme.scrollableContent, className)}
        data-page-id={pageId}
      >
        {children}
      </div>
      <div className={theme.actionsContainer}>{actions}</div>
    </Fragment>
  )
}

export default ScreenLayout
