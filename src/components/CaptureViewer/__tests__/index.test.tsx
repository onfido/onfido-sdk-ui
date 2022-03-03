import { h } from 'preact'
import { mount } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import CaptureViewer from '../index'

import type { CapturePayload } from '~types/redux'

jest.mock('~utils/objectUrl')

const fakePdfCapture: CapturePayload = {
  blob: new Blob([], { type: 'application/pdf' }),
  sdkMetadata: {},
}

const fakeVideoCapture: CapturePayload = {
  blob: new Blob([]),
  sdkMetadata: {},
  variant: 'video',
}

const fakeImageCapture: CapturePayload = {
  blob: new Blob([]),
  sdkMetadata: {},
  variant: 'standard',
}

const defaultProps = {
  trackScreen: jest.fn(),
}

describe('CaptureViewer', () => {
  describe('with PDFs', () => {
    it('renders items correctly', () => {
      const wrapper = mount(
        <CaptureViewer
          {...defaultProps}
          capture={fakePdfCapture}
          method="document"
        />
      )
      expect(wrapper.exists()).toBeTruthy()
      expect(wrapper.find('PdfViewer').exists()).toBeTruthy()
      expect(wrapper.find('CaptureVideoViewer').exists()).toBeFalsy()
      expect(wrapper.find('CaptureImageViewer').exists()).toBeFalsy()
    })
  })

  describe('with videos', () => {
    describe('for faces', () => {
      it('renders items correctly', () => {
        const wrapper = mount(
          <CaptureViewer
            {...defaultProps}
            capture={fakeVideoCapture}
            method="face"
          />
        )
        expect(wrapper.exists()).toBeTruthy()
        expect(wrapper.find('PdfViewer').exists()).toBeFalsy()
        expect(wrapper.find('CaptureVideoViewer').exists()).toBeTruthy()
        expect(wrapper.find('CaptureImageViewer').exists()).toBeFalsy()
      })
    })
  })

  describe('with images', () => {
    describe('for faces', () => {
      it('renders items correctly', () => {
        const wrapper = mount(
          <CaptureViewer
            {...defaultProps}
            capture={fakeImageCapture}
            method="face"
          />
        )
        expect(wrapper.exists()).toBeTruthy()
        expect(wrapper.find('PdfViewer').exists()).toBeFalsy()
        expect(wrapper.find('CaptureVideoViewer').exists()).toBeFalsy()
        expect(wrapper.find('CaptureImageViewer').exists()).toBeTruthy()
        expect(
          wrapper.find('CaptureImageViewer EnlargedPreview').exists()
        ).toBeFalsy()
      })
    })

    describe('for documents', () => {
      it('renders items correctly', () => {
        const wrapper = mount(
          <MockedReduxProvider>
            <MockedLocalised>
              <CaptureViewer
                {...defaultProps}
                capture={fakeImageCapture}
                method="document"
              />
            </MockedLocalised>
          </MockedReduxProvider>
        )
        expect(wrapper.exists()).toBeTruthy()
        expect(wrapper.find('PdfViewer').exists()).toBeFalsy()
        expect(wrapper.find('CaptureVideoViewer').exists()).toBeFalsy()
        expect(wrapper.find('CaptureImageViewer').exists()).toBeTruthy()
        expect(
          wrapper.find('CaptureImageViewer EnlargedPreview').exists()
        ).toBeTruthy()
      })
    })
  })
})
