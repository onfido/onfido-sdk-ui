import { h, Component, ComponentType } from 'preact'
import { withFullScreenState } from '../FullScreen'
import classNames from 'classnames'
import style from './style.scss'

type Props = {
  className?: string
  isFullScreen?: boolean
  smaller?: boolean
  subTitle?: string
  title: string
}

class PageTitle extends Component<Props> {
  private container?: HTMLSpanElement

  componentDidUpdate(prevProps: Props) {
    const { title, subTitle } = this.props

    if (title !== prevProps.title || subTitle !== prevProps.subTitle) {
      this.container && this.container.focus()
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
          aria-live="assertive"
        >
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

export default withFullScreenState<ComponentType<Props>>(PageTitle)
