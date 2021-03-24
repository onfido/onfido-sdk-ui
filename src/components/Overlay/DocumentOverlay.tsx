import { h, FunctionComponent } from 'preact'
import { memo, useRef } from 'preact/compat'
import classNames from 'classnames'
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

type HollowRect = {
  left: number
  bottom: number
  width: number
  height: number
}

// Assume that the SVG viewport is (100, OUTER_HEIGHT)
const OUTER_WIDTH = 100
const OUTER_HEIGHT = (OUTER_WIDTH * window.innerHeight) / window.innerWidth
const INNER_WIDTH_RATIO = 0.9 // 90% of outer width

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
  marginBottom?: number,
  scaleToSvgViewport = false
): HollowRect => {
  const size = getDocumentSize(docTypeParams)
  const { [size]: aspectRatio } = ASPECT_RATIOS

  const width = OUTER_WIDTH * INNER_WIDTH_RATIO
  const height = width / aspectRatio

  const left = (OUTER_WIDTH - width) / 2

  /**
   * If no marginBottom provided,
   * calculate to show to inner frame at the middle of the screen
   */
  const bottom = marginBottom
    ? OUTER_HEIGHT * (1 - marginBottom)
    : (OUTER_HEIGHT + height) / 2

  if (scaleToSvgViewport) {
    return { left, bottom, width, height }
  }

  // There're minor adjustments to align the rect right into the hollow frame
  return {
    left: (left * window.innerWidth) / OUTER_WIDTH,
    bottom: (bottom * window.innerWidth) / OUTER_WIDTH - 2,
    width: (width * window.innerWidth) / OUTER_WIDTH - 4,
    height: (height * window.innerWidth) / OUTER_WIDTH - 2,
  }
}

const drawInnerFrame = (
  docTypeParams: DocTypeParams,
  marginBottom?: number
): string => {
  const { left, bottom, width, height } = calculateHollowRect(
    docTypeParams,
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
  const highlightFrameRef = useRef<SVGPathElement>(null)

  const outer = `M0,0 h${OUTER_WIDTH} v${OUTER_HEIGHT} h-${OUTER_WIDTH} Z`
  const inner = drawInnerFrame(docTypeParams, marginBottom)

  return (
    <div className={style.document}>
      <svg
        data-size={getDocumentSize(docTypeParams)}
        shapeRendering="geometricPrecision"
        viewBox={`0 0 ${OUTER_WIDTH} ${OUTER_HEIGHT}`}
      >
        <path className={style.fullScreen} d={`${outer} ${inner}`} />
        <path className={style.hollow} d={inner} ref={highlightFrameRef} />
      </svg>
      {withPlaceholder && (
        <span
          className={classNames(
            style.placeholder,
            style[getPlaceholder(docTypeParams)]
          )}
          style={calculateHollowRect(docTypeParams, marginBottom)}
        />
      )}
      {children}
    </div>
  )
}

export default memo(DocumentOverlay)
