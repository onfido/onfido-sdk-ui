import { h, FunctionComponent } from 'preact'

import { useLocales } from '~locales'
import ScreenLayout from '../Theme/ScreenLayout'
import style from './style.scss'
import Spinner from '../Spinner'
import { getBackendUrl, apiPort } from '../utils/msvcUtils'
import PageTitle from '../PageTitle'

const startCheck = () => {
  // To-Do: replace actual wsJwt PT-195
  const placeholderWsJwt =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzUxMiIsImtpZCI6IjEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMSJ9.eyJwYXlsb2FkIjp7ImZpcnN0TmFtZSI6InRlc3QiLCJsYXN0TmFtZSI6InVzZXIiLCJjb3VudHJ5IjoiVVNBIiwicGhvbmVOdW1iZXIiOiIxMjMtNDU2LTc4OTYiLCJlbWFpbCI6InRlc3RlbWFpbEBleGFtcGxlLmNvbSIsImNhbGxiYWNrVXJsIjoiaHR0cHM6Ly9haXItYWNjZXNzLmdzay5jb20vc29tZS1wYXRoL3NvbWV0aGluZz92YWx1ZTE9dHJ1ZSZ2YWx1ZTI9c29tZS1zdHJpbmciLCJyZWx5aW5nUGFydHkiOiJtc3ZjLWdzayIsImFwcGxpY2FudElkIjoiMmE3NjZiNmYtYTIwYS00ZTgxLWFhZmQtNzBkMmRjOTM5Mzc3In0sImlhdCI6MTYzOTY4MjIyMCwiZXhwIjoxNjM5Njg3NjIwfQ.MIGIAkIAg8Lc-9rdqMDt5GyZ13CyPb2SMESU4PGSSlcA8Ol_-J78hpglyRi3gaCB1AHLSgXdV3SNgh4idVBDY8ieAK6pXI8CQgEWVG3RPhTKhukmKs2W_EKoDV9KwxHGr8xmCIaIkl6VT10zuwdWK4inYIcXpsJ6SB2dv9UQkSM-3gqyjBUQ4aM4gA'
  const request = new XMLHttpRequest()
  request.open('POST', `${getBackendUrl()}:${apiPort}/check`)
  request.setRequestHeader('authorization', `Bearer ${placeholderWsJwt}`)
  request.onload = () => {
    if (request.status === 200 || request.status === 201) {
      console.log(request.responseText)
    } else {
      console.error('request failed', request)
    }
  }
  request.send()
}

const MsvcVerifying: FunctionComponent = () => {
  const { translate } = useLocales()
  startCheck()
  return (
    <ScreenLayout className={style.screen}>
      <div className={style.spinner}>
        <Spinner />
      </div>
      <PageTitle
        className={style.container}
        title={translate(`msvc_verifying.title`)}
        subTitle={translate('msvc_verifying.subtitle')}
      />
    </ScreenLayout>
  )
}

export default MsvcVerifying
