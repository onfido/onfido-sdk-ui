import { h, FunctionComponent } from 'preact'
import { memo } from 'preact/compat'
import classNames from 'classnames'

import { useContainerDimensions } from '~contexts'
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

const ASPECT_RATIOS: Record<DocumentSizes, number> = {
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
  // and = 70% for bigger viewports
  const hollowWidthRatio =
    containerDimensions.width < window.innerWidth ? 0.7 : 0.9

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

export const calculateHollowRect = (
  docTypeParams: DocTypeParams,
  containerDimensions: DOMRect,
  marginBottom?: number,
  scaleToSvgViewport = false
): HollowRect => {
  const viewport = getViewport(containerDimensions)
  const size = getDocumentSize(docTypeParams)
  const { [size]: aspectRatio } = ASPECT_RATIOS

  const width = viewport.width * viewport.hollowWidthRatio
  const height = width / aspectRatio

  const left = (viewport.width - width) / 2

  /**
   * If no marginBottom provided,
   * calculate to show to inner frame at the middle of the screen
   */
  const bottom = marginBottom
    ? viewport.height * (1 - marginBottom)
    : (viewport.height + height) / 2

  if (scaleToSvgViewport) {
    return { left, bottom, width, height }
  }

  // There're minor adjustments to align the rect right into the hollow frame
  return {
    left: (left * containerDimensions.width) / viewport.width,
    bottom: (bottom * containerDimensions.width) / viewport.width,
    width: (width * containerDimensions.width) / viewport.width - 2,
    height: (height * containerDimensions.width) / viewport.width - 2,
  }
}

const drawInnerFrame = (
  docTypeParams: DocTypeParams,
  containerDimensions: DOMRect,
  marginBottom?: number
): string => {
  const { left, bottom, width, height } = calculateHollowRect(
    docTypeParams,
    containerDimensions,
    marginBottom,
    true
  )
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
  marginBottom?: number
  withPlaceholder?: boolean
} & DocTypeParams

const DocumentOverlay: FunctionComponent<Props> = ({
  children,
  marginBottom,
  withPlaceholder,
  ...docTypeParams
}) => {
  const containerDimensions = useContainerDimensions()
  const viewport = getViewport(containerDimensions)
  const outer = `M0,0 h${viewport.width} v${viewport.height} h-${viewport.width} Z`
  const inner = drawInnerFrame(docTypeParams, containerDimensions, marginBottom)

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
      {withPlaceholder && (
        <span
          className={classNames(
            style.placeholder,
            style[getPlaceholder(docTypeParams)]
          )}
          style={calculateHollowRect(
            docTypeParams,
            containerDimensions,
            marginBottom
          )}
        />
      )}
      {children}
    </div>
  )
}

export default memo(DocumentOverlay)
