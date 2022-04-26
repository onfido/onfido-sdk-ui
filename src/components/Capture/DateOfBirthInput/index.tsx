import { h, FunctionComponent } from 'preact'
import { useEffect } from 'preact/compat'
import { Input } from '@onfido/castor-react'
import classNames from 'classnames'
import { localised } from '~locales'
import { useValidation } from '../ProfileData'
import styles from './DateOfBirthInput.scss'

export type DateOfBirthInputProps = {
  fieldKey: string
  name?: string
  value?: number | string
  invalid?: boolean
  onChange?: (ev: { target: { value: string } }) => void
}

const DateOfBirthInputComponent: FunctionComponent<DateOfBirthInputProps> = ({
  fieldKey,
  name,
  value,
  onChange,
  ...restInputProps
}) => {
  const { setValidation } = useValidation()

  const [yyyy = '', mm = '', dd = ''] = `${value}`.split('-')

  const minDd = 1
  const maxDd = getMaxDay(yyyy, mm)

  const minMm = 1
  const maxMm = 12

  const minYyyy = 1900
  const maxYyyy = new Date().getFullYear()

  useEffect(() => {
    const validity = {
      yyyy: true,
      mm: true,
      dd: true,
    }

    const parsedDd = parseInt(dd, 10)
    if (!parsedDd || parsedDd < minDd || parsedDd > maxDd) {
      validity.dd = false
    }

    const parsedMm = parseInt(mm, 10)
    if (!parsedMm || parsedMm < minMm || parsedMm > maxMm) {
      validity.mm = false
    }

    const parsedYyyy = parseInt(yyyy, 10)
    if (!parsedYyyy || parsedYyyy < minYyyy || parsedYyyy > maxYyyy) {
      validity.yyyy = false
    }

    setValidation((validation) => ({
      ...validation,
      [fieldKey]: !Object.values(validity).every(Boolean),
    }))
  }, [fieldKey, yyyy, mm, dd, maxDd, maxYyyy, setValidation])

  const changeFieldValue = (
    type: 'yyyy' | 'mm' | 'dd',
    value: number | string
  ) => {
    const fullValue = makeFullFieldValue(yyyy, mm, dd, {
      [type]: typeof value === 'string' ? value : value.toString(),
    })

    onChange?.({ target: { value: fullValue } })
  }

  return (
    <div className={styles['componentContainer']}>
      <div className={classNames(styles['inputContainer'], styles['small'])}>
        <Input
          {...restInputProps}
          type="number"
          name={makeInputName('month', name)}
          placeholder="MM"
          value={mm}
          min={minMm}
          max={maxMm}
          onChange={({ target: { value } }) => changeFieldValue('mm', value)}
        />
      </div>
      <div className={classNames(styles['inputContainer'], styles['small'])}>
        <Input
          {...restInputProps}
          type="number"
          name={makeInputName('day', name)}
          placeholder="DD"
          value={dd}
          min={minDd}
          max={maxDd}
          onChange={({ target: { value } }) => changeFieldValue('dd', value)}
        />
      </div>
      <div className={classNames(styles['inputContainer'], styles['large'])}>
        <Input
          {...restInputProps}
          type="number"
          name={makeInputName('year', name)}
          placeholder="YYYY"
          value={yyyy}
          min={minYyyy}
          max={maxYyyy}
          onChange={({ target: { value } }) => changeFieldValue('yyyy', value)}
        />
      </div>
    </div>
  )
}

export const DateOfBirthInput = localised(DateOfBirthInputComponent)

export const getMaxDay = (yyyy = '', mm = ''): number => {
  const year = parseInt(yyyy, 10) || new Date().getFullYear()
  const month = parseInt(mm, 10)

  if (!month) return 31 // if we don't know the month, fallback to maximum number of days possible

  return new Date(year, month, 0).getDate()
}

export const makeInputName = (
  inputName: string,
  componentName?: DateOfBirthInputProps['name']
): string => (componentName ? `${componentName}-${inputName}` : inputName)

export const makeFieldValue = (
  value: DateOfBirthInputProps['value'],
  fallback: string
): string => (value !== undefined ? `${value}` : fallback)

export const makeFullFieldValue = (
  yyyy = '',
  mm = '',
  dd = '',
  values: { [key: string]: string }
): string =>
  [
    makeFieldValue(values.yyyy, yyyy),
    makeFieldValue(values.mm, mm),
    makeFieldValue(values.dd, dd),
  ].join('-')
