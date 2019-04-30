// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import Pannable from '../Pannable'
import Button from '../Button'
import { localised } from '../../locales'
import type { LocalisedType } from '../../locales'
import { withFullScreenAction, withFullScreenState } from '../FullScreen'
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
    if (nextState.isExpanded !== nextProps.isFullScreen) {
      this.props.setFullScreen(nextState.isExpanded)
    }
  }

  componentWillUnmount() {
    if (this.props.isFullScreen) {
      this.props.setFullScreen(false)
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
        }, style.container)}
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
        <Button
          className={style.button}
          textClassName={style['button-text']}
          variants={["alternative"]}
          onClick={this.toggle}
        >
          {isExpanded ?
            translate('confirm.enlarge_image.close') :
            translate('confirm.enlarge_image.enlarge')
          }
        </Button>
      </div>
    )
  }
}

export default compose(
  withFullScreenAction,
  withFullScreenState,
  localised
)(EnlargedPreview)
