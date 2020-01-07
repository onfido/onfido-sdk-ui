import * as React from 'react'
import { shallow } from 'enzyme'
import { SelfieConfirm } from './'
import { expect } from 'chai'
import jsdom from "jsdom"
const { JSDOM } = jsdom;

beforeEach(() => { new JSDOM(``);
});

describe("SelfieConfirm component", () => {
  it('should send requests', () => {
    const wrapper = shallow(<SelfieConfirm {...props} />);
    expect(wrapper.instance().sendMultiframeSelfie()).equals(true);
  });
})