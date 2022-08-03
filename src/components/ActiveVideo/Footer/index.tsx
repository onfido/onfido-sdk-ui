import { h, FunctionComponent } from 'preact'
import styles from './style.module.scss'

export const Footer: FunctionComponent = ({ children }) => {
  return <footer className={styles.footer}>{children}</footer>
}
