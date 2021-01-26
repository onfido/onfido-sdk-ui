import type { DeviceData } from 'enumerate-devices'

const enumerateDevices = (): Promise<Array<DeviceData>> =>
  new Promise((resolve) =>
    resolve([
      {
        deviceId: 'fake-videoinput-device-id',
        groupId: 'face-videoinput-group-id',
        kind: 'videoinput',
        label: 'fake-videoinput',
      },
    ])
  )

export default enumerateDevices
