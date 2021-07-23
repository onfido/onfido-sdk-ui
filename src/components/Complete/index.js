import { h, Component } from 'preact'
import { Fragment } from 'react'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'
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
    console.log('process', JSON.stringify(process.env.NODE_ENV))
    this.backendUrl
    const getBackendUrl = () => {
      switch (process.env.NODE_ENV) {
        case 'development':
          if (
            location.hostname === '0.0.0.0' ||
            location.hostname === 'localhost'
          ) {
            this.backendUrl = 'http://localhost:3000'
          } else {
            this.backendUrl =
              'https://microsoft-authenticator-backend.eu-west-1.dev.onfido.xyz'
          }
          break
        case 'production':
          this.backendUrl =
            'https://microsoft-authenticator-backend.us.onfido.com/health'
          break
        default:
          this.backendUrl =
            'https://microsoft-authenticator-backend.eu-west-1.dev.onfido.xyz'
          break
      }
    }
    getBackendUrl()
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
      state: {
        queryParams: { firstName, lastName, error },
      },
    } = this

    const data = {
      firstName,
      lastName,
      error,
      gsk: true,
    }
    const config = {
      method: 'post',
      url: `${this.backendUrl}/check`,
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

  sendComplete = () => {
    const {
      state: { queryParams, errorCode, message },
    } = this
    const payload = {
      // will return the default true if undefined
      'vc-issued':
        queryParams['vc-issued'] === undefined
          ? true
          : queryParams['vc-issued'],
      'error-code': errorCode,
      message,
    }

    const config = {
      method: 'post',
      url: `${this.backendUrl}/complete`,
      data: {
        callbackUrl: queryParams.callbackUrl,
        payload,
      },
    }
    axios(config)
      .then((response) => {
        console.log('response', response)
        window.location.replace(response.data.redirectUrl)
      })
      .catch((error) => {
        console.log('something went wrong', error)
      })
  }

  render({ message, submessage, translate }) {
    const {
      state: { pin, loading, qrCode },
    } = this
    // const qrCode = 'data:image/png;base64,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'
    const title = message || translate('outro.title')
    const body = submessage || translate('outro.body')
    console.log('state', this.state)
    return (
      <div className={style.wrapper}>
        {loading ? (
          <Spinner />
        ) : (
          <ScreenLayout>
            <span className={`${theme.icon}  ${style.icon}`} />
            <PageTitle title={title} subTitle={body} />
            <p className={style.pin}>{pin}</p>
            <div className={style.buttonContainer}>
              <img className={style.msQrCode} src={qrCode} />
              <Button
                variant="primary"
                className={classNames(theme['button-centered'], theme['button-lg'])}
                onClick={() => this.sendComplete()}
                data-onfido-qa="enable-camera-btn"
              >
                Finish
              </Button>
            </div>
          </ScreenLayout>
        )}
      </div>
    )
  }
}

export default trackComponent(localised(Complete))
