import { h } from 'preact'
import { mount } from 'enzyme'
import ScreenLayout from '../ScreenLayout'

describe('ScreenLayout', () => {
  it('mounts correctly', () => {
    const screen = mount(<ScreenLayout>Content</ScreenLayout>)
    expect(screen.exists()).toBeTruthy()
  })

  it('mounts correctly with actions props', () => {
    const action = <button>click me</button>
    const screen = mount(<ScreenLayout actions={action}>Content</ScreenLayout>)
    expect(screen.exists()).toBeTruthy()
  })
})
