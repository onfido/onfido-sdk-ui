import { h } from 'preact';
import { shallow } from 'enzyme'
import { expect } from 'chai'
import  Confirm  from './Confirm'
// import { trackException, sendEvent } from '../../Tracker'

import * as jest from 'jest'
// jest.mock('../../Tracker', () => ({ trackException: jest.fn(), sendEvent: jest.fn() }))
// jest.mock('./CaptureViewer', () => 'captureViewer')
jest.mock('./Previews', () => 'Previews')
jest.mock('../Spinner', () => 'spinner')

let props;
beforeEach(() =>
    props = {
      // capture: {},
      // previousStep: () => {},
      // method: '',
      // documentType: '',
      // isFullScreen: true,
      language: 'en'
});

const snapshot = {blob: {}}
const selfie = {blob: {}}


describe("SelfieConfirm component", () => {

  it('should send requests', () => {
    // trackException.mockImplementation()
    // sendEvent.mockImplementation()
    const wrapper = shallow(<Confirm {...props} />);
    expect(wrapper.instance().sendMultiframeSelfie(snapshot, selfie, 'token', 'url',() => console.log('success'), () => console.log('error'))).equals(true);
  });
})