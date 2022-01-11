/** import { h } from 'preact'
import { useState } from 'preact/compat'
import PageTitle from '../PageTitle'
import {
  Field,
  FieldLabel,
  Validation,
  Input,
  Button,
  Asterisk,
} from '@onfido/castor-react'
//import CountrySelector from './CountrySelector'

import type { StepComponentDataProps } from '~types/routers'

type DataProps = StepComponentDataProps & {
  title: string
  dataPath: string
  setPersonalData: (data: any, callback: () => void) => void
}

const Data = ({
  title,
  dataPath,
  data,
  nextStep,
  setPersonalData,
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

  return (
    <div>
      <PageTitle title={title} />
      {Object.entries(submitData).map(([key, value]) => {
        const isRequired = !['state'].includes(key)

        return (
          <Field key={key}>
            <FieldLabel>
              <span>
                {translations[key] || key}
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
                  This field is required
                </Validation>
              )}
            </FieldLabel>
          </Field>
        )
      })}
      <br />
      <Button onClick={handleSubmit}>Next</Button>
    </div>
  )
}

const translations = {
  first_name: 'First name',
  last_name: 'Last name',
  dob: 'Date of birth',
  flat_number: 'Flat number',
  building_number: 'Building number',
  building_name: 'Building name',
  street: 'Street',
  sub_street: 'Sub-street',
  town: 'Town',
  postcode: 'Postcode',
  country: 'Country',
  state: 'State (US only)',
  line1: 'Line 1',
  line2: 'Line 2',
  line3: 'Line 3',
} as const

const getType = (key: string) => {
  switch (key) {
    case 'dob':
      return 'date'
    default:
      return 'text'
  }
}

export default Data
*/
