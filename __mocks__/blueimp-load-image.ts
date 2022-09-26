const loadImage = jest
  .fn()
  .mockImplementation((_blob, callback) =>
    callback(document.createElement('canvas'))
  )

export default loadImage
