import { ComponentChildren, h } from 'preact'
import { mount } from 'enzyme'

import MockedReduxProvider from '~jest/MockedReduxProvider'
import { LocaleProvider } from '~locales'
import ModalApp from '../ModalApp'

import type { UpdatedSDKOptions } from '~types/commons'

jest.mock('Tracker/safeWoopra')
jest.mock(
  '~contexts/useSdkConfigurationService',
  () => (children: ComponentChildren) => children
)

const defaultOptions: UpdatedSDKOptions = {
  steps: [
    { type: 'welcome' },
    { type: 'document' },
    { type: 'face' },
    { type: 'complete' },
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
