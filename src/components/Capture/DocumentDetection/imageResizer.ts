import {
  ImageResizerConfiguration,
  ImageResizerResult,
  ImageType,
} from './config'

class ImageResizer {
  private readonly conf: ImageResizerConfiguration

  constructor(conf: ImageResizerConfiguration) {
    this.conf = conf
  }

  resize(src: ImageType): ImageResizerResult {
    // todo
    return {
      cropped_image: 'CHANGE_THIS_LATER_TO_REAL_TYPE',
      resized_image: 'CHANGE_THIS_LATER_TO_REAL_TYPE',
    }
  }
}

export { ImageResizer }
