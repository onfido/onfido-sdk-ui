import { h } from 'preact'
import { memo } from 'preact/compat'
import classNames from 'classnames'

import { useContainerDimensions } from '~contexts'
import { useLocales } from '~locales'
import style from './style.scss'

import type { DocumentTypes } from '~types/steps'

export type DocumentSizes =
  | 'id1Card'
  | 'id3Card'
  | 'rectangle'
  | 'frPaperDl'
  | 'itPaperId'

type DocTypeParams = {
  documentType?: DocumentTypes
  isPaperId?: boolean
  issuingCountry?: string
}

type ViewportDimensions = {
  width: number
  height: number
  hollowWidthRatio: number
}

type HollowRect = {
  left: number
  bottom: number
  width: number
  height: number
}

const DOCUMENT_ASPECT_RATIOS: Record<DocumentSizes, number> = {
  id1Card: 1.586,
  id3Card: 1.417,
  rectangle: 1.57,
  frPaperDl: 2.05,
  itPaperId: 1.367,
}

const ID1_SIZE_DOCUMENTS = new Set<DocumentTypes>([
  'driving_licence',
  'national_identity_card',
])

// Assume that the SVG viewport is (100, height)
const getViewport = (containerDimensions: DOMRect): ViewportDimensions => {
  const width = 100

  // Hollow width ratio = 90% for smaller viewports
  // and = 80% for bigger viewports
  const hollowWidthRatio =
    containerDimensions.width < window.innerWidth ? 0.8 : 0.9

  return {
    width,
    height: (width * containerDimensions.height) / containerDimensions.width,
    hollowWidthRatio,
  }
}

const getDocumentSize = ({
  documentType,
  isPaperId,
  issuingCountry,
}: DocTypeParams): DocumentSizes => {
  if (!documentType) {
    return 'rectangle'
  }

  if (isPaperId) {
    if (documentType === 'driving_licence' && issuingCountry === 'FR') {
      return 'frPaperDl'
    }

    if (documentType === 'national_identity_card' && issuingCountry === 'IT') {
      return 'itPaperId'
    }
  }

  return ID1_SIZE_DOCUMENTS.has(documentType) ? 'id1Card' : 'id3Card'
}

const getPlaceholder = ({
  documentType,
  isPaperId,
  issuingCountry,
}: DocTypeParams) => {
  if (documentType === 'passport') {
    return 'passport'
  }

  if (isPaperId) {
    if (documentType === 'driving_licence' && issuingCountry === 'FR') {
      return 'frPaperDl'
    }

    if (documentType === 'national_identity_card' && issuingCountry === 'IT') {
      return 'itPaperId'
    }
  }

  return 'card'
}

const calculateHollowRect = (
  docTypeParams: DocTypeParams,
  containerDimensions: DOMRect,
  upperScreen: boolean
): HollowRect => {
  const viewport = getViewport(containerDimensions)
  const size = getDocumentSize(docTypeParams)
  const { [size]: aspectRatio } = DOCUMENT_ASPECT_RATIOS

  const width = viewport.width * viewport.hollowWidthRatio
  const height = width / aspectRatio

  const left = (viewport.width - width) / 2
  const bottom = upperScreen
    ? viewport.height / 2
    : (viewport.height + height) / 2

  return { left, bottom, width, height }
}

const scaleHollowToContainer = (
  hollowRect: HollowRect,
  containerDimensions: DOMRect,
  upperScreen: boolean
): HollowRect => {
  const viewport = getViewport(containerDimensions)
  const { left, width, height } = hollowRect

  const bottom =
    (hollowRect.bottom * containerDimensions.width) / viewport.width

  // There're minor adjustments to align the rect right into the hollow frame
  return {
    bottom: upperScreen ? bottom - 2 : containerDimensions.height - bottom - 2,
    left: (left * containerDimensions.width) / viewport.width,
    width: (width * containerDimensions.width) / viewport.width - 2,
    height: (height * containerDimensions.width) / viewport.width,
  }
}

