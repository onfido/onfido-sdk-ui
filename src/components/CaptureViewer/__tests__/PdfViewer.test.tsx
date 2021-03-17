import { h } from 'preact'
import { mount, shallow, ReactWrapper } from 'enzyme'
import PdfObject from 'pdfobject'

import PdfViewer from '../PdfViewer'

jest.mock('~utils/objectUrl')

const defaultProps = {
  blob: new Blob([]),
}

const mockedPdfEmbed = PdfObject.embed as jest.MockedFunction<
  typeof PdfObject.embed
>

describe('CaptureViewer', () => {
  describe('PdfViewer', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('renders without crashing', () => {
      const wrapper = shallow(<PdfViewer {...defaultProps} />)
      expect(wrapper.exists()).toBeTruthy()
    })

    describe('when mounted', () => {
      let wrapper: ReactWrapper
      const containerId = 'pdfContainer-0'

      it('renders items correctly', () => {
        wrapper = mount(<PdfViewer {...defaultProps} />)
        expect(wrapper.exists()).toBeTruthy()

        const previewer = wrapper.find('BlobPreviewUrlComponent PdfPreview')
        expect(previewer.exists()).toBeTruthy()

        expect(previewer.find('div').prop('id')).toEqual(containerId)

        expect(mockedPdfEmbed).toHaveBeenCalled()
        const [previewUrl, id] = mockedPdfEmbed.mock.calls[0]
        expect(previewUrl).toEqual('fake-object-url')
        expect(id).toEqual(`#${containerId}`)
      })
    })

    describe('when multiple instances mounted', () => {
      it('renders items correctly', () => {
        const wrapper = mount(
          <div>
            <PdfViewer {...defaultProps} />
            <PdfViewer {...defaultProps} />
            <PdfViewer {...defaultProps} />
          </div>
        )

        const previewerDivs = wrapper.find('PdfPreview > div')

        // pdfContainer-0 was created in the above test
        expect(previewerDivs.map((div) => div.prop('id'))).toMatchObject([
          'pdfContainer-1',
          'pdfContainer-2',
          'pdfContainer-3',
        ])
      })
    })

    describe('with IE', () => {
      beforeEach(() => {
        window.navigator.msSaveOrOpenBlob = jest.fn()
      })

      it('renders items correctly', () => {
        const wrapper = mount(<PdfViewer {...defaultProps} />)
        expect(wrapper.exists()).toBeTruthy()

        expect(
          wrapper.find('BlobPreviewUrlComponent PdfPreview').exists()
        ).toBeFalsy()

        const blobLink = wrapper.find('IEPdfBlobLink')
        expect(blobLink.exists()).toBeTruthy()

        blobLink.find('a').simulate('click')
        expect(window.navigator.msSaveOrOpenBlob).toHaveBeenCalledWith(
          defaultProps.blob,
          'document.pdf'
        )
      })
    })
  })
})
