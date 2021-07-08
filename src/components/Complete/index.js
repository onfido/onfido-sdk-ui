import { h, Component } from 'preact'
import { Fragment } from 'react'
const queryString = require('query-string')
import { trackComponent } from '../../Tracker'
import ScreenLayout from '../Theme/ScreenLayout'
import PageTitle from '../PageTitle'
import { localised } from '../../locales'
import theme from '../Theme/style.scss'
import style from './style.scss'
import Spinner from '../Spinner'
import axios from 'axios'

class Complete extends Component {
  constructor(props) {
    super(props)
    console.log(queryString.parse(window.location.search))
    const parsedParams = queryString.parse(window.location.search)
    const queryParams = {
      ...parsedParams,
      firstName: parsedParams.firstName || 'john',
      lastName: parsedParams.lastName || 'doe',
      callbackUrl: parsedParams.callbackUrl || 'http://localhost:3000',
    }
    console.log('parsedParams', parsedParams)
    console.log('queryParams', queryParams)
    this.state = {
      qrCode: '',
      queryParams,
      pin: '',
      errorCode: (queryParams.error && 418) || null,
      message: '',
      loading: true,
    }
  }

  componentDidMount() {
    this.props.nextStep()
    this.fetchQrCode()
  }

  sendGskResponse = () => {
    const {
      state: { queryParams, errorCode, message },
    } = this
    const payload = {
      // will return the default true if undefined
      'vc-issued':
        queryParams['vc-issued'] === undefined
          ? true
          : queryParams['vc-issued'],
      message,
      error: errorCode,
    }
    console.log('sending message to GSK', queryParams.callbackUrl, payload)
    const config = {
      method: 'post',
      url: queryParams.callbackUrl,
      data: payload,
    }
    axios(config)
      .then((response) => {
        console.log('gsk call successful', response.data)
      })
      .catch((e) => {
        console.log('something went wrong: ', e)
      })
  }

  fetchQrCode = () => {
    const {
      state: { firstName, lastName, error },
    } = this
    const data = {
      firstName,
      lastName,
      error,
    }
    const config = {
      method: 'post',
      url: 'http://localhost:3000/check',
      data,
    }
    console.log('inside fetchQrCode')
    axios(config)
      .then((response) => {
        const {
          data: { qrCode, pin, errorCode, message },
        } = response
        console.log('success', response.data)
        this.setState({
          qrCode,
          pin,
          errorCode,
          message,
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
          <ScreenLayout>
            {this.sendGskResponse()}
            <span className={`${theme.icon}  ${style.icon}`} />
            <PageTitle title={title} subTitle={body} />
            <p className={style.pin}>{pin}</p>
            <img className={style.msQrCode} src={qrCode} />
          </ScreenLayout>
        )}
      </div>
    )
  }
}

export default trackComponent(localised(Complete))
