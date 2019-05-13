// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import Pannable from '../Pannable'
import Button from '../Button'
import { localised } from '../../locales'
import type { LocalisedType } from '../../locales'
import { withNavigationDisabledState, withNavigationDisableAction } from '../NavigationBar'
import { withFullScreenState, withFullScreenAction } from '../FullScreen'
import { compose } from '../utils/func'

type Props = {
  src: string,
  altTag: string,
  enlargedAltTag: string,
  isNavigationDisabled: boolean,
  isFullScreen: boolean,
  setNavigationDisabled: boolean => void,
  setFullScreen: boolean => void,
} & LocalisedType

type State = {
  isExpanded: boolean,
  hasEntered: boolean,
}

class EnlargedPreview extends Component<Props, State> {
  previewContainer: ?HTMLDivElement
  image: ?Pannable

  state = {
    isExpanded: false,
    hasEntered: false,
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    if (nextState.isExpanded !== nextProps.isNavigationDisabled) {
      this.props.setNavigationDisabled(nextState.isExpanded)
    }
    if (nextState.isExpanded !== nextProps.isFullScreen) {
      this.props.setFullScreen(nextState.isExpanded)
    }
  }

  componentWillUnmount() {
    this.props.setNavigationDisabled(false)
    this.props.setFullScreen(false)
  }

  handleImageLoad = () => {
    if (this.image) {
      this.image.center()
    }
  }

  toggle = () => this.setState({
    isExpanded: !this.state.isExpanded,
    hasEntered: false,
  }, () => {
    this.setState({ hasEntered: true })

    if (this.previewContainer) {
      this.previewContainer.focus()
    }
  }
  )

  render() {
    const { isExpanded, hasEntered } = this.state
    const { translate, src, altTag, enlargedAltTag } = this.props
    return (
      <div
        className={classNames({
          [style.expanded]: isExpanded,
          [style.entered]: hasEntered,
        }, style.container)}
      >
        <div
          ref={node => this.previewContainer = node}
          tabIndex={-1}
          aria-label={isExpanded ? enlargedAltTag : altTag}
          aria-expanded={`${isExpanded}`}
          role='img'
        >
          {
            isExpanded &&
              <Pannable
                ref={ node => this.image = node }
                className={style.imageContainer}
              >
                <img onLoad={this.handleImageLoad} className={style.image} src={src} alt={enlargedAltTag} />
              </Pannable>
          }
        </div>
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
  withNavigationDisabledState,
  withNavigationDisableAction,
  withFullScreenState,
  withFullScreenAction,
  localised
)(EnlargedPreview)
