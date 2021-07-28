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
    // console.log(queryString.parse(window.location.search))
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
        case 'staging':
          this.backendUrl =
            'https://microsoft-authenticator-backend.eu-west-1.pre-prod.onfido.xyz'
          // 'https://microsoft-authenticator-backend.eu-west-1.dev.onfido.xyz'
          break
        case 'testing':
          this.backendUrl =
            'https://microsoft-authenticator-backend.us.onfido.com'
          break
        default:
          this.backendUrl =
            'https://microsoft-authenticator-backend.eu-west-1.pre-prod.onfido.xyz'
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
    // console.log('parsedParams', parsedParams)
    // console.log('queryParams', queryParams)
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
    // console.log('inside fetchQrCode')
    axios(config)
      .then((response) => {
        const {
          data: { qrCode, pin, errorCode, message },
        } = response
        // console.log('success', response.data)
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
        // console.log('response', response)
        // window.location.replace(response.data.redirectUrl)
        // TO-DO: remove this when we have the gsk endpoint working
        window.location.replace('https://www.gsk.com/en-gb/home/')
      })
      .catch((error) => {
        console.log('something went wrong', error)
      })
  }

  render({ message, submessage, translate }) {
    const {
      state: { pin, loading, qrCode },
    } = this
    const title = message || translate('outro.title')
    const body = submessage || translate('outro.body')
    // console.log('state', this.state)
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
