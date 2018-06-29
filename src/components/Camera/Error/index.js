import { h } from 'preact'
import theme from 'components/Theme/style.css'
import { trackComponent } from 'Tracker'
import style from './style.css'

import Error from '../Error'

const retry = () => window.location.reload()

const CameraError = ({i18n}) => (
  <div className={style.container}>
    <Error
      error={{
        name: 'CAMERA_NOT_WORKING',
        type: 'error',
      }}
      options={{
        parseInstructionTags: ({ text }) => <span onClick={ retry } className={style.link}>{text}</span> 
      }}
    />
  </div>
)

export default trackComponent(CameraError)