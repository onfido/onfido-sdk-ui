// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import theme from '../Theme/style.css'

type Props = {
  i18n: Object,
  src: string,
  useFullScreen: boolean => void,
}

type State = {
  isExpanded: boolean,
}

export default class EnlargedPreview extends Component<Props, State> {
  container: ?HTMLElement

  state = {
    isExpanded: false,
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    if (nextState.isExpanded !== this.state.isExpanded) {
      this.props.useFullScreen(nextState.isExpanded)
    }
  }

  handleImageLoad = () => {
    if (this.container) {
      const { clientWidth, scrollWidth, clientHeight, scrollHeight } = this.container
      this.container.scrollLeft = (scrollWidth - clientWidth) / 2
      this.container.scrollTop = (scrollHeight - clientHeight) / 2
    }
  }

  toggle = () => this.setState({ isExpanded: !this.state.isExpanded })

  render() {
    const { isExpanded } = this.state
    const { i18n, src } = this.props
    return (
      <div className={classNames({
        [style.enlargedPreviewExpanded]: isExpanded,
      })}>
      {
        isExpanded &&
          <div
            ref={ node => this.container = node }
            className={style.enlargedPreviewImageContainer}
          >
            <img onLoad={this.handleImageLoad} className={style.enlargedPreviewImage} src={src} />
          </div>
      }
        <button
          className={classNames(theme.btn, theme['btn-alternative'], style.enlargedPreviewButton)}
          onClick={ this.toggle }>{
          isExpanded ?
            i18n.t('confirm.enlarge_image.close') :
            i18n.t('confirm.enlarge_image.enlarge')
        }</button>
      </div>
    )
  }
}