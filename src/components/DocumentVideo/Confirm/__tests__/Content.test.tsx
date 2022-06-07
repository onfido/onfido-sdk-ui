import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import MockedReduxProvider from '~jest/MockedReduxProvider'
import MockedLocalised from '~jest/MockedLocalised'
import Content from '../Content'

import type { DocumentCapture } from '~types/redux'
import { SdkOptionsProvider } from '~contexts/useSdkOptions'

jest.mock('~utils/objectUrl')

const defaultProps = {
  trackScreen: jest.fn(),
}

const fakeCapture: DocumentCapture = {
  documentType: 'passport',
  id: 'fake-capture-id',
  blob: new Blob([]),
  sdkMetadata: {},
}

describe('DocumentVideo', () => {
  describe('Confirm', () => {
    describe('Content', () => {
      it('renders without crashing', () => {
        const wrapper = shallow(
          <SdkOptionsProvider options={{ steps: [] }}>
            <Content {...defaultProps} previewing />
          </SdkOptionsProvider>
        )
        expect(wrapper.exists()).toBeTruthy()
      })

      describe('when mounted', () => {
        it('renders nothing without capture', () => {
          const wrapper = mount(
            <SdkOptionsProvider options={{ steps: [] }}>
              <MockedLocalised>
                <Content {...defaultProps} previewing />
              </MockedLocalised>
            </SdkOptionsProvider>
          )
          expect(wrapper.find('Content').children().exists()).toBeFalsy()
        })

        it('render texts when not previewing', () => {
          const wrapper = mount(
            <SdkOptionsProvider options={{ steps: [] }}>
              <MockedLocalised>
                <Content
                  {...defaultProps}
                  capture={fakeCapture}
                  previewing={false}
                />
              </MockedLocalised>
            </SdkOptionsProvider>
          )

          expect(wrapper.find('.title').text()).toEqual('outro.body')
          expect(wrapper.find('.body').text()).toEqual(
            'video_confirmation.body'
          )
        })

        it('render CaptureViewer when previewing', () => {
          const wrapper = mount(
            <SdkOptionsProvider options={{ steps: [] }}>
              <MockedReduxProvider>
                <MockedLocalised>
                  <Content {...defaultProps} capture={fakeCapture} previewing />
                </MockedLocalised>
              </MockedReduxProvider>
            </SdkOptionsProvider>
          )

          expect(wrapper.find('.title').text()).toEqual(
            'doc_video_confirmation.title'
          )
          expect(wrapper.find('.body').exists()).toBeFalsy()

          const captureViewer = wrapper.find('CaptureViewer')
          expect(captureViewer.exists()).toBeTruthy()
          expect(captureViewer.hasClass('videoWrapper')).toBeTruthy()
          expect(captureViewer.prop('capture')).toEqual(fakeCapture)
          expect(captureViewer.prop('method')).toEqual('document')
        })
      })
    })
  })
})
