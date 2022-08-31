import { h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/compat'
import classNames from 'classnames'
import { space } from '@onfido/castor'
import {
  Field,
  FieldLabel,
  HelperText,
  Validation,
  Input,
  Button,
} from '@onfido/castor-react'
import { useLocales } from '~locales'
import ScreenLayout from '../Theme/ScreenLayout'
import PageTitle from '../PageTitle'
import theme from '../Theme/style.scss'
import { CountrySelector } from './CountrySelector'
import { StateSelector } from './StateSelector'
import { DateOfBirthInput, getMaxDay } from './DateOfBirthInput'
import { SSNInput } from './SSNInput'
import style from './style.scss'

import type { StepComponentDataProps, CompleteStepValue } from '~types/routers'
import type { StepOptionData } from '~types/steps'
import type { WithLocalisedProps } from '~types/hocs'
import type { TranslateCallback } from '~types/locales'
import Spinner from '../Spinner'
import { Consent } from 'components/UserConsent/Consent'
import { ConsentTemplate, useConsents } from './useConsents'

export type ProfileDataProps = StepComponentDataProps & {
  title: string
  dataSubPath: string
  dataFields: string[]
  disabledFields: string[]
  ssnEnabled?: StepOptionData['ssn_enabled']
  getPersonalData: StepOptionData['getPersonalData']
  nextStep: () => void
  completeStep: (data: CompleteStepValue) => void
  consents: { id: 'mno' | 'ssn'; url: string }[]
} & WithLocalisedProps

const ProfileData = ({
  title,
  dataSubPath,
  dataFields,
  disabledFields,
  ssnEnabled,
  getPersonalData,
  nextStep,
  completeStep,
  consents = [],
}: ProfileDataProps) => {
  const { translate } = useLocales()
  const { consentsData, consentsStatus, handleConsentChange } = useConsents(
    consents
  )
  const [formData, setFormData] = useState(() => {
    const personalData = getPersonalData()
    const pathData = dataSubPath
      ? personalData[dataSubPath] ?? {}
      : personalData

    return {
      // make empty data values with fields described
      ...dataFields.reduce((acc, curr) => ({ ...acc, [curr]: '' }), {}),
      // override values with already set personal data
      ...Object.fromEntries(
        Object.entries(pathData as Record<string, unknown>).filter(([key]) =>
          dataFields.includes(key)
        )
      ),
    }
  })

  // Touchers are a set of functions that can be executed to "touch" fields.
  // Upon touching a field, it can "invalidate" itself.
  // They also return a field validity state, so a form can check if fields
  // are valid at that moment.
  const [touchers, setTouchers] = useState<Array<Toucher>>([])

  const setToucher: SetToucherFunc = useCallback((type, toucher) => {
    setTouchers((touchers) => [...touchers, { type, toucher }])
  }, [])

  const removeToucher: RemoveRoucherFunc = useCallback((type) => {
    setTouchers((touchers) =>
      touchers.filter((toucher) => toucher.type !== type)
    )
  }, [])

  const handleChange: FieldValueChangeFunc = (type, value) => {
    setFormData((formData) => ({ ...formData, [type]: `${value}` }))
  }

  const handleSubmit = () => {
    let isFormValid = true

    touchers.forEach(({ toucher }) => {
      if (!toucher() && isFormValid) isFormValid = false
    })

    if (!isFormValid) return

    const cleanedFormData = Object.fromEntries(
      // do not send empty values to API, instead remove those entries
      Object.entries(formData).filter(([, value]) => value !== '')
    )

    const data = dataSubPath
      ? {
          [dataSubPath]: cleanedFormData,
        }
      : {
          ...cleanedFormData,
        }

    if (consentsData.length > 0) {
      data.consents = consentsData.map(({ id, granted }) => ({ [id]: granted }))
    }

    completeStep(data)
    nextStep()
  }

  if (consentsStatus === 'error') {
    return (
      <div data-page-id={'Error'}>
        <p>There was a server error!</p>
        <p>Please try reloading the app, and try again.</p>
      </div>
    )
  }

  if (consentsStatus !== 'done') {
    return <Spinner />
  }

  return (
    <ScreenLayout pageId={'ProfileData'}>
      <PageTitle title={translate(`profile_data.${title}`)} />
      <div className={style['form']}>
        {Object.entries(formData).map(([type, value]) => (
          <FieldComponent
            key={type}
            type={type as FieldType}
            value={String(value)}
            selectedCountry={
              (getPersonalData() as { address: { country: string } })?.address
                ?.country
            }
            ssnEnabled={ssnEnabled}
            disabled={(disabledFields || []).includes(type)}
            setToucher={setToucher}
            removeToucher={removeToucher}
            onChange={handleChange}
          />
        ))}
        {consentsData.map(({ id, granted, ...consent }) => (
          <FieldComponent
            key={id}
            type={`consent-${id}`}
            value={granted}
            consent={consent}
            disabled={false}
            setToucher={setToucher}
            removeToucher={removeToucher}
            onChange={(_, checked) => handleConsentChange(id, Boolean(checked))}
          />
        ))}
        <Button
          onClick={handleSubmit}
          className={classNames(
            theme['button-centered'],
            theme['button-lg'],
            style['submit-button']
          )}
        >
          {translate('profile_data.button_continue')}
        </Button>
      </div>
    </ScreenLayout>
  )
}

type FieldType =
  | 'first_name'
  | 'last_name'
  | 'dob'
  | 'ssn'
  | 'country'
  | 'line1'
  | 'line2'
  | 'line3'
  | 'town'
  | 'state'
  | 'postcode'

type ConsentType = 'consent-mno' | 'consent-ssn'

type Toucher = {
  type: FieldComponentProps['type']
  toucher: ToucherFunc
}

type ToucherFunc = () => boolean
type SetToucherFunc = (
  type: FieldComponentProps['type'],
  toucher: ToucherFunc
) => void
type RemoveRoucherFunc = (type: FieldComponentProps['type']) => void

type FieldValueChangeFunc = (
  type: FieldValue['type'],
  value: FieldValue['value']
) => void

type FieldValue =
  | {
      type: FieldType
      value: string
    }
  | {
      type: ConsentType
      value: boolean
      consent: ConsentTemplate
    }

type FieldComponentProps = FieldValue & {
  selectedCountry?: string
  disabled: boolean
  setToucher: SetToucherFunc
  removeToucher: RemoveRoucherFunc
  onChange: FieldValueChangeFunc
} & Pick<ProfileDataProps, 'ssnEnabled'>

const FieldComponent = (props: FieldComponentProps) => {
  const {
    type,
    value,
    selectedCountry,
    ssnEnabled,
    setToucher,
    removeToucher,
    onChange,
  } = props

  const { translate } = useLocales()

  const isRequired = isFieldRequired(type, selectedCountry, ssnEnabled)
  const [isTouched, setIsTouched] = useState<boolean>(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const isInvalid = Boolean(validationError)

  useEffect(() => {
    setToucher(type, () => {
      setIsTouched(true)
      return !isInvalid
    })
    return () => {
      removeToucher(type)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, isInvalid])

  useEffect(() => {
    setValidationError(validateField(props)(translate))
  }, [props, translate])

  const handleBlur = () => {
    if (!isTouched) setIsTouched(true)
  }

  const handleChange = (ev: {
    target: { value: FieldValue['value'] }
  }): void => {
    onChange(type, ev.target.value)
  }

  // edge cases when field component should not be rendered at all
  if (
    (type === 'line3' && selectedCountry === 'USA') ||
    (type === 'state' && selectedCountry !== 'USA') ||
    (type === 'ssn' && (selectedCountry !== 'USA' || !ssnEnabled))
  ) {
    if (value) onChange(type, '') // removed value if was already set
    return null
  }

  return (
    <Field className={style['field']}>
      <FieldLabel>
        <span>
          {getTranslatedFieldLabel(translate, type, selectedCountry)}
          {!isRequired && (
            <span className={style['optional']}>
              {` ${translate('profile_data.field_optional')}`}
            </span>
          )}
        </span>
        {getTranslatedFieldHelperText(translate, type, selectedCountry)}
      </FieldLabel>
      {getFieldComponent(
        {
          ...props,
          invalid: isTouched && isInvalid,
          required: isRequired,
          onBlur: handleBlur,
          onChange: handleChange,
        },
        selectedCountry
      )}
      {isTouched && isInvalid && (
        <Validation state="error">{validationError}</Validation>
      )}
    </Field>
  )
}

const getFieldComponent = (
  props: FieldValue & {
    disabled: boolean
    invalid: boolean
    required: boolean
    onBlur: () => void
    onChange: (ev: { target: { value: FieldValue['value'] } }) => void
  },
  country?: FieldComponentProps['selectedCountry']
) => {
  const { type, onChange } = props

  switch (type) {
    case 'country':
      return <CountrySelector {...props} />
    case 'state':
      return <StateSelector {...props} />
    case 'dob':
      return <DateOfBirthInput {...props} country={country} />
    case 'postcode':
      return <Input {...props} type="text" style={{ width: space(22) }} />
    case 'ssn':
      return <SSNInput {...props} style={{ width: space(22) }} />
    case 'consent-mno':
      return (
        <Consent
          {...props}
          id={type}
          params={new Map()}
          onGrant={(grant) => onChange({ target: { value: grant } })}
        />
      )
    case 'consent-ssn':
      return (
        <Consent
          {...props}
          id={type}
          expandable={false}
          params={new Map()}
          onGrant={(grant) => onChange({ target: { value: grant } })}
        />
      )

    default:
      return <Input {...props} type="text" />
  }
}

const getTranslatedFieldLabel = (
  translate: TranslateCallback,
  type: FieldComponentProps['type'],
  country?: FieldComponentProps['selectedCountry']
) =>
  translate(
    `profile_data.${
      translateSpecific('label', type, country) || `field_labels.${type}`
    }`
  )

const getTranslatedFieldHelperText = (
  translate: TranslateCallback,
  type: FieldComponentProps['type'],
  country?: FieldComponentProps['selectedCountry']
) => {
  const specificTranslation = translateSpecific('helper_text', type, country)

  if (specificTranslation) {
    return (
      <HelperText>
        {translate(`profile_data.${specificTranslation}`)}
      </HelperText>
    )
  }

  switch (type) {
    case 'dob':
      return <HelperText>{getLocalisedDobFormatExample(country)}</HelperText>
    default:
      return null
  }
}

const getLocalisedDobFormatExample = (country: string | undefined) => {
  switch (country) {
    case 'USA':
      return 'MM / DD / YYYY'
    default:
      return 'DD / MM / YYYY'
  }
}

const isFieldRequired = (
  type: FieldComponentProps['type'],
  country?: FieldComponentProps['selectedCountry'],
  ssnEnabled?: FieldComponentProps['ssnEnabled']
): boolean => {
  const requiredFields = [
    'first_name',
    'last_name',
    'dob',
    'country',
    'line1',
    'postcode',
    'consent-mno',
    'consent-ssn',
  ]

  if (country === 'USA') {
    requiredFields.push('state')
    if (ssnEnabled) {
      requiredFields.push('ssn')
    }
  }

  return requiredFields.includes(type)
}

const validateField = ({
  type,
  value,
  selectedCountry,
  ssnEnabled,
}: FieldComponentProps) => (translate: TranslateCallback): string | null => {
  // consents granted
  if ((type === 'consent-mno' || type === 'consent-ssn') && !value) {
    return translate(`profile_data.field_validation.required_consent`)
  }

  // required values
  if (isFieldRequired(type, selectedCountry, ssnEnabled) && !value) {
    return translate(
      `profile_data.${
        translateSpecific('validation_required', type, selectedCountry) ||
        `field_validation.required_${type}`
      }`
    )
  }

  // invalid symbols/format
  if (
    (['first_name', 'last_name'].includes(type) &&
      /[\^!#$%*=<>;{}"]+/.test(value as string)) ||
    (['line1', 'line2', 'line3', 'town', 'postcode'].includes(type) &&
      /[\^!$%*=<>]+/.test(value as string))
  ) {
    return translate('profile_data.field_validation.invalid')
  }
  if (type === 'dob') {
    const [yyyy = '', mm = '', dd = ''] = value.split('-')

    const validity = {
      yyyy: true,
      mm: true,
      dd: true,
    }

    const parsedDd = parseInt(dd, 10)
    if (!parsedDd || parsedDd < 1 || parsedDd > getMaxDay(yyyy, mm)) {
      validity.dd = false
    }

    const parsedMm = parseInt(mm, 10)
    if (!parsedMm || parsedMm < 1 || parsedMm > 12) {
      validity.mm = false
    }

    const parsedYyyy = parseInt(yyyy, 10)
    if (
      !parsedYyyy ||
      parsedYyyy < 1900 ||
      parsedYyyy > new Date().getFullYear()
    ) {
      validity.yyyy = false
    }

    if (!Object.values(validity).every(Boolean)) {
      return translate('profile_data.field_validation.invalid_dob')
    }
  }
  if (type === 'ssn' && selectedCountry === 'USA' && ssnEnabled) {
    if (!/^\d{3}-?\d{2}-?\d{4}$/.test(value)) {
      return translate('profile_data.field_validation.usa_specific.invalid_ssn')
    }
  }

  const valueByteLength = new TextEncoder().encode(value as string).length

  // value too short
  if (
    (type === 'last_name' && valueByteLength < 2) ||
    (type === 'postcode' &&
      selectedCountry &&
      ['GBP', 'USA'].includes(selectedCountry) &&
      valueByteLength < 5)
  ) {
    return translate(
      `profile_data.${
        translateSpecific('validation_too_short', type, selectedCountry) ||
        `field_validation.too_short_${type}`
      }`
    )
  }

  // value too long
  if (
    (type === 'first_name' && valueByteLength >= 20) ||
    (type === 'last_name' && valueByteLength >= 20) ||
    (['line1', 'line2', 'line3'].includes(type) && valueByteLength >= 70) ||
    (type === 'town' && valueByteLength >= 30) ||
    (type === 'postcode' &&
      (!selectedCountry || !['GBP', 'USA'].includes(selectedCountry)) &&
      valueByteLength > 15) ||
    (type === 'postcode' && selectedCountry === 'GBR' && valueByteLength > 8) ||
    (type === 'postcode' && selectedCountry === 'USA' && valueByteLength > 5)
  ) {
    return translate(
      `profile_data.${
        translateSpecific('validation_too_long', type, selectedCountry) ||
        `field_validation.too_long_${type}`
      }`
    )
  }

  return null
}

const translateSpecific = (
  translationType:
    | 'label'
    | 'helper_text'
    | 'validation_required'
    | 'validation_too_short'
    | 'validation_too_long',
  fieldType: FieldComponentProps['type'],
  country?: FieldComponentProps['selectedCountry']
): string | null => {
  switch (`${translationType}_${fieldType}_${country?.toLocaleLowerCase()}`) {
    case 'label_ssn_usa':
      return 'field_labels.usa_specific.ssn'
    case 'label_town_gbr':
      return 'field_labels.gbr_specific.town'
    case 'label_postcode_gbr':
      return 'field_labels.gbr_specific.postcode'
    case 'label_state_usa':
      return 'field_labels.usa_specific.state'
    case 'label_postcode_usa':
      return 'field_labels.usa_specific.postcode'
    case 'helper_text_line1_usa':
      return 'field_labels.usa_specific.line1_helper_text'
    case 'helper_text_line2_usa':
      return 'field_labels.usa_specific.line2_helper_text'
    case 'validation_required_ssn_usa':
      return 'field_validation.usa_specific.required_ssn'
    case 'validation_invalid_ssn_usa':
      return 'field_validation.usa_specific.invalid_ssn'
    case 'validation_required_postcode_gbr':
      return 'field_validation.gbr_specific.required_postcode'
    case 'validation_required_state_usa':
      return 'field_validation.usa_specific.required_state'
    case 'validation_required_postcode_usa':
      return 'field_validation.usa_specific.required_postcode'
    case 'validation_too_short_postcode_gbr':
      return 'field_validation.gbr_specific.too_short_postcode'
    case 'validation_too_short_postcode_usa':
      return 'field_validation.usa_specific.too_short_postcode'
    case 'validation_too_long_postcode_gbr':
      return 'field_validation.gbr_specific.too_long_postcode'
    case 'validation_too_long_postcode_usa':
      return 'field_validation.usa_specific.too_long_postcode'
  }

  return null
}

export default ProfileData
