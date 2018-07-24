console.log("demo.js")
import { h, render, Component } from 'preact'
/*
Importing index.js would work, but it would mean we would be bundling all that code into this demo bundle. Therefore we wouldn't be testing as
close to production as with this approach. This approach will actually
use the onfido bundle, the one that clients will use as well.
 */
const Onfido = window.Onfido

const options = window.location
                      .search.slice(1)
                      .split('&')
                      .reduce((/*Object*/ a, /*String*/ b) => {
                        b = b.split('=');
                        a[b[0]] = decodeURIComponent(b[1]);
                        return a;
                      }, {});


window.onload = function() {
  if (options.async === "false") {
    //getToken(createSDK)
  }
  else if (options.link_id)
  window.onfidoOut = Onfido.init({mobileFlow: true})
  else {
    //createSDK(null)
    //getToken(injectToken)
  }
}

const steps = [
  'welcome',
  {
    type:'document',
    options: {
      useWebcam: options.useWebcam === "true",
      documentTypes: {}
    }
  },
  {
    type: 'face',
    options:{
      liveness: options.liveness === "true",
      useWebcam: options.useWebcam !== "false",
    }
  },
  'complete'
]

const language = options.language === "customTranslations" ? {
  locale: 'fr',
  phrases: {'welcome.title': 'Ouvrez votre nouveau compte bancaire'}
} : options.language

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

  constructor (props) {
    super(props)
    getToken((token)=> {
      this.setState(token)
    })
  }

  sdkOptions = ()=> ({
    token: this.state.token,
    //useModal,
    onComplete: () => {
      /*callback for when */ console.log("everything is complete")
    },
    language,
    steps,
    onModalRequestClose: () => {
      console.log("onModalRequestClose")
      //setModalIsOpen(false)
    }
  })

  componentDidMount () {
    this.initSDK()
  }

  initSDK = ()=> {
    const onfidoSdk = Onfido.init(this.sdkOptions())
    this.setState(onfidoSdk)
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    return <div id="onfido-mount"></div>
  }
}

render(<SDK/>, document.getElementById("demo-app") )
