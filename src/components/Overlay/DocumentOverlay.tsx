import { h, FunctionComponent } from 'preact'
import { memo, useRef } from 'preact/compat'
import style from './style.scss'

import type { DocumentTypes } from '~types/steps'

type DocumentSizes = 'id1Card' | 'id3Card' | 'rectangle'

// Assume that the SVG viewport is (100, OUTER_HEIGHT)
const OUTER_WIDTH = 100
const OUTER_HEIGHT = (OUTER_WIDTH * window.innerHeight) / window.innerWidth
const INNER_WIDTH_RATIO = 0.9 // 90% of outer width

const ASPECT_RATIOS: Record<DocumentSizes, number> = {
  id1Card: 1.586,
  id3Card: 1.42,
  rectangle: 1.57,
}

const ID1_SIZE_DOCUMENTS = new Set<DocumentTypes>([
  'driving_licence',
  'national_identity_card',
])

const getDocumentSize = (type?: DocumentTypes): DocumentSizes => {
  if (!type) {
    return 'rectangle'
  }

  return ID1_SIZE_DOCUMENTS.has(type) ? 'id1Card' : 'id3Card'
}

type InnerRect = {
  left: number
  bottom: number
  width: number
  height: number
}

const calculateInnerRect = (
  documentType?: DocumentTypes,
  marginBottom?: number,
  scaleToSvgViewport = false
): InnerRect => {
  const size = getDocumentSize(documentType)
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

  return {
    left: (left * window.innerWidth) / OUTER_WIDTH,
    bottom: (bottom * window.innerWidth) / OUTER_WIDTH,
    width: (width * window.innerWidth) / OUTER_WIDTH,
    height: (height * window.innerWidth) / OUTER_WIDTH,
  }
}

const drawInnerFrame = (
  documentType?: DocumentTypes,
  marginBottom?: number
): string => {
  const { left, bottom, width, height } = calculateInnerRect(
    documentType,
    marginBottom,
    true
  )
  const startPoint = [left, bottom].join(',')
  const bottomLine = `l ${width} 0`
  const rightLine = `v -${height}`
  const topLine = `l -${width} 0`

  return `M${startPoint} ${bottomLine} ${rightLine} ${topLine} Z`
}

export type Props = {
  marginBottom?: number
  type?: DocumentTypes
  withPlaceholder?: boolean
}

const DocumentOverlay: FunctionComponent<Props> = ({
  children,
  marginBottom,
  type,
  withPlaceholder,
}) => {
  const highlightFrameRef = useRef<SVGPathElement>(null)

  const outer = `M0,0 h${OUTER_WIDTH} v${OUTER_HEIGHT} h-${OUTER_WIDTH} Z`
  const inner = drawInnerFrame(type, marginBottom)

  return (
    <div className={style.document}>
      <svg
        data-size={getDocumentSize(type)}
        shapeRendering="geometricPrecision"
        viewBox={`0 0 ${OUTER_WIDTH} ${OUTER_HEIGHT}`}
      >
        <path className={style.hollow} d={`${outer} ${inner}`} />
        <path className={style.highlight} d={inner} ref={highlightFrameRef} />
      </svg>
      {withPlaceholder && (
        <span
          className={style.placeholder}
          style={calculateInnerRect(type, marginBottom)}
        />
      )}
      {children}
    </div>
  )
}

export default memo(DocumentOverlay)
