import { h } from 'preact'
import {
  createContext,
  useContext,
  useState,
  StateUpdater,
} from 'preact/compat'
import classNames from 'classnames'
import {
  Field,
  FieldLabel,
  Validation,
  Input,
  InputProps,
  Button,
  Asterisk,
} from '@onfido/castor-react'
import { useLocales } from '~locales'
import ScreenLayout from '../Theme/ScreenLayout'
import PageTitle from '../PageTitle'
import theme from '../Theme/style.scss'
import CountrySelector from './CountrySelector'
import { DateOfBirthInput } from './DateOfBirthInput'
import style from './style.scss'

import type { StepComponentDataProps, CompleteStepValue } from '~types/routers'
import type { FlatStepOptionData } from '~types/steps'
import type { WithLocalisedProps } from '~types/hocs'

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
  data: FlatStepOptionData
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

  const handleChange = (key: fieldType, value: InputProps['value']) => {
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
        {Object.entries(submitData).map(([type, value]) => (
          <FieldComponent
            key={type}
            type={type as fieldType}
            value={value as FieldComponentProps['value']}
            invalid={validation[type]}
            formSubmitted={formSubmitted}
            selectedCountry={submitData.country}
            onChange={handleChange}
          />
        ))}
      </ValidationProvider>
    </ScreenLayout>
  )
}

type fieldType =
  | 'first_name'
  | 'last_name'
  | 'dob'
  | 'country'
  | 'line1'
  | 'line2'
  | 'line3'
  | 'town'
  | 'state'
  | 'postcode'

type FieldValueChangeFunc = (
  type: FieldComponentProps['type'],
  value: FieldComponentProps['value']
) => void

type FieldComponentProps = {
  type: fieldType
  value: number | string
  invalid?: boolean
  formSubmitted?: boolean
  selectedCountry?: ProfileDataProps['data']['country']
  onChange: FieldValueChangeFunc
}

const FieldComponent = ({
  type,
  value,
  invalid,
  formSubmitted,
  selectedCountry,
  onChange,
}: FieldComponentProps) => {
  const { translate } = useLocales()

  const isRequired = isFieldRequired(type, selectedCountry)

  const handleChange = ({
    target: { value },
  }: {
    target: { value: FieldComponentProps['value'] }
  }): void => {
    onChange(type, value)
  }

  if (type === 'line3' && selectedCountry === 'USA') {
    if (value) onChange(type, '')
    return null
  }
  if (type === 'state' && selectedCountry !== 'USA') {
    if (value) onChange(type, '')
    return null
  }

  return (
    <Field>
      <FieldLabel>
        <span>
          {translate(`profile_data.${type}`)}
          {isRequired ? (
            <Asterisk aria-label="required" />
          ) : (
            <span className={style['optional']}>
              {` ${translate('profile_data.optional')}`}
            </span>
          )}
        </span>
        {getFieldComponent(type, {
          value,
          invalid: formSubmitted && invalid,
          required: isRequired,
          onChange: handleChange,
        })}
        {formSubmitted && invalid && (
          <Validation state="error">
            {translate('profile_data.required_error')}
          </Validation>
        )}
      </FieldLabel>
    </Field>
  )
}

const getFieldComponent = (
  type: fieldType,
  props: {
    value: FieldComponentProps['value']
    invalid: InputProps['invalid']
    required: InputProps['required']
    onChange: (ev: { target: { value: string } }) => void
  }
) => {
  switch (type) {
    case 'country':
      return <CountrySelector {...props} />
    case 'dob':
      return <DateOfBirthInput fieldKey={type} {...props} />
    default:
      return <Input type="text" {...props} />
  }
}

const isFieldRequired = (type: fieldType, country?: string) => {
  const requiredFields = [
    'first_name',
    'last_name',
    'dob',
    'country',
    'line1',
    'postcode',
  ]

  if (country === 'USA') {
    requiredFields.push('state')
  }

  return requiredFields.includes(type)
}

export default ProfileData
