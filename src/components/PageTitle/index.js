import { h, Component } from 'preact'
import { withFullScreenState } from '../FullScreen'
import style from './style.css'
import classNames from 'classnames'

class PageTitle extends Component {

  componentDidUpdate(prevProps) {
    const { subTitle } = this.props
    if (subTitle !== prevProps.subTitle) {
      this.container.focus()
    }
  }

  render() {
    const { title, subTitle, smaller, isFullScreen, className } = this.props
    return (
      <div
        className={classNames(
          style.titleWrapper,
          {
            [style.smaller]: smaller && !isFullScreen,
            [style.fullScreen]: isFullScreen,
          },
          className
        )}
      >
        <div
          className={style.title}
          role="heading"
          aria-level="1"
          aria-live="assertive">
          <span
            className={style.titleSpan}
            tabIndex={-1}
            ref={(node) => (this.container = node)}
          >
            {title}
          </span>
        </div>
        {subTitle && (
          <div className={style.subTitle} role="heading" aria-level="2">
            {subTitle}
          </div>
        )}
      </div>
    )
  }
}

export default withFullScreenState(PageTitle)
