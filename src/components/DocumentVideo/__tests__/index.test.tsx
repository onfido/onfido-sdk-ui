import { h } from 'preact'
import { mount, shallow, ReactWrapper } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import DocumentLiveCapture, {
  Props as DocumentLiveCaptureProps,
} from '../../Photo/DocumentLiveCapture'
import DocumentVideo, { DocumentVideoProps } from '../index'

import type { CapturePayload } from '~types/redux'

const fakePayload: CapturePayload = {
  blob: new Blob(),
  sdkMetadata: {},
}

describe('DocumentVideo', () => {
  const defaultProps: DocumentVideoProps = {
    documentType: 'driving_licence',
    renderFallback: jest.fn(),
    trackScreen: jest.fn(),
  }

  it('renders without crashing', () => {
    const wrapper = shallow(
      <MockedReduxProvider>
        <MockedLocalised>
          <DocumentVideo {...defaultProps} />
        </MockedLocalised>
      </MockedReduxProvider>
    )
    expect(wrapper.exists()).toBeTruthy()
  })

  describe('when mounted', () => {
    let wrapper: ReactWrapper

    beforeEach(() => {
      wrapper = mount(
        <MockedReduxProvider>
          <MockedLocalised>
            <DocumentVideo {...defaultProps} />
          </MockedLocalised>
        </MockedReduxProvider>
      )
    })

    it('renders the front document capture by default', () => {
      const documentLiveCapture = wrapper.find('DocumentLiveCapture')
      expect(documentLiveCapture.exists()).toBeTruthy()
    })

    it('switches to video step after front side image captured', () => {
      const documentLiveCapture = wrapper.find<DocumentLiveCaptureProps>(
        DocumentLiveCapture
      )
      expect(documentLiveCapture.exists()).toBeTruthy()
      documentLiveCapture.props().onCapture(fakePayload)
      wrapper.update()
      expect(wrapper.find('VideoCapture').exists()).toBeTruthy()
    })
  })
})
