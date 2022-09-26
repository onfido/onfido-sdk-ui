import { buildStepFinder } from '../steps'

describe('utils', () => {
  describe('steps', () => {
    describe('buildStepFinder', () => {
      it('returns a function with empty arrays', () => {
        const findStep = buildStepFinder([])
        expect(findStep).toBeInstanceOf(Function)
        expect(findStep('welcome')).toBeUndefined()
      })

      it('returns a working function with non-empty arrays', () => {
        const findStep = buildStepFinder([
          { type: 'welcome' },
          { type: 'document', options: { documentTypes: { passport: true } } },
        ])
        expect(findStep).toBeInstanceOf(Function)
        expect(findStep('welcome')).toMatchObject({ type: 'welcome' })
        expect(findStep('document')).toMatchObject({
          type: 'document',
          options: { documentTypes: { passport: true } },
        })
        expect(findStep('face')).toBeUndefined()
      })
    })
  })
})
