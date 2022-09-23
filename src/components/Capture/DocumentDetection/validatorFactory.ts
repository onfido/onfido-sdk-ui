import {
  RootConfiguration,
  ValidationContext,
  ValidationResult,
} from './config'
import { BlurValidator } from './Validators/blurValidator'
import { EdgeValidator } from './Validators/edgeValidator'

interface Validator {
  validate: (
    context: ValidationContext,
    accumulator: ValidationResult
  ) => ValidationResult

  dispose: () => void // clear all memory items
}

class ValidatorFactory {
  private readonly conf: RootConfiguration

  constructor(conf: RootConfiguration) {
    this.conf = conf
  }

  build() {
    // don't pass context configuration in the validators themselves, instead update each validator configuration to prevent if/else's in the validator themselves
    const validators: Array<Validator> = []
    for (let i = 0; i < this.conf.Validators.length; i++) {
      if (this.conf.Validators[i] === 'blur_opencv') {
        validators.push(
          new BlurValidator(this.conf.BlurValidationConfiguration)
        )
      }
      if (this.conf.Validators[i] === 'edge_opencv') {
        validators.push(
          new EdgeValidator(this.conf.EdgeValidationConfiguration)
        )
      }
    }
    return validators
  }
}

export { ValidatorFactory, Validator }
