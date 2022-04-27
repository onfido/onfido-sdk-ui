import { h } from 'preact'
import {
  createContext,
  useContext,
  useState,
  StateUpdater,
} from 'preact/compat'
import { useLocales } from '~locales'
import { color } from '@onfido/castor'
import { IconError } from '@onfido/castor-icons'
import classNames from 'classnames'
import theme from '../Theme/style.scss'
import ScreenLayout from '../Theme/ScreenLayout'
import PageTitle from '../PageTitle'
import {
  Field,
  FieldLabel,
  Validation,
  Input,
  Button,
  Asterisk,
} from '@onfido/castor-react'
import type { WithLocalisedProps } from '~types/hocs'
import CountrySelector from './CountrySelector'
import { DateOfBirthInput } from './DateOfBirthInput'

import type { StepComponentDataProps, CompleteStepValue } from '~types/routers'
import { StepOptionData } from '~types/steps'

const validationContext = createContext({} as ValidationState)
const ValidationProvider = validationContext.Provider

export const useValidation = () => useContext(validationContext)

type Validation = { [key: string]: boolean }

interface ValidationState {
  validation: Validation
  setValidation: StateUpdater<Validation>
}

type ProfileDataProps = StepComponentDataProps & {
  title: string
  dataPath: string
  data: StepOptionData
  nextStep: () => void
  completeStep: (data: CompleteStepValue) => void
} & WithLocalisedProps

const ProfileData = ({
  title,
  dataPath,
  data,
  nextStep,
  completeStep,
}: ProfileDataProps) => {
  const [submitData, setSubmitData] = useState(data)
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
  const [validation, setValidation] = useState<Validation>(
    Object.fromEntries(Object.entries(data).map(([key]) => [key, false]))
  )
  const { translate } = useLocales()

  const validate = (): boolean => {
    let valid = true

    Object.entries(submitData).forEach(([key, value]) => {
      if (!value && !['state'].includes(key)) {
        valid = false
        setValidation((validation) => ({
          ...validation,
          [key]: true,
        }))
      }
    })

    return valid
  }

  const handleChange = (key: string, value: string) => {
    if (validation[key]) {
      setValidation((validation) => ({ ...validation, [key]: false }))
    }
    setSubmitData((submitData) => ({ ...submitData, [key]: value }))
  }

  const handleSubmit = () => {
    setFormSubmitted(true)

    if (validate()) {
      if (dataPath) completeStep({ [dataPath]: submitData })
      else completeStep(submitData)

      nextStep()
    }
  }

  const actions = (
    <Button
      onClick={handleSubmit}
      className={classNames(theme['button-centered'], theme['button-lg'])}
    >
      {translate('profile_data.button_submit')}
    </Button>
  )

  return (
    <ScreenLayout actions={actions}>
      <PageTitle title={translate(`profile_data.${title}`) || title} />
      <ValidationProvider value={{ validation, setValidation }}>
        {Object.entries(submitData).map(([key, value]) => {
          const isRequired = !['state'].includes(key)

          return (
            <Field key={key}>
              <FieldLabel>
                <span>
                  {translate(`profile_data.${key}`) || key}
                  {isRequired && <Asterisk aria-label="required" />}
                </span>
                {key === 'country' ? (
                  <CountrySelector
                    value={`${value}`}
                    error={formSubmitted && validation[key]}
                    onChange={(value: string) => handleChange(key, value)}
                  />
                ) : key === 'dob' ? (
                  <DateOfBirthInput
                    fieldKey={key}
                    name={key}
                    value={`${value}`}
                    invalid={formSubmitted && validation[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                ) : (
                  <Input
                    type="text"
                    value={`${value}`}
                    invalid={formSubmitted && validation[key]}
                    required={isRequired}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                )}
                {formSubmitted && validation[key] && (
                  <Validation state="error">
                    <IconError fill={color('error-500')} />
                    {translate('profile_data.required_error')}
                  </Validation>
                )}
              </FieldLabel>
            </Field>
          )
        })}
      </ValidationProvider>
    </ScreenLayout>
  )
}

export default ProfileData
