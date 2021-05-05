const enumerateDevices = jest.fn().mockResolvedValue([
  {
    deviceId: 'fake-videoinput-device-id',
    groupId: 'face-videoinput-group-id',
    kind: 'videoinput',
    label: 'fake-videoinput',
  },
])

export default enumerateDevices
