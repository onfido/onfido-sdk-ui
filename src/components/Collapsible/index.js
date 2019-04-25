import { h, Component } from 'preact'
import classNames from 'classnames'
import style from './style.css'

export default class Collapsible extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isExpanded: props.defaultIsExpanded,
    }
  }

  toggleExpanded = () => {
    this.setState({ isExpanded: !this.state.isExpanded })
  }

  render() {
    const { className, trigger, children } = this.props;
    const { isExpanded } = this.state;
    return (
      <div className={classNames(style.wrapper, className, {
        [style.isExpanded]: isExpanded,
      })}>
        <button className={style.trigger} onClick={this.toggleExpanded}>
          { typeof trigger === 'function' ? trigger() : trigger }
        </button>
        { isExpanded ? children : null }
      </div>
    )
  }
}
