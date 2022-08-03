import { h, FunctionComponent } from 'preact'
import styles from './style.module.scss'

export const Wrapper: FunctionComponent = ({ children }) => (
  <section className={styles.wrapper}>{children}</section>
)
