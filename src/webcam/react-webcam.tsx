import { h, Component } from 'preact'
import {
  createMediaRecorder,
  debugConsole,
  startRecording,
  logError,
} from './video'
import { backCameraKeywords } from './utils'
import enumerateDevices, { DeviceData } from 'enumerate-devices'

type GetUserMediaType = (
  constraints?: MediaStreamConstraints
) => Promise<MediaStream>

/*
Deliberately ignoring the old api, due to very inconsistent behaviour
*/
const mediaDevices = navigator.mediaDevices
const getUserMedia: GetUserMediaType | null =
  mediaDevices && mediaDevices.getUserMedia
    ? mediaDevices.getUserMedia.bind(mediaDevices)
    : null
const hasGetUserMedia = !!getUserMedia

const handleFacingModeConstraints = (
  constraints: MediaStreamConstraints
): Promise<MediaStreamConstraints> | undefined => {
  if (constraints && typeof constraints.video === 'object') {
    const { facingMode } = constraints.video
    // To detect an environment or rear facing camera, the constraint can be passed in as {facingMode: "environment"} or {facingMode: {exact: "environment"}};
    // this will account for either situation. "facingMode && facingMode.exact &&" is necessary before checking facingMode.exact to avoid an error if facingMode is undefined or doesn't contain the exact key
    const shouldUseBackCam =
      facingMode === 'environment' ||
      (typeof facingMode === 'object' &&
        // @ts-ignore
        facingMode.exact &&
        // @ts-ignore
        facingMode.exact === 'environment')
    if (!shouldUseBackCam) return Promise.resolve(constraints)
    return enumerateDevices().then((devices: DeviceData[]) => {
      const cameras = extractCamerasFromDevices(devices)

      const mainBackCam = mainBackCamera(cameras)
      if (mainBackCam && mainBackCam.deviceId === '') {
        if (!constraints.video) {
          constraints.video = {}
        }
        // @ts-ignore
        constraints.video.facingMode = { ideal: 'environment' }
      } else {
        const deviceId =
          mainBackCam && mainBackCam.deviceId
            ? mainBackCam.deviceId
            : cameras[0].deviceId
        // @ts-ignore
        constraints.video.deviceId = { exact: deviceId }
      }
      return constraints
    })
  }
}

const isBackCameraLabel = (label: string): boolean => {
  const lowercaseLabel = label.toLowerCase()

  return backCameraKeywords.some((keyword) => {
    return lowercaseLabel.includes(keyword)
  })
}

const cameraObjects = new Map()

type CameraType = {
  deviceId?: string
  label: string
  cameraType: 'front' | 'back'
}

const extractCamerasFromDevices = (devices: DeviceData[]): CameraType[] => {
  const cameras: Array<CameraType> = devices
    .filter((device: DeviceData) => {
      return device.kind === 'videoinput'
    })
    .map((videoDevice: DeviceData) => {
      if (cameraObjects.has(videoDevice.deviceId)) {
        return cameraObjects.get(videoDevice.deviceId)
      }

      const label = videoDevice.label || ''
      const camera = {
        deviceId: videoDevice.deviceId,
        label,
        cameraType: isBackCameraLabel(label) ? 'back' : 'front',
      }

      if (label !== '') {
        cameraObjects.set(videoDevice.deviceId, camera)
      }

      return camera
    })
  if (
    cameras.length > 1 &&
    !cameras.some((camera) => {
      return camera.cameraType === 'back'
    })
  ) {
    // Check if cameras are labeled with resolution information, take the higher-resolution one in that case
    // Otherwise pick the last camera
    let backCameraIndex = cameras.length - 1

    const cameraResolutions = cameras.map((camera) => {
      const match = camera.label.match(/\b([0-9]+)MP?\b/i)
      if (match) {
        return parseInt(match[1], 10)
      }

      return NaN
    })
    if (
      !cameraResolutions.some((cameraResolution) => {
        return isNaN(cameraResolution)
      })
    ) {
      backCameraIndex = cameraResolutions.lastIndexOf(
        Math.max(...cameraResolutions)
      )
    }
    cameras[backCameraIndex].cameraType = 'back'
  }

  return cameras
}

const mainBackCamera = (cameras: Array<CameraType>) =>
  cameras
    .filter((camera) => camera.cameraType === 'back')
    .sort((camera1, camera2) => camera1.label.localeCompare(camera2.label))[0]

type FacingModeType =
  | VideoFacingModeEnum
  | { exact: VideoFacingModeEnum }
  | { ideal: VideoFacingModeEnum }

export type WebcamProps = {
  audio?: boolean
  className?: string
  constraints?: MediaStreamConstraints // Allow passing a MediaStreamConstraints directly
  fallbackConstraints?: MediaStreamConstraints
  facingMode?: FacingModeType
  fallbackHeight?: ConstrainULong
  fallbackWidth?: ConstrainULong
  height?: ConstrainULong
  onFailure?: (error?: Error) => void
  onUserMedia?: () => void
  screenshotFormat?: 'image/webp' | 'image/png' | 'image/jpeg'
  width?: ConstrainULong
}

