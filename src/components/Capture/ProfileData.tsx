import { h, Component } from 'preact'
import { useState } from 'preact/compat'
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
  InputProps,
} from '@onfido/castor-react'
import type { WithLocalisedProps } from '~types/hocs'
import CountrySelector from './CountrySelector'

import type { StepComponentDataProps, CompleteStepValue } from '~types/routers'
import { StepOptionData } from '~types/steps'

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
  const [validation, setValidation] = useState(
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
                  error={validation[key]}
                  onChange={(value: string) => handleChange(key, value)}
                />
              ) : (
                <Input
                  type={getType(key) as InputProps['type']}
                  value={`${value}`}
                  invalid={validation[key]}
                  required={isRequired}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              )}
              {validation[key] && (
                <Validation state="error">
                  <IconError fill={color('error-500')} />
                  {translate('profile_data.required_error')}
                </Validation>
              )}
            </FieldLabel>
          </Field>
        )
      })}
    </ScreenLayout>
  )
}

const getType = (key: string) => {
  switch (key) {
    case 'dob':
      return 'date'
    default:
      return 'text'
  }
}

export default ProfileData
