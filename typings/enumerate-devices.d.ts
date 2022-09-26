declare module 'enumerate-devices' {
  type DeviceKinds = 'videoinput' | 'audioinput'

  export type DeviceData = {
    deviceId?: string
    facing?: VideoFacingModeEnum
    groupId?: string
    kind: DeviceKinds
    label?: string
  }

  type ResultCallback = (error: Error | null, devices: DeviceData[]) => void

  export default function enumerateDevices(
    callback?: ResultCallback
  ): Promise<DeviceData[]>
}
