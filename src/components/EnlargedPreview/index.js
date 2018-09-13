// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import theme from '../Theme/style.css'
import Pannable from '../Pannable'

type Props = {
  i18n: Object,
  src: string,
  useFullScreen: boolean => void,
}

type State = {
  isExpanded: boolean,
  hasEntered: boolean,
}

export default class EnlargedPreview extends Component<Props, State> {
  container: ?HTMLElement

  state = {
    isExpanded: false,
    hasEntered: false,
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    if (nextState.isExpanded !== this.state.isExpanded) {
      this.props.useFullScreen(nextState.isExpanded)
    }
  }

  handleImageLoad = () => {
    if (this.container) {
      this.container.center()
    }
  }

  toggle = () => this.setState({
    isExpanded: !this.state.isExpanded,
    hasEntered: false,
  }, () =>
    this.setState({ hasEntered: true })
  )

  onTouchMove = (ev) => {
    ev.preventDefault()
  }

  render() {
    const { isExpanded, hasEntered } = this.state
    const { i18n, src } = this.props
    return (
      <div
        className={classNames({
          [style.expanded]: isExpanded,
          [style.entered]: hasEntered,
        })}
      >
      {
        isExpanded &&
          <Pannable
            ref={ node => this.container = node }
            className={style.imageContainer}
          >
            <img onLoad={this.handleImageLoad} className={style.image} src={src} />
          </Pannable>
      }
        <button
          className={classNames(theme.btn, theme['btn-alternative'], style.button)}
          onClick={ this.toggle }>{
          isExpanded ?
            i18n.t('confirm.enlarge_image.close') :
            i18n.t('confirm.enlarge_image.enlarge')
        }</button>
      </div>
    )
  }
}