type State = {
  hasUserMedia: boolean
  mirrored: boolean
}

const permissionErrors = [
  'PermissionDeniedError',
  'NotAllowedError',
  'NotFoundError',
]

const stopStreamTracks = (stream: MediaStream | undefined) => {
  if (stream && stream.getVideoTracks) {
    // check for stream first AND stream.getVideoTracks
    for (const track of stream.getVideoTracks()) {
      track.stop()
    }
  }
  if (stream && stream.getAudioTracks) {
    // check for stream first AND stream.getAudioTracks
    for (const track of stream.getAudioTracks()) {
      track.stop()
    }
  }
}

export default class Webcam extends Component<WebcamProps, State> {
  static defaultProps = {
    audio: false,
    screenshotFormat: 'image/webp',
    onUserMedia: () => {},
    onFailure: () => {},
  }

  static mountedInstances: Array<Webcam> = []

  static userMediaRequested = false

  state = {
    hasUserMedia: false,
    mirrored: false,
  }

  stream?: MediaStream
  canvas?: HTMLCanvasElement
  ctx?: CanvasRenderingContext2D | null
  video?: HTMLVideoElement | null
  recordedBlobs?: Array<Blob>
  mediaRecorder?: MediaRecorder

  constructor(props: WebcamProps) {
    super(props)

    if (!hasGetUserMedia) {
      const error = new Error('getUserMedia is not supported by this browser')
      this.props.onFailure && this.props.onFailure(error)
    }
  }

  async componentDidMount() {
    Webcam.mountedInstances.push(this)
    await this.requestUserMedia()
    this.updateVideoElement()
  }

  componentDidUpdate() {
    this.updateVideoElement()
  }

  updateVideoElement = () => {
    const video = this.video
    if (video) {
      // The muted attributed is not currently being set due to a bug in react
      // see: https://github.com/facebook/react/issues/10389
      video.setAttribute('muted', 'true')
    }
  }

  getConstraints(
    width?: ConstrainULong,
    height?: ConstrainULong,
    facingMode?: FacingModeType,
    audio?: boolean
  ): MediaStreamConstraints {
    /*
    Safari 11 has a bug where if you specify both the height and width
    constraints you must chose a resolution supported by the web cam. If an
    unsupported resolution is used getUserMedia(constraints) will hit a
    OverconstrainedError complaining that width is an invalid constraint.
    This bug exists for ideal constraints as well as min and max.
    However if only a height is specified safari will correctly chose the
    nearest resolution supported by the web cam.
    Reference: https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API/Constraints
    */

    // if `{facingMode: 'user'}` Firefox will still allow the user to choose which camera to use (Front camera will be the first option)
    // if `{facingMode: {exact: 'user'}}` Firefox won't give the user a choice and will show the front camera
    const constraints: MediaStreamConstraints = {
      video: { facingMode },
      audio,
    }

    if (width) {
      // @ts-ignore
      constraints.video.width = parseInt(width, 10) || width // some devices need a Number type
    }

    if (height) {
      // @ts-ignore
      constraints.video.height = parseInt(height, 10) || height
    }

    return constraints
  }

  async requestUserMedia() {
    if (!getUserMedia || !mediaDevices || Webcam.userMediaRequested) return
    const {
      width,
      height,
      facingMode,
      audio,
      fallbackWidth,
      fallbackHeight,
      constraints,
      fallbackConstraints,
    } = this.props

    const usedConstraints =
      constraints ?? this.getConstraints(width, height, facingMode, audio)
    const usedFallbackConstraints =
      fallbackConstraints ??
      this.getConstraints(fallbackWidth, fallbackHeight, facingMode, audio)

    const onSuccess = (stream: MediaStream) => {
      Webcam.userMediaRequested = false
      Webcam.mountedInstances.forEach((instance) =>
        instance.handleUserMedia(stream)
      )
    }

    let hasTriedFallbackConstraints = false
    const onError = (e: any) => {
      Webcam.userMediaRequested = false
      logError(e)
      const isPermissionError = permissionErrors.includes(e.name)
      if (isPermissionError || hasTriedFallbackConstraints) {
        Webcam.mountedInstances.forEach((instance) => instance.handleError(e))
      } else {
        hasTriedFallbackConstraints = true
        getUserMedia(usedFallbackConstraints).then(onSuccess).catch(onError)
      }
    }
    Webcam.userMediaRequested = true
    try {
      // Call enumerateDevices to check if permission is already granted.
      const devices = await enumerateDevices()

      const hasDevicePermission = devices
        .filter(({ kind }) => kind === 'videoinput')
        .every(({ label }) => !!label)

      // If some 'videoinput' devices do no contains label, permission is not granted yet.
      if (!hasDevicePermission) {
        // Call getUserMedia just to trigger the permission popup
        const mediaStream = await getUserMedia({ video: true, audio })
        mediaStream.getVideoTracks().forEach((stream) => stream.stop())
      }

      // Permission should be granted here, we can use enumerateDevices
      this.stream = await getUserMedia(
        await handleFacingModeConstraints(usedConstraints)
      )
      if (this.stream) {
        onSuccess(this.stream)
      }
    } catch (e) {
      onError(e)
    }
  }

