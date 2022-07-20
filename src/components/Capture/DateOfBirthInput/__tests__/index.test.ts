import {
  getMaxDay,
  getLocalisedInputFormat,
  getInputParams,
  makeInputName,
  makeFieldValue,
  makeFullFieldValue,
} from '../index'

describe('getMaxDay', () => {
  it('should return max day when year and month are provided', () => {
    expect(getMaxDay('2022', '02')).toEqual(28)
  })

  it('should return max day fallback when year is provided', () => {
    expect(getMaxDay('2022', undefined)).toEqual(31)
  })

  it('should return max day fallback when month is provided', () => {
    expect(getMaxDay(undefined, '04')).toEqual(30)
  })

  it('should return max day fallback when nothing is provided', () => {
    expect(getMaxDay(undefined, undefined)).toEqual(31)
  })
})

describe('getLocalisedInputFormat', () => {
  const values = ['USA', 'UK', undefined]

  it('should return a format of 3 values', () => {
    values.forEach((value) => {
      expect(getLocalisedInputFormat(value)).toHaveLength(3)
    })
  })

  it('should have valid format values', () => {
    values.forEach((value) => {
      getLocalisedInputFormat(value).forEach((value) => {
        expect(value).toMatch(/^year|month|day$/)
      })
    })
  })
})

describe('getInputParams', () => {
  const formats: ['year', 'month', 'day'] = ['year', 'month', 'day']

  it('should return an object with correct keys', () => {
    formats.forEach((format) => {
      expect(Object.keys(getInputParams(format)).sort()).toEqual(
        ['valueType', 'placeholder', 'size', 'maxLength'].sort()
      )
    })
  })
})

describe('makeInputName', () => {
  it('should return name based on component name', () => {
    expect(makeInputName('year', 'component')).toEqual('component-year')
  })

  it('should fallback to input name when no component name is provided', () => {
    expect(makeInputName('year')).toEqual('year')
  })
})

describe('makeFieldValue', () => {
  it('should return value when it is provided', () => {
    expect(makeFieldValue('12', '25')).toEqual('12')
  })

  it('should return fallback when no value is provided', () => {
    expect(makeFieldValue(undefined, '25')).toEqual('25')
  })
})

describe('makeFullFieldValue', () => {
  it('should use day from values', () => {
    expect(makeFullFieldValue('2022', '05', '21', { dd: '22' })).toEqual(
      '2022-05-22'
    )
  })

  it('should use month from values', () => {
    expect(makeFullFieldValue('2022', '05', '21', { mm: '06' })).toEqual(
      '2022-06-21'
    )
  })

  it('should use year from values', () => {
    expect(makeFullFieldValue('2022', '05', '21', { yyyy: '2023' })).toEqual(
      '2023-05-21'
    )
  })
})
