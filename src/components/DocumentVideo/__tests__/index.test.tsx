import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import DocumentVideo, { DocumentVideoProps } from '../index'

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

  it('renders the front document capture', () => {
    const wrapper = mount(
      <MockedReduxProvider>
        <MockedLocalised>
          <DocumentVideo {...defaultProps} />
        </MockedLocalised>
      </MockedReduxProvider>
    )

    const documentLiveCapture = wrapper.find('DocumentLiveCapture')
    expect(documentLiveCapture.exists()).toBeTruthy()
  })
})
