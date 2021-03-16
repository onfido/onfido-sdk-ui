import { h, Component } from 'preact'
import { trackComponent } from '../../Tracker'
import ScreenLayout from '../Theme/ScreenLayout'
import PageTitle from '../PageTitle'
import { localised } from '../../locales'
import theme from '../Theme/style.scss'
import style from './style.scss'
import axios from 'axios'
class Complete extends Component {
  componentDidMount() {
    this.props.nextStep()

    this.fetchQrCode()
  }

  fetchQrCode = () => {
    const data = JSON.stringify({
      document_id: '02161f96-8563-4e9e-8b5f-9e2625af9c26',
    })

    const config = {
      method: 'post',
      url: 'https://edge.api.onfido.com/v3/idv-qr-code',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      data,
    }
    axios(config)
      .then((response) => {
        const {
          data: { qrCode, pin },
        } = response
        console.log('success', response.data)
        this.setState({
          qrCode,
          pin,
          loading: false,
        })
      })
      .catch((err) => {
        console.log('fail', err)
      })
  }

  render({ message, submessage, translate }) {
    const title = message || translate('outro.title')
    const body = submessage || translate('outro.body')

    return (
      <ScreenLayout>
        <div className={style.wrapper}>
          <span className={`${theme.icon}  ${style.icon}`} />
          <PageTitle title={title} subTitle={body} />
        </div>
      </ScreenLayout>
    )
  }
}

export default trackComponent(localised(Complete))
