import { h, render, rerender } from 'preact';
import Router from 'components/Router';

/*global sinon,expect*/

describe('Router', () => {
  let scratch;

  before( () => {
    scratch = document.createElement('div');
    (document.body || document.documentElement).appendChild(scratch);
  });

  beforeEach( () => {
    scratch.innerHTML = '';
  });

  after( () => {
    scratch.parentNode.removeChild(scratch);
    scratch = null;
  });


  describe('routing', () => {
    it('should render the homepage', () => {
      //render(<App />, scratch);
      //expect(scratch.innerHTML).to.contain('Home');
    });
  });
});
