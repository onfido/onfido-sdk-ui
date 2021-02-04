import { h } from 'preact'
import { mount } from 'enzyme'
import ScreenLayout from '../ScreenLayout'

describe('ScreenLayout', () => {
  it('mounts correctly', () => {
    const screen = mount(<ScreenLayout>Content</ScreenLayout>)
    expect(screen.exists()).toBeTruthy()
    expect(screen.text()).toEqual('Content')
  })

  it('mounts correctly with actions props', () => {
    const action = <button>Click me</button>
    const screen = mount(<ScreenLayout actions={action}>Content</ScreenLayout>)
    expect(screen.exists()).toBeTruthy()
    expect(screen.find('button').text()).toEqual('Click me')
  })
})
