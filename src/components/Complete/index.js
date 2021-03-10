import { h, Component } from 'preact'
import { trackComponent } from '../../Tracker'
import PageTitle from '../PageTitle'
import { localised } from '../../locales'
import theme from '../Theme/style.scss'
import style from './style.scss'
import axios from 'axios'

class Complete extends Component {
  constructor(props) {
    super(props)
    this.state = {
      qrCode: this.fetchQrCode(),
      pin: '',
    }
  }

  componentDidMount() {
    this.props.nextStep()
  }

  fetchQrCode = () => {
    axios
      .get('http://127.0.0.1:3000/idv-qr-code')
      .then((response) => {
        const {
          data: { qrCode, pin },
        } = response
        console.log('success', response.data)
        this.setState({
          qrCode,
          pin,
        })
      })
      .catch((err) => {
        console.log('fail', err)
      })
  }

  render({ message, submessage, translate }) {
    const {
      state: { qrCode, pin },
    } = this
    const title = message || translate('outro.title')
    const body = submessage || translate('outro.body')
    return (
      <div className={style.wrapper}>
        <span className={`${theme.icon}  ${style.icon}`} />
        <PageTitle title={title} subTitle={body} />
        <p className={style.pin}>{pin}</p>
        {qrCode !== null && <img className={style.msQrCode} src={qrCode} />}
      </div>
    )
  }
}

export default trackComponent(localised(Complete))
