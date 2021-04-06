import { h } from 'preact'
import { mount, shallow } from 'enzyme'

import ReloadContent from '../ReloadContent'
import MockedLocalised from '~jest/MockedLocalised'

const defaultProps = {
  onPrimaryButtonClick: jest.fn(),
}

describe('ReloadContent', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(
      <MockedLocalised>
        <ReloadContent {...defaultProps} />
      </MockedLocalised>
    )
    expect(wrapper.exists()).toBeTruthy()
  })
})
