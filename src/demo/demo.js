console.log("demo.js")
import { h, render, Component } from 'preact'

if (process.env.NODE_ENV === 'development') {
  require('preact/devtools');
}

/*
Importing index.js would work, but it would mean we would be bundling all that code into this demo bundle. Therefore we wouldn't be testing as
close to production as with this approach. This approach will actually
use the onfido bundle, the one that clients will use as well.
 */
const Onfido = window.Onfido

const queryStrings = window.location
                      .search.slice(1)
                      .split('&')
                      .reduce((/*Object*/ a, /*String*/ b) => {
                        b = b.split('=');
                        a[b[0]] = decodeURIComponent(b[1]);
                        return a;
                      }, {});
const useModal = queryStrings.useModal === "true"

const steps = [
  'welcome',
  queryStrings.poa === "true" ?
    {type:'poa'} : undefined,
  {
    type:'document',
    options: {
      useWebcam: queryStrings.useWebcam === "true",
      documentTypes: {}
    }
  },
  {
    type: 'face',
    options:{
      requestedVariant: queryStrings.liveness === "true" ? 'video' : 'standard',
      useWebcam: queryStrings.useWebcam !== "false",
      uploadFallback: queryStrings.uploadFallback !== "false"
    }
  },
  'complete'
].filter(a=>a)

const language = queryStrings.language === "customTranslations" ? {
  locale: 'fr',
  phrases: {'welcome.title': 'Ouvrez votre nouveau compte bancaire'}
} : queryStrings.language

const smsNumberCountryCode = queryStrings.countryCode ? { smsNumberCountryCode: queryStrings.countryCode } : {}

const getToken = function(onSuccess) {
  const url = process.env.JWT_FACTORY
  const request = new XMLHttpRequest()
  request.open('GET', url, true)
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      const data = JSON.parse(request.responseText)
      // Only log the applicant ID in development - it is sensitive data
      console.log("Applicant ID: " + data.applicant_id)
      onSuccess(data.message)
    }
  }
  request.send()
}


class SDK extends Component{
  componentDidMount () {
    this.initSDK(this.props.options)
  }

  componentWillReceiveProps({options}){
    if (this.state.onfidoSdk){
      this.state.onfidoSdk.setOptions(options)
      if (options.tearDown) {
        this.state.onfidoSdk.tearDown()
      }
    }
  }

  componentWillUnmount () {
    if (this.state.onfidoSdk) this.state.onfidoSdk.tearDown()
  }

  initSDK = (options)=> {
    const onfidoSdk = Onfido.init(options)
    this.setState({onfidoSdk})
  }

  shouldComponentUpdate () {
    return false
  }

  render = () => <div id="onfido-mount"></div>
}

class Demo extends Component{
  constructor (props) {
    super(props)
    getToken((token)=> {
      this.setState({token})
    })
  }

  state = {
    token: null,
    isModalOpen: false
  }

  sdkOptions = (clientSdkOptions={})=> ({
    ...(queryStrings.link_id ?
      {mobileFlow: true}:
      {
        token: this.state.token,
        useModal,
        onComplete: (data) => {
          /*callback for when */ console.log("everything is complete", data)
        },
        isModalOpen: this.state.isModalOpen,
        language,
        steps,
        mobileFlow: !!queryStrings.link_id,
        onModalRequestClose: () => {
          this.setState({isModalOpen: false})
        },
        ...smsNumberCountryCode,
        ...clientSdkOptions,
      }
    )
  })

  render () {
    return <div class="container">
      { useModal &&
        <button
          id="button"
          onClick={ () => this.setState({isModalOpen: true})}>
            Verify identity
        </button>
      }
      {queryStrings.async === "false" && this.state.token === null ?
        null : <SDK options={this.sdkOptions(this.props.options)}></SDK>
      }
    </div>
  }
}


const container = render(<Demo/>, document.getElementById("demo-app") )

window.updateOptions = (newOptions)=>{
  render(<Demo options={newOptions}/>, document.getElementById("demo-app"), container )
}
