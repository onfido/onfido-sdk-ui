import { h, FunctionComponent, ComponentChildren } from 'preact'
import styles from './style.module.scss'

interface Props {
  title: string
  subtitle?: string
  children?: ComponentChildren
}

export const Header: FunctionComponent<Props> = ({
  title,
  subtitle,
  children,
}) => (
  <header className={styles.header}>
    {children}

    {title && <h3 className={styles.title}>{title}</h3>}
    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
  </header>
)
