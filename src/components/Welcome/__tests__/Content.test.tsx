import { h } from 'preact'
import { mount, ReactWrapper } from 'enzyme'

import MockedLocalised, { mockedTranslate } from '~jest/MockedLocalised'
import Content from '../Content'

mockedTranslate.mockImplementation((str) => {
  if (str === 'welcome.list_item_doc_video_timeout') {
    return '<hidden>Invisible</hidden>timeout: <timeout></timeout>'
  }

  return str
})

const assertDefaultDescriptions = (wrapper: ReactWrapper) => {
  expect(wrapper.find('.subtitle').text()).toEqual('welcome.subtitle')

  const items = wrapper.find('.descriptions > p')
  expect(items.at(0).text()).toEqual('welcome.description_p_1')
  expect(items.at(1).text()).toEqual('welcome.description_p_2')
  expect(items.at(2).text()).toEqual('welcome.description_p_3')
}

describe('Welcome', () => {
  describe('DefaultContent', () => {
    it('renders correct elements', () => {
      const wrapper = mount(
        <MockedLocalised>
          <Content />
        </MockedLocalised>
      )

      expect(wrapper.exists()).toBeTruthy()
      assertDefaultDescriptions(wrapper)
    })

    it('renders correct elements with custom descriptions', () => {
      const wrapper = mount(
        <MockedLocalised>
          <Content
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

    it('renders correct elements for docVideo feature', () => {
      const wrapper = mount(
        <MockedLocalised>
          <Content withTimeout />
        </MockedLocalised>
      )

      assertDefaultDescriptions(wrapper)
      expect(wrapper.find('.recordingLimit').text()).toEqual('timeout: 30')
    })
  })
})