  handleError(error: any) {
    this.setState({
      hasUserMedia: false,
    })
    this.props.onFailure && this.props.onFailure(error)
  }

  handleUserMedia(stream: MediaStream) {
    const videoSettings = stream ? stream.getVideoTracks()[0].getSettings() : {} // check for stream, assign empty object if none
    this.stream = stream
    debugConsole('video track settings', videoSettings)
    const facingMode = this.props.facingMode
    /* If the facingMode for the webcam was passed in as "environment" or {exact: "environment"} we don't want to mirror the video stream,
    since we will be seeing  the stream of the rear camera*/
    const isVideoStreamForRearCamera =
      facingMode === 'environment' ||
      // @ts-ignore
      (facingMode && facingMode.exact && facingMode.exact === 'environment')

    this.setState({
      hasUserMedia: true,
      mirrored:
        !isVideoStreamForRearCamera &&
        (videoSettings.facingMode === 'user' ||
          /* #HACK desktop cameras seem to have `facingMode` undefined,
                therefore we are assuming all desktop cameras are user facing*/
          !videoSettings.facingMode),
    })

    this.props.onUserMedia && this.props.onUserMedia()
  }

  componentWillUnmount() {
    const index = Webcam.mountedInstances.indexOf(this)
    Webcam.mountedInstances.splice(index, 1)

    /*
    We need to call `stopStreamTracks` since otherwise devices will continue
    holding onto the stream (e.g. recording through the webcam, even though we
    no longer need the stream)
    However - some devices (namely iOS Safari) have issues with calling
    `getUserMedia` multiple times from cold (i.e. without any existing streams
    already running in the background), so we don't stop the stream for
    `stopDelay` milliseconds, in an attempt to re-use the same stream, if a new
    component is mounted soon after.
    This issue of iOS Safari was pinpointed by unmounting and remounting the
    webcam component multiple times, and confirming that the error occurred in
    the `getUserMedia` request - and then testing that the error did _not_ occur
    if we never called `.stop()` on the tracks (however we do need to relinquish
    the stream eventually)
    The precise value for `stopDelay` is a finger-in-the-air value, that is
    a nice balance between the stream being relinquished (so the webcam light
    turns off etc.), and the crash not occuring (because of the wait)
    */
    const stopDelay = 1000
    setTimeout(() => stopStreamTracks(this.stream), stopDelay)
  }

  getScreenshot() {
    const canvas = this.getCanvas()
    if (!canvas) return null
    return canvas.toDataURL(this.props.screenshotFormat)
  }

  getCanvas(): HTMLCanvasElement | null {
    if (!this.state.hasUserMedia || !this.video) return null

    const video = this.video

    if (!this.canvas) this.canvas = document.createElement('canvas')
    const { canvas } = this

    if (!this.ctx) this.ctx = canvas.getContext('2d')
    if (!this.ctx) return null
    const { ctx } = this

    // This is set every time incase the video element has resized
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    debugConsole(`drawn image to canvas: ${canvas.width}x${canvas.height}`)
    return canvas
  }

  startRecording() {
    this.mediaRecorder = createMediaRecorder(this.stream)
    if (this.mediaRecorder) {
      this.recordedBlobs = startRecording(this.mediaRecorder)
    }
  }

  stopRecording() {
    this.mediaRecorder && this.mediaRecorder.stop()
  }

  getVideoBlob(): Blob | undefined {
    if (!this.mediaRecorder) return
    const mimeType = this.mediaRecorder.mimeType
    const type = mimeType.split(';')[0] // mimeType (excluding the codec)
    return new Blob(this.recordedBlobs, { type })
  }

  render() {
    // React will try and optimise this on re-mounts, so make sure to explicitly
    // not render with a stream that no longer exists
    // This is likely related to https://github.com/onfido/onfido-sdk-ui/blob/249f54264f3a1674a2702b95967bb91ec6e3b90d/src/components/Confirm/index.js#L37
    // as the `video` element should not _should_ not show anything if the stream
    // is `null` anyway
    if (!this.stream) return null

    return (
      <video
        style={{
          // not necessary to add prefixes, since all browsers that support camera
          // support transform
          transform: this.state.mirrored ? 'scaleX(-1)' : '',
        }}
        ref={(el) => (this.video = el)}
        // the `muted` attribute must be true for recording videos
        // Due to a bug in React, setting this attribute inside the video element does not currently work
        // so we update it in the  `updateVideoElement()` function
        // the muted attribute must be true and should be used in conjuction with `playsinline="true"` and `autoPlay="true"`, in order to prevent the "Live Broadcast" screen in iOS Safari
        muted
        autoPlay
        // @ts-ignore
        playsinline // necessary for iOS, see https://github.com/webrtc/samples/issues/929
        srcObject={this.stream}
        className={this.props.className}
      />
    )
  }
}
