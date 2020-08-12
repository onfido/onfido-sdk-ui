import { lowerCase, upperCase } from '../string.js'

test('Uppercase string transforms to lowercase', () => {
  expect(lowerCase('TOBELOWERCASE')).toBe('tobelowercase')
})

test('Lowercase string transforms to uppercase', () => {
  expect(upperCase('tobeuppercase')).toBe('TOBEUPPERCASE')
})
