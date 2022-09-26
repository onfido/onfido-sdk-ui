import { buildIteratorKey } from '~utils'

test('buildIteratorKey', () => {
  expect(buildIteratorKey('Some normal Latin characters')).toBe(
    'U29tZSBub3JtYWwgTGF0aW4gY2hhcmFjdGVycw=='
  )

  // Non-Latin characters
  expect(() => buildIteratorKey('ąęśćłź')).not.toThrow()
})
