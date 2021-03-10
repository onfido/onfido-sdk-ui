import { h, Component } from 'preact'
import { Fragment } from 'react'
import { trackComponent } from '../../Tracker'
import PageTitle from '../PageTitle'
import { localised } from '../../locales'
import theme from '../Theme/style.scss'
import style from './style.scss'
import Spinner from '../Spinner'
import axios from 'axios'

class Complete extends Component {
  constructor(props) {
    super(props)
    this.state = {
      qrCode: this.fetchQrCode(),
      pin: '',
      loading: true,
    }
  }

  componentDidMount() {
    this.props.nextStep()
  }

  fetchQrCode = () => {
    axios
      .post('http://127.0.0.1:3000/idv-qr-code')
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
    const {
      state: { qrCode, pin, loading },
    } = this
    const title = message || translate('outro.title')
    const body = submessage || translate('outro.body')
    console.log('state', this.state)
    return (
      <div className={style.wrapper}>
        {loading ? (
          <Spinner />
        ) : (
          <Fragment>
            <span className={`${theme.icon}  ${style.icon}`} />
            <PageTitle title={title} subTitle={body} />
            <p className={style.pin}>{pin}</p>
            <img className={style.msQrCode} src={qrCode} />
          </Fragment>
        )}
      </div>
    )
  }
}

export default trackComponent(localised(Complete))
