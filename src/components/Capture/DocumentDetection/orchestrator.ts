import { ImageType, RootConfiguration, ValidationResult } from './config'
import { ImageResizer } from './imageResizer'
import { Validator, ValidatorFactory } from './validatorFactory'

class Orchestrator {
  private readonly resizer: ImageResizer
  private readonly validators: Array<Validator>

  constructor(conf: RootConfiguration) {
    this.resizer = new ImageResizer(conf.ImageResizerConfiguration)
    const factory = new ValidatorFactory(conf)
    this.validators = factory.build()
  }

  validate = (src: ImageType): ValidationResult => {
    let validationResult: ValidationResult = {
      validationSuccess: false,
    }
    try {
      const resizerResult = this.resizer.resize(src)
      // todo
      const resized_gray = resizerResult.resized_image

      for (let i = 0; i < this.validators.length; i++) {
        validationResult = this.validators[i].validate(
          {
            resized_gray_image: resized_gray,
          },
          validationResult
        )
        if (!validationResult.validationSuccess) {
          // early return
          return validationResult
        }
      }
    } catch (error) {
      console.error(error)
      this.dispose()
      return {
        validationSuccess: false,
      }
    }

    return validationResult
  }

  // close all images
  dispose = () => {
    for (let i = 0; i < this.validators.length; i++) {
      this.validators[i].dispose()
    }
  }
}
