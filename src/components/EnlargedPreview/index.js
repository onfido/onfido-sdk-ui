// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import theme from '../Theme/style.css'
import Pannable from '../Pannable'
import { localised } from '../../locales'
import type { LocalisedType } from '../../locales'
import { withFullScreenAction } from '../FullScreen'
import { compose } from '../utils/func'

type Props = {
  src: string,
  setFullScreen: boolean => void,
} & LocalisedType

type State = {
  isExpanded: boolean,
  hasEntered: boolean,
}

class EnlargedPreview extends Component<Props, State> {
  container: ?Pannable

  state = {
    isExpanded: false,
    hasEntered: false,
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    if (nextState.isExpanded !== this.state.isExpanded) {
      this.props.setFullScreen(nextState.isExpanded)
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

  render() {
    const { isExpanded, hasEntered } = this.state
    const { translate, src } = this.props
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
            translate('confirm.enlarge_image.close') :
            translate('confirm.enlarge_image.enlarge')
        }</button>
      </div>
    )
  }
}

export default compose(
  withFullScreenAction,
  localised
)(EnlargedPreview)