const drawInnerFrame = (
  docTypeParams: DocTypeParams,
  hollowRect: HollowRect
): string => {
  const { left, bottom, width, height } = hollowRect
  const radius = docTypeParams.documentType === 'passport' ? 2 : 0
  const startPoint = `M${[left + radius, bottom].join(',')}`

  const bottomLine = `h ${width - 2 * radius}`
  const rightLine = `v -${height - 2 * radius}`
  const topLine = `h -${width - 2 * radius}`
  const leftLine = `v ${height - 2 * radius}`

  const bottomRightCorner = `a ${radius},${radius} 0 0 0 ${radius},-${radius}`
  const topRightCorner = `a ${radius},${radius} 0 0 0 -${radius},-${radius}`
  const topLeftCorner = `a ${radius},${radius} 0 0 0 -${radius},${radius}`
  const bottomLeftCorner = `a ${radius},${radius} 0 0 0 ${radius},${radius}`

  const drawings = [
    startPoint,
    bottomLine,
    bottomRightCorner,
    rightLine,
    topRightCorner,
    topLine,
    topLeftCorner,
    leftLine,
    bottomLeftCorner,
    'Z',
  ]

  return drawings.join(' ')
}

export type Props = {
  ariaLabel?: string
  upperScreen?: boolean
  video?: boolean
  withPlaceholder?: boolean
  header?: JSX.Element
  footer?: JSX.Element
} & DocTypeParams

/**
 * Render a full-screen view with a SVG element
 * drawing an overlay for the camera view.
 * The SVG element contains 2 line draws: `inner` and `outer` in reversed direction:
 *  - M: start point
 *  - v<length>: draw a vertical line from the current point with <length>,
 *               <length> < 0 means reversed direction.
 *  - h<length>: draw a horizontal line from the current point with <length>,
 *               <length> < 0 means reversed direction.
 *
 *       M(0,0)
 *          ====>====>====>====>====>====>
 *          ⇑                            ‖
 *          ‖                            ‖
 *          ‖                            ‖
 *          ‖                            ‖
 *          ‖                            ⇓
 *          ⇑    <----<----<----<----    ‖
 *          ‖    |                  ↑    ‖
 *          ‖    |                  |    ‖
 *          ‖    |                  |    ‖
 *          ‖    ↓                  |    ⇓
 *          ⇑    ---->---->---->---->    ‖
 *          ‖ (inner                     ‖
 *          ‖  start                     ‖
 *          ‖  point)                    ‖
 *          ‖                            ⇓
 *          ⇑                            ‖
 *          ‖                            ‖
 *          ‖                            ‖
 *          ‖                            ‖
 *          ‖                            ⇓
 *          <====<====<====<====<====<====
 */
const DocumentOverlay = ({
  ariaLabel,
  upperScreen = false,
  video,
  withPlaceholder,
  header,
  footer,
  ...docTypeParams
}: Props) => {
  const { translate } = useLocales()
  const containerDimensions = useContainerDimensions()

  const viewport = getViewport(containerDimensions)
  const outer = `M0,0 h${viewport.width} v${viewport.height} h-${viewport.width} Z`
  const hollowRect = calculateHollowRect(
    docTypeParams,
    containerDimensions,
    upperScreen
  )
  const inner = drawInnerFrame(docTypeParams, hollowRect)

  const placeholderRect = scaleHollowToContainer(
    hollowRect,
    containerDimensions,
    upperScreen
  )

  const defaultAriaLabel = video
    ? translate('video_capture.frame_accessibility')
    : translate('selfie_capture.frame_accessibility')

  return (
    <div
      className={style.document}
      style={{
        height: containerDimensions.height,
        width: containerDimensions.width,
      }}
    >
      <svg
        data-size={getDocumentSize(docTypeParams)}
        shapeRendering="geometricPrecision"
        viewBox={`0 0 ${viewport.width} ${viewport.height}`}
      >
        <path className={style.fullScreen} d={`${outer} ${inner}`} />
        <path className={style.hollow} d={inner} />
      </svg>
      <div
        className={style.header}
        style={{
          top: 0,
          bottom:
            (hollowRect.bottom * containerDimensions.width) / viewport.width,
        }}
      >
        {header}
      </div>

      <div
        className={classNames(style.placeholder, {
          [style[getPlaceholder(docTypeParams)]]: withPlaceholder,
        })}
        style={placeholderRect}
      >
        <span aria-label={ariaLabel} className={style.ariaLabel}>
          {ariaLabel || defaultAriaLabel}
        </span>
      </div>
      <div
        className={style.footer}
        style={{
          top: (hollowRect.bottom * containerDimensions.width) / viewport.width,
        }}
      >
        {footer}
      </div>
    </div>
  )
}

export default memo(DocumentOverlay)
