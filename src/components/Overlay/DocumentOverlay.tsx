import { h, FunctionComponent } from 'preact'
import style from './style.scss'

import type { TiltModes } from '~types/docVideo'
import type { DocumentTypes } from '~types/steps'

type DocumentSizes = 'id1Card' | 'id3Card' | 'rectangle'

type DrawFrameParams = {
  aspectRatio: number
  marginBottom?: number
  tilt?: TiltModes
}

const OUTER_WIDTH = 100
const OUTER_HEIGHT = (100 * window.innerHeight) / window.innerWidth
const INNER_WIDTH_RATIO = 0.9 // 90% of outer width
const TILT_DELTA = 5

const ASPECT_RATIOS: Record<DocumentSizes, number> = {
  id1Card: 1.586,
  id3Card: 1.42,
  rectangle: 1.57,
}

export type Props = {
  marginBottom?: number
  tilt?: TiltModes
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

const drawInnerFrame = ({
  aspectRatio,
  marginBottom,
  tilt,
}: DrawFrameParams): string => {
  const width = OUTER_WIDTH * INNER_WIDTH_RATIO
  const height = width / aspectRatio

  const startX = (OUTER_WIDTH - width) / 2

  /**
   * If no marginBottom provided,
   * calculate to show to inner frame at the middle of the screen
   */
  const startY = marginBottom
    ? OUTER_HEIGHT * (1 - marginBottom)
    : (OUTER_HEIGHT + height) / 2

  if (tilt) {
    const startPoint =
      tilt === 'left'
        ? [startX + TILT_DELTA, startY - TILT_DELTA].join(',')
        : [startX + TILT_DELTA, startY + TILT_DELTA].join(',')
    const tiltedWidth = width - TILT_DELTA * 2

    const heightDelta = tilt === 'left' ? TILT_DELTA * 2 : -TILT_DELTA * 2
    const tiltedHeight = height + heightDelta

    const bottomLine = `l ${tiltedWidth} ${heightDelta}`
    const rightLine = `v -${tiltedHeight}`
    const topLine = `l -${tiltedWidth} ${heightDelta}`

    return `M${startPoint} ${bottomLine} ${rightLine} ${topLine} Z`
  }

  const startPoint = [startX, startY].join(',')
  const bottomLine = `l ${width} 0`
  const rightLine = `v -${height}`
  const topLine = `l -${width} 0`

  return `M${startPoint} ${bottomLine} ${rightLine} ${topLine} Z`
}

const DocumentOverlay: FunctionComponent<Props> = ({
  marginBottom,
  tilt,
  type,
}) => {
  const size = getDocumentSize(type)
  const { [size]: aspectRatio } = ASPECT_RATIOS

  const outer = `M0,0 h${OUTER_WIDTH} v${OUTER_HEIGHT} h-${OUTER_WIDTH} Z`
  const inner = drawInnerFrame({ aspectRatio, marginBottom, tilt })

  return (
    <div className={style.document}>
      <svg
        shapeRendering="geometricPrecision"
        viewBox={`0 0 ${OUTER_WIDTH} ${OUTER_HEIGHT}`}
      >
        <path className={style.hollow} d={`${outer} ${inner}`} />
        <path className={style.highlight} d={inner} />
      </svg>
    </div>
  )
}

export default DocumentOverlay
