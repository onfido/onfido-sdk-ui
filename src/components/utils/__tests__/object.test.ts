import { pick, omit } from '../object'

describe('pick', () => {
  it('should pick only the specified keys of an object', () => {
    expect(
      pick(
        {
          a: 1,
          b: 2,
          c: 3,
          d: 4,
        },
        ['b', 'd']
      )
    ).toEqual({
      b: 2,
      d: 4,
    })
  })

  it('should return an empty object if given an empty object', () => {
    expect(pick({}, ['b', 'd'])).toEqual({})
  })

  it('should return an empty object if given a falsey value', () => {
    expect(pick(null, ['b', 'd'])).toEqual({})
  })

  it("should ignore given keys that don't exist", () => {
    expect(
      pick(
        {
          a: 1,
          b: 2,
          c: 3,
          d: 4,
        },
        ['b', 'd', 'e']
      )
    ).toEqual({
      b: 2,
      d: 4,
    })
  })

  it('should return an empty object if given no keys', () => {
    expect(
      pick(
        {
          a: 1,
          b: 2,
          c: 3,
          d: 4,
        },
        []
      )
    ).toEqual({})
  })
})

describe('omit', () => {
  it('should omit only the specified keys of an object', () => {
    expect(
      omit(
        {
          a: 1,
          b: 2,
          c: 3,
          d: 4,
        },
        ['b', 'd']
      )
    ).toEqual({
      a: 1,
      c: 3,
    })
  })

  it('should return an empty object if given an empty object', () => {
    expect(omit({}, ['b', 'd'])).toEqual({})
  })

  it('should return an empty object if given a falsey value', () => {
    expect(omit(null, ['b', 'd'])).toEqual({})
  })

  it("should ignore given keys that don't exist", () => {
    expect(
      omit(
        {
          a: 1,
          b: 2,
          c: 3,
          d: 4,
        },
        ['b', 'd', 'e']
      )
    ).toEqual({
      a: 1,
      c: 3,
    })
  })

  it('should the original object if given no keys', () => {
    expect(
      omit(
        {
          a: 1,
          b: 2,
          c: 3,
          d: 4,
        },
        []
      )
    ).toEqual({
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    })
  })
})
