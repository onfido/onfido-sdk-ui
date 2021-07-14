export const mockGetUserMedia = (): void => {
  const originalWindow = { ...window }
  const windowSpy = jest.spyOn(global.window, 'navigator', 'get')

  windowSpy.mockImplementation(() => ({
    ...originalWindow.navigator,
    mediaDevices: {
      ...originalWindow.navigator.mediaDevices,
      getUserMedia: () =>
        new Promise((resolve) =>
          resolve({
            active: true,
            id: 'fake-media-id',
            addEventListener: jest.fn(),
            addTrack: jest.fn(),
            clone: jest.fn(),
            dispatchEvent: jest.fn(),
            getAudioTracks: jest.fn(),
            getTrackById: jest.fn(),
            getTracks: jest.fn(),
            getVideoTracks: jest.fn(),
            onaddtrack: jest.fn(),
            onremovetrack: jest.fn(),
            removeEventListener: jest.fn(),
            removeTrack: jest.fn(),
          })
        ),
    },
  }))
}
