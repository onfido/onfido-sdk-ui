import { h } from 'preact'
import { mount } from 'enzyme'

import MockedReduxProvider from '~jest/MockedReduxProvider'
import { LocaleProvider } from '~locales'
import ModalApp from '../ModalApp'

import type { SDKOptionsWithRenderData } from '~types/commons'

const defaultOptions: SDKOptionsWithRenderData = {
  steps: [
    { type: 'welcome' },
    { type: 'document' },
    { type: 'face' },
    { type: 'data' },
    { type: 'complete' },
    { type: 'retry' },
  ],
  containerId: 'onfido-mount',
  containerEl: document.createElement('div'),
}

describe('ModalApp', () => {
  it('renders without crashing', () => {
    const wrapper = mount(
      <MockedReduxProvider>
        <ModalApp options={defaultOptions} />
      </MockedReduxProvider>
    )

    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.find(LocaleProvider).exists()).toBeTruthy()
  })
})
