import { h, render, rerender } from 'preact';
import App from 'components/app';

/*global sinon,expect*/

describe('App', () => {
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
      render(<App />, scratch);

      expect(scratch.innerHTML).to.contain('Home');
    });

    it('should render /profile', () => {
      render(<App />, scratch);

      rerender();

      expect(scratch.innerHTML).to.contain('Profile: me');
    });

    it('should render /profile/:user', () => {
      render(<App />, scratch);

      rerender();

      expect(scratch.innerHTML).to.contain('Profile: john');
    });
  });
});
