import {
  EdgeValidationConfiguration,
  ValidationContext,
  ValidationResult,
} from '../config'
import { Validator } from '../validatorFactory'

class EdgeValidator implements Validator {
  private readonly conf: EdgeValidationConfiguration

  constructor(conf: EdgeValidationConfiguration) {
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
        EdgeValidationResult: {
          enough_edges_detected: true,
          total_edges_detected: 4,
        },
      },
    }
  }

  dispose = () => {}
}

export { EdgeValidator }
