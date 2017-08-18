import { h, Component } from 'preact'
import { isDesktop } from '../utils'
import style from './style.css'

export default class MobileLink extends Component {

  constructor (props) {
    super(props)
    const { methods, token } = props
    this.state = {
      shortUrl: null
    }
    const longUrl = this.mobileUrl(methods, token)
    this.shortenUrl(longUrl, this.onShortUrl)
  }

  onShortUrl = (response) => {
    this.setState({shortUrl: response.id})
  }

  shortenUrl = (longUrl, onSuccess) => {
    const request = new XMLHttpRequest()
    const key = process.env.URL_SHORTENER_KEY
    const url = `https://www.googleapis.com/urlshortener/v1/url?key=${key}`
    request.open('POST', url)
    request.setRequestHeader('Content-Type', 'application/json')

    request.onload = () => {
      if (request.status === 200 || request.status === 201) {
        onSuccess(JSON.parse(request.response))}
      else {
        console.error(`Could not shorten URL: ${longUrl}`)
      }
    }
    request.send(JSON.stringify({longUrl}))
  }


  mobileUrl = (methods, token) => {
    const url = window.location.href.split('?')[0]
    return `${url}?steps=${methods.join()},complete&token=${token}`
  }

  render = () => {
    const url = this.state.shortUrl
    return isDesktop && url  ?
      <p className={style.instructions}>Or use your mobile: {this.state.shortUrl}</p> :
      null
  }
}
