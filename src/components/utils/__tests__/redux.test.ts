import { buildCaptureStateKey } from '../redux'

describe('utils', () => {
  describe('redux', () => {
    describe('buildCaptureStateKey', () => {
      it('should return correct state key for document payloads', () => {
        expect(buildCaptureStateKey({ method: 'document' })).toEqual(
          'document_front'
        )
        expect(
          buildCaptureStateKey({ method: 'document', side: 'front' })
        ).toEqual('document_front')
        expect(
          buildCaptureStateKey({ method: 'document', side: 'back' })
        ).toEqual('document_back')
        expect(
          buildCaptureStateKey({
            method: 'document',
            side: 'back',
            variant: 'video',
          })
        ).toEqual('document_video')
      })

      it('should return correct state key for face payloads', () => {
        expect(buildCaptureStateKey({ method: 'face' })).toEqual('face')
        expect(buildCaptureStateKey({ method: 'face', side: 'front' })).toEqual(
          'face'
        )
        expect(buildCaptureStateKey({ method: 'face', side: 'back' })).toEqual(
          'face'
        )
        expect(
          buildCaptureStateKey({
            method: 'face',
            side: 'back',
            variant: 'video',
          })
        ).toEqual('face')
      })
    })
  })
})
