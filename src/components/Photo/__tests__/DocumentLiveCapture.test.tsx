import '@testing-library/jest-dom'
import { render, waitFor } from '@testing-library/preact'
import { h } from 'preact'
import MockedContainerDimensions from '~jest/MockedContainerDimensions'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider, {
  mockedReduxProps,
} from '~jest/MockedReduxProvider'

import DocumentLiveCapture from '../DocumentLiveCapture'

describe('document live capture', () => {
  const trackScreen = jest.fn()

  beforeEach(() => {
    render(
      <MockedReduxProvider>
        <MockedLocalised>
          <MockedContainerDimensions>
            <DocumentLiveCapture
              {...mockedReduxProps}
              isUploadFallbackDisabled
              onCapture={() => {}}
              renderFallback={() => null}
              trackScreen={trackScreen}
            />
          </MockedContainerDimensions>
        </MockedLocalised>
      </MockedReduxProvider>
    )
  })

  it('should call trackScreen on mount.', async () => {
    await waitFor(() => expect(trackScreen).toHaveBeenCalledTimes(1))
  })
})
