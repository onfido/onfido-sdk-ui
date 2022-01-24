import { h } from 'preact'
import { useState } from 'preact/compat'
import { localised } from '~locales'
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

import type { StepComponentDataProps } from '~types/routers'
import { StepOptionData } from '~types/steps'

type DataProps = StepComponentDataProps & {
  title: string
  dataPath: string
  data: StepOptionData
  setPersonalData: (data: any, callback: () => void) => void
} & WithLocalisedProps

const Data = ({
  title,
  dataPath,
  data,
  nextStep,
  setPersonalData,
  translate,
}: DataProps): JSX.Element => {
  const [submitData, setSubmitData] = useState(data)
  const [validation, setValidation] = useState(
    Object.fromEntries(Object.entries(data).map(([key, value]) => [key, false]))
  )

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
      if (dataPath) setPersonalData({ [dataPath]: [submitData] }, nextStep)
      else setPersonalData(submitData, nextStep)
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
                  required
                  onChange={(value: string) => handleChange(key, value)}
                />
              ) : (
                <Input
                  type={getType(key) as any}
                  value={`${value}`}
                  invalid={validation[key]}
                  required={isRequired}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              )}
              {validation[key] && (
                <Validation state="error" withIcon>
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

export default localised(Data)
