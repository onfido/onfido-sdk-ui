import { h, Component} from 'preact'
import { withFullScreenState } from '../FullScreen'
import style from './style.css'
import classNames from 'classnames'

class PageTitle extends Component {
  componentDidMount() {
    this.container.focus()
  }

  render() {
    const { title, subTitle, smaller, isFullScreen, className } = this.props
    return (
      <div className={classNames(
          style.titleWrapper,
          {
            [style.smaller]: smaller && !isFullScreen,
            [style.fullScreen]: isFullScreen
          },
          className
        )}>
        <div className={style.title}>
          <span className={style.titleSpan} role="heading" aria-level="1"
            aria-live="assertive" tabindex="-1" ref={node => this.container = node}
          >{title}</span>
        </div>
        { subTitle && <div className={style.subTitle}>{subTitle}</div> }
      </div>
    )
  }
}

export default withFullScreenState(PageTitle)
