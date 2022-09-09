import {
  BlurValidationConfiguration,
  ValidationContext,
  ValidationResult,
} from '../config'
import { Validator } from '../validatorFactory'

class BlurValidator implements Validator {
  private readonly conf: BlurValidationConfiguration

  constructor(conf: BlurValidationConfiguration) {
    this.conf = conf
  }

  validate = (
    context: ValidationContext,
    accumulator: ValidationResult
  ): ValidationResult => {
    // TODO
    return {
      ...{ accumulator },
      ...{
        validationSuccess: true,
        BlurValidationResult: {
          has_blur: false,
          laplacian_variance: 22,
        },
      },
    }
  }

  dispose = () => {}
}

export { BlurValidator }
