import { h, Component } from 'preact'
import * as OT from '@opentok/client'

//replace this URL with the server URL

const opentTokUrl = 'https://6411a9576067.ngrok.io'

class StreamAndStoreVideo extends Component {
  // This component is used when MediaRecorder API is not supported by the browser
  constructor(props) {
    super(props)
    this.state = {
      apiKey: '46976504',
      sessionId: null,
      openTokToken: null,
      archiveId: null,
      publisher: null,
    }
  }

  componentDidMount() {
    console.log('in componentDIdMount')
    fetch(`${opentTokUrl}/room/session`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const sessionId = data.sessionId
        const openTokToken = data.token
        const session = OT.initSession(this.state.apiKey, sessionId)
        const publisher = OT.initPublisher(this.container, {
          height: '100%',
          width: '100%',
          showControls: false,
          facingMode: this.props.facingMode,
        })
        this.setState({ sessionId, openTokToken, session, publisher })

        session.connect(openTokToken, () => {
          session.publish(publisher)
          this.props.onUserMedia()
        })

        session.on('streamCreated', (event) => {
          session.subscribe(event.stream)
        })
      })
  }

  startRecording = async () => {
    console.log('calling start')
    await fetch(`${opentTokUrl}/archive/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId: this.state.sessionId }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ archiveId: data.id })
      })
  }

  stopRecording = async () => {
    console.log('calling stop')
    await fetch(`${opentTokUrl}/archive/${this.state.archiveId}/stop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId: this.state.sessionId }),
    }).then(this.getVideoUrl)
  }

  getVideoUrl = async () => {
    return await fetch(`${opentTokUrl}/archive/${this.state.archiveId}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (!data.url) {
          await this.getVideoUrl()
        } else {
          this.props.onVideoUrl(data.url)
        }
      })
  }

  render = () => <div ref={(container) => (this.container = container)} />
}

export default StreamAndStoreVideo
