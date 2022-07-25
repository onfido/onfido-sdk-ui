import { h, FunctionComponent, ComponentChildren } from 'preact'
import styles from './style.module.scss'

interface Props {
  children?: ComponentChildren
}

export const BaseScreen: FunctionComponent = ({ children }: Props) => (
  <div className={styles.baseScreen}>{children}</div>
)
