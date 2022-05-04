import { h, FunctionComponent } from 'preact'
import { Input } from '@onfido/castor-react'
import classNames from 'classnames'
import { localised } from '~locales'
import styles from './styles.scss'

export type DateOfBirthInputProps = {
  name?: string
  value?: number | string
  invalid?: boolean
  onChange?: (ev: { target: { value: string } }) => void
}

const DateOfBirthInputComponent: FunctionComponent<DateOfBirthInputProps> = ({
  name,
  value,
  onChange,
  ...restInputProps
}) => {
  const [yyyy = '', mm = '', dd = ''] = `${value}`.split('-')

  const maxDd = getMaxDay(yyyy, mm)
  const maxYyyy = new Date().getFullYear()

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
          min={1}
          max={12}
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
          min={1}
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
          min={1900}
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
