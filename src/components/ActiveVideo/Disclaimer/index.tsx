import { h, FunctionComponent } from 'preact'
import { InfoIcon } from '../assets/InfoIcon'
import styles from './style.module.scss'

interface Props {
  text: string
  hideIcon?: boolean
}

export const Disclaimer: FunctionComponent<Props> = ({
  text,
  hideIcon = false,
}: Props) => (
  <div className={styles.disclaimer}>
    {!hideIcon && <InfoIcon />}
    <span className={styles.text}>{text}</span>
  </div>
)
