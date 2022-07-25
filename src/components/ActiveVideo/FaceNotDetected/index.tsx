import { h, FunctionComponent } from 'preact'
import { TranslateCallback } from '@onfido/active-video-capture'
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

interface Props {
  restart: () => void
  translate: TranslateCallback
}

const FaceNotDetected: FunctionComponent<Props> = ({
  restart,
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
        <Button onClick={() => restart()}>
          {translate('avc_no_face_detected.button_primary_restart')}
        </Button>
      </Footer>
    </BaseScreen>
  )
}

export default localised(FaceNotDetected)
