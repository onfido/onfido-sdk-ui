import { renderHook, act } from '@testing-library/preact'
import useMultiFrameCaptureStep from '../useMultiFrameCaptureStep'

describe('useMultiFrameCaptureStep', () => {
  it('should goes through defined states and can be reset', () => {
    const { result } = renderHook(() => useMultiFrameCaptureStep())
    expect(result.current?.captureStep).toBe('intro')

    act(() => result.current?.nextStep())
    expect(result.current?.captureStep).toBe('capture')

    act(() => result.current?.restart())
    expect(result.current?.captureStep).toBe('intro')
  })

  it('should return default record for each step', () => {
    const { result } = renderHook(() => useMultiFrameCaptureStep())
    expect(result.current?.recordState).toBe('placeholder')

    act(() => result.current?.nextStep())
    expect(result.current?.recordState).toBe('scanning')

    act(() => result.current?.nextRecordState())
    expect(result.current?.recordState).toBe('success')
  })
})
