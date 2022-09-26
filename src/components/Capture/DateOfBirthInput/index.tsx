import { h, FunctionComponent } from 'preact'
import { Input } from '@onfido/castor-react'
import classNames from 'classnames'
import { localised } from '~locales'
import styles from './styles.scss'

export type DateOfBirthInputProps = {
  name?: string
  value?: number | string
  country?: string
  invalid?: boolean
  onChange?: (ev: { target: { value: string } }) => void
}

const DateOfBirthInputComponent: FunctionComponent<DateOfBirthInputProps> = ({
  name,
  value,
  country,
  onChange,
  ...restInputProps
}) => {
  const [yyyy = '', mm = '', dd = ''] = `${value}`.split('-')
  const valueMap = { yyyy, mm, dd }

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
      {getLocalisedInputFormat(country).map((format) => {
        const { valueType, placeholder, size, maxLength } = getInputParams(
          format
        )

        return (
          <div
            key={format}
            className={classNames(styles['inputContainer'], styles[size])}
          >
            <Input
              {...restInputProps}
              type="text"
              name={makeInputName(format, name)}
              placeholder={placeholder}
              value={valueMap[valueType]}
              maxLength={maxLength}
              onChange={({ target: { value } }) =>
                changeFieldValue(valueType, value)
              }
            />
          </div>
        )
      })}
    </div>
  )
}

export const DateOfBirthInput = localised(DateOfBirthInputComponent)

type InputFormat = 'year' | 'month' | 'day'

export const getLocalisedInputFormat = (
  country: string | undefined
): [InputFormat, InputFormat, InputFormat] => {
  switch (country) {
    case 'USA':
      return ['month', 'day', 'year']
    default:
      return ['day', 'month', 'year']
  }
}

export const getInputParams = (
  format: InputFormat
): {
  valueType: 'yyyy' | 'mm' | 'dd'
  placeholder: 'YYYY' | 'MM' | 'DD'
  size: 'small' | 'large'
  maxLength: number
} => {
  switch (format) {
    case 'year':
      return {
        valueType: 'yyyy',
        placeholder: 'YYYY',
        size: 'large',
        maxLength: 4,
      }
    case 'month':
      return {
        valueType: 'mm',
        placeholder: 'MM',
        size: 'small',
        maxLength: 2,
      }
    case 'day':
      return {
        valueType: 'dd',
        placeholder: 'DD',
        size: 'small',
        maxLength: 2,
      }
  }
}

export const getMaxDay = (yyyy = '', mm = ''): number => {
  const year = parseInt(yyyy, 10) || new Date().getFullYear()
  const month = parseInt(mm, 10)

  if (!month) return 31 // if we don't know the month, fallback to maximum number of days possible

  return new Date(year, month, 0).getDate()
}

export const makeInputName = (
  inputName: InputFormat,
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
