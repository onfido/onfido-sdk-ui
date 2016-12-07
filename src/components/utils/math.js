const linearMapping = (intendedStart, intendedEnd, Xstart, Xend, X) =>
    (X-Xstart)/(Xend-Xstart) * (intendedEnd - intendedStart) + intendedStart

const centeredPos = (sourceWidth, intendedWidth) => (sourceWidth - intendedWidth)/2

export const centeredInnerRectangle = (sourceWidth, widthWeight, sourceHeight, heightWeight) => {
  const width = sourceWidth*widthWeight
  const height = sourceHeight*heightWeight
  return [centeredPos(sourceWidth, width), centeredPos(sourceHeight, height), width, height]
}

const boundToRange = (left, right, value) => {
  const leftHigher = left > right
  const lower = leftHigher ? right : left
  const upper = leftHigher ? left : right
  return limitRange(lower, upper, value)
}

const limitRange = (lower, upper, value) => {
  if (value > upper) return upper
  if (value < lower) return lower
  return value
}

export const linearMappingBound = (intendedStart, intendedEnd, ...rest) =>
  boundToRange( intendedStart, intendedEnd, linearMapping(intendedStart, intendedEnd, ...rest))
