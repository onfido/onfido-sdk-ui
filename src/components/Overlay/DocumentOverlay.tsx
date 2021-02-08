import { h, FunctionComponent } from 'preact'
import style from './style.scss'

import type { DocumentTypes } from '~types/steps'

type DocumentSizes = 'id1Card' | 'id3Card' | 'rectangle'

const OUTER_WIDTH = 100
const OUTER_HEIGHT = (100 * window.innerHeight) / window.innerWidth
const INNER_WIDTH_RATIO = 0.9 // 90% of outer width
const FILL_COLOR = 'rgba(0, 0, 0, 0.7)'

const ASPECT_RATIOS: Record<DocumentSizes, number> = {
  id1Card: 1.586,
  id3Card: 1.42,
  rectangle: 1.57,
}

export type Props = {
  type?: DocumentTypes
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

const drawInnerFrame = (
  aspectRatio: number,
  percentileFromBottom: number = undefined,
  tilt = false
): string => {
  const width = OUTER_WIDTH * INNER_WIDTH_RATIO
  const height = width / aspectRatio

  if (tilt) {
    return ``
  }

  const startX = (OUTER_WIDTH - width) / 2

  /**
   * If no percentileFromBottom provided,
   * calculate to show to inner frame at the middle of the screen
   */
  const startY = percentileFromBottom
    ? OUTER_HEIGHT * (1 - percentileFromBottom)
    : (OUTER_HEIGHT + height) / 2
  return `M${[startX, startY].join(',')} h${width} v-${height} h-${width} Z`
}

const DocumentOverlay: FunctionComponent<Props> = ({ type }) => {
  const size = getDocumentSize(type)
  const { [size]: aspectRatio } = ASPECT_RATIOS

  const outer = `M0,0 h${OUTER_WIDTH} v${OUTER_HEIGHT} h-${OUTER_WIDTH} Z`
  const inner = drawInnerFrame(aspectRatio, 0.5)

  return (
    <svg
      className={style.document}
      viewBox={`0 0 ${OUTER_WIDTH} ${OUTER_HEIGHT}`}
      shapeRendering="geometricPrecision"
    >
      <path d={`${outer} ${inner}`} fill={FILL_COLOR} stroke="transparent" />
      <path d={inner} fill="transparent" stroke="white" strokeWidth={0.25} />
    </svg>
  )
}

export default DocumentOverlay
