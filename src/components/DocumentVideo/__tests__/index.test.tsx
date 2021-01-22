import { h } from 'preact'
import { shallow } from 'enzyme'

import DocumentVideo, { DocumentVideoProps } from '../index'

describe('DocumentVideo', () => {
  const defaultProps: DocumentVideoProps = {
    documentType: 'driving_licence',
  }

  it('renders without crashing', () => {
    const wrapper = shallow(<DocumentVideo {...defaultProps} />)
    expect(wrapper.exists()).toBeTruthy()
  })
})
