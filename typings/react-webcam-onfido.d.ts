declare module 'react-webcam-onfido' {
  import { Component } from 'react'

  type ConstraintTypes = number | Record<string, unknown>
  type FacingModeLiterals = VideoFacingModeEnum
  type FacingModeType = FacingModeLiterals | { exact: FacingModeLiterals }

  type ConstraintPayload = {
    video: {
      facingMode?: FacingModeType
      height?: number
      width?: number
    }
    audio?: boolean
  }

  export type WebcamProps = {
    audio?: boolean
    className?: string
    facingMode?: FacingModeType
    fallbackHeight?: ConstraintTypes
    fallbackWidth?: ConstraintTypes
    height?: ConstraintTypes
    onFailure?: (error?: Error) => void
    onUserMedia?: () => void
    screenshotFormat?: 'image/webp' | 'image/png' | 'image/jpeg'
    width?: ConstraintTypes
  }

  export default class Webcam extends Component<WebcamProps> {
    stream: MediaStream
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    video?: HTMLVideoElement
    recordedBlobs: Blob[]
    mediaRecorder: MediaRecorder

    getConstraints(
      width?: number,
      height?: number,
      facingMode?: FacingModeType,
      audio?: boolean
    ): ConstraintPayload

    getCanvas(): HTMLCanvasElement | null
    getVideoBlob(): Blob

    startRecording(): void
    stopRecording(): void
  }
}
