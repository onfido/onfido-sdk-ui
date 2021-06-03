import { h } from 'preact'
import { mount, ReactWrapper } from 'enzyme'

import MockedLocalised, { mockedTranslate } from '~jest/MockedLocalised'
import { DefaultContent, DocVideoContent } from '../Content'

mockedTranslate.mockImplementation((str) => {
  if (str === 'welcome.list_item_doc_video_timeout') {
    return '<hidden>Invisible</hidden>timeout: <timeout></timeout>'
  }

  return str
})

const assertDefaultContent = (wrapper: ReactWrapper) => {
  const items = wrapper.find('.customDescriptions > p')
  expect(items.at(0).text()).toEqual('welcome.description_p_1')
  expect(items.at(1).text()).toEqual('welcome.description_p_2')
}

const assertDocVideoContent = (wrapper: ReactWrapper) => {
  expect(wrapper.find('.caption').text()).toEqual(
    'welcome.list_header_doc_video'
  )
  const items = wrapper.find('.instructions > ol li')
  expect(items.at(0).text()).toEqual('welcome.list_item_doc')
  expect(items.at(1).text()).toEqual('welcome.list_item_selfie')
}

describe('Welcome', () => {
  describe('DefaultContent', () => {
    it('renders correct elements', () => {
      const wrapper = mount(
        <MockedLocalised>
          <DefaultContent />
        </MockedLocalised>
      )

      expect(wrapper.exists()).toBeTruthy()
      assertDefaultContent(wrapper)
    })

    it('renders correct elements with custom descriptions', () => {
      const wrapper = mount(
        <MockedLocalised>
          <DefaultContent
            descriptions={[
              'Fake description 1',
              'Fake description 2',
              'Fake description 3',
            ]}
          />
        </MockedLocalised>
      )

      expect(wrapper.exists()).toBeTruthy()

      const descriptions = wrapper.find('.content p')
      expect(descriptions.at(0).text()).toMatch('Fake description 1')
      expect(descriptions.at(1).text()).toMatch('Fake description 2')
      expect(descriptions.at(2).text()).toMatch('Fake description 3')
    })
  })

  describe('DocVideoContent', () => {
    it('renders correct elements', () => {
      const wrapper = mount(
        <MockedLocalised>
          <DocVideoContent />
        </MockedLocalised>
      )

      expect(wrapper.exists()).toBeTruthy()

      expect(wrapper.find('.subtitle').text()).toEqual(
        'welcome.doc_video_subtitle'
      )
      assertDocVideoContent(wrapper)
      expect(wrapper.find('.recordingLimit').text()).toEqual('timeout: 30')
    })
  })
})
