declare module 'react-webcam-onfido' {
  import { Component } from 'react'

  type ConstraintTypes = number | Record<string, unknown>
  type FacingModeLiterals = 'user' | 'environment'
  type FacingModeType = FacingModeLiterals | { exact: FacingModeLiterals }

  type ConstraintPayload = {
    video: {
      facingMode?: FacingModeType
      height?: number
      width?: number
    }
    audio?: boolean
  }

  type CameraType = {
    audio?: boolean
    className?: string
    facingMode?: FacingModeType
    fallbackHeight?: ConstraintTypes
    fallbackWidth?: ConstraintTypes
    height?: ConstraintTypes
    onFailure: (error: Error) => void
    onUserMedia: () => void
    screenshotFormat?: 'image/webp' | 'image/png' | 'image/jpeg'
    width?: ConstraintTypes
  }

  export default interface Webcam extends Component<CameraType> {
    getConstraints(
      width?: number,
      height?: number,
      facingMode?: FacingModeType,
      audio?: boolean
    ): ConstraintPayload

    getCanvas(): HTMLCanvasElement | null
  }
}
