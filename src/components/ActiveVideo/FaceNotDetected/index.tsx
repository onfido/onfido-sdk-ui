import { h, FunctionComponent } from 'preact'
import styles from './style.module.scss'
import { Button } from '../Button'
import { Footer } from '../Footer'
import { Header } from '../Header'
import { ErrorIcon } from '../assets/ErrorIcon'
import { SunIcon } from '../assets/SunIcon'
import { EyeIcon } from '../assets/EyeIcon'
import { MaskIcon } from '../assets/MaskIcon'
import { PersonIcon } from '../assets/PersonIcon'
import { Wrapper } from '../Wrapper'
import { BaseScreen } from '../BaseScreen'
import { localised } from '~locales'
import { trackComponent } from 'Tracker'
import type { WithTrackingProps } from '~types/hocs'
import { TranslateCallback } from '@onfido/active-video-capture'

type Props = {
  restart: () => void
  translate: TranslateCallback
} & WithTrackingProps

const FaceNotDetected: FunctionComponent<Props> = ({
  restart,
  trackScreen,
  translate,
}: Props) => {
  const items = [
    {
      icon: <SunIcon />,
      label: translate('avc_no_face_detected.list_item_lighting'),
    },
    {
      icon: <EyeIcon />,
      label: translate('avc_no_face_detected.list_item_eyes'),
    },
    {
      icon: <MaskIcon />,
      label: translate('avc_no_face_detected.list_item_mask'),
    },
    {
      icon: <PersonIcon />,
      label: translate('avc_no_face_detected.list_item_face'),
    },
  ]

  const handleRestart = (): void => {
    trackScreen('no_face_detected_restart_clicked')
    restart()
  }

  return (
    <BaseScreen>
      <Wrapper>
        <Header title={translate('avc_no_face_detected.title')}>
          <ErrorIcon />
        </Header>

        <ul className={styles.list}>
          {items.map((item, index) => (
            <li className={styles.listItem} key={index}>
              {item.icon} <span className={styles.text}>{item.label}</span>
            </li>
          ))}
        </ul>
      </Wrapper>

      <Footer>
        <Button onClick={() => handleRestart()}>
          {translate('avc_no_face_detected.button_primary_restart')}
        </Button>
      </Footer>
    </BaseScreen>
  )
}

export default trackComponent(localised(FaceNotDetected), 'no_face_detected')
