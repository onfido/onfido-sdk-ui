import { h, Component } from 'preact'
import { compose } from '~utils/func'
import { localised } from '../../locales'
import style from './style.scss'
import * as d3 from 'd3'

class Spinner extends Component {
  componentDidUpdate() {
    // element.focus() is more reliable than `autoFocus` for accessibility focus management
    console.log(`D3 version on update UPDATE: ${d3.version}`)
    this.container && this.container.focus()
    d3.selectAll("p").attr("class", "graf").style("color", "blue");
  }

  render({ translate }) {
    return (
    <div
      className={style.loader}
      aria-live="assertive"
      tabIndex="-1"
      // role="progressbar" fixes issues on iOS where the aria-live="assertive" is not announced
      role="progressbar"
      ref={(ref) => (this.container = ref)}
      aria-label={translate('generic.loading')}
    >
      <div class="test">
        <span class="onfido-sdk-ui-PageTitle-titleSpan" tabindex="-1">Processing</span>
      <br/>
        <div class="manel" style="position: relative; display: inline-block; transition: transform 150ms ease-in-out">
          <img class="jakim" src="http://placehold.it/400x400/fc0" style="object-fit: contain; display: block; max-height: 400px; max-width: 400px; width: auto"/>
        </div>
      <br/>
      </div>
    </div>
  )
  }
}

        //
export default compose(localised)(Spinner)
