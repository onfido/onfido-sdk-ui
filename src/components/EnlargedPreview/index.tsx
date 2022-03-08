import { h, Component } from 'preact'
import classNames from 'classnames'
import Pannable from '../Pannable'
import { localised } from '~locales'
import {
  withNavigationDisabledState,
  withNavigationDisableAction,
} from '../NavigationBar'
import {
  withFullScreenState,
  withFullScreenAction,
  WithFullScreenActionProps,
  WithFullScreenStateProps,
} from '../FullScreen'
import style from './style.scss'
import {
  WithLocalisedProps,
  WithNavigationDisabledActionProps,
  WithNavigationDisabledStateProps,
} from '~types/hocs'

type EnlargedPreviewProps = {
  src?: string
  altTag?: string
} & WithLocalisedProps &
  WithFullScreenActionProps &
  WithFullScreenStateProps &
  WithNavigationDisabledStateProps &
  WithNavigationDisabledActionProps

type EnlargedPreviewState = {
  isExpanded: boolean
}

class EnlargedPreview extends Component<
  EnlargedPreviewProps,
  EnlargedPreviewState
> {
  previewContainer: HTMLDivElement | null = null
  image: Pannable | null = null

  state = {
    isExpanded: false,
  }

  componentWillUpdate(
    nextProps: EnlargedPreviewProps,
    nextState: EnlargedPreviewState
  ) {
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

  toggle = () =>
    this.setState(
      {
        isExpanded: !this.state.isExpanded,
      },
      () => this.previewContainer?.focus()
    )

  render() {
    const { isExpanded } = this.state
    const { translate, src, altTag } = this.props
    return (
      <div
        className={classNames(
          {
            [style.expanded]: isExpanded,
          },
          style.container
        )}
      >
        <div
          ref={(node) => (this.previewContainer = node)}
          tabIndex={-1}
          aria-label={altTag}
          aria-live={isExpanded ? 'assertive' : 'off'}
          aria-expanded={isExpanded.toString()}
          role="img"
        >
          {isExpanded && (
            <Pannable
              ref={(node: Pannable) => (this.image = node)}
              className={style.imageContainer}
            >
              {/* The screen reader will announce the alt tag inside the parent div as the group has role="img"
              so here the img will just have an empty string as alt tag */}
              <img
                onLoad={this.handleImageLoad}
                className={style.image}
                src={src}
                alt={''}
              />
            </Pannable>
          )}
        </div>
        <button
          type="button"
          aria-labelledby="onfido-preview-button-label"
          className={classNames(style.button, style['button-overlay'])}
          onClick={this.toggle}
        >
          <span
            id="onfido-preview-button-label"
            className={style['button-text']}
          >
            {isExpanded
              ? translate('doc_confirmation.button_close')
              : translate('doc_confirmation.button_zoom')}
          </span>
        </button>
      </div>
    )
  }
}

export default withNavigationDisabledState(
  withNavigationDisableAction(
    withFullScreenState(withFullScreenAction(localised(EnlargedPreview)))
  )
)
