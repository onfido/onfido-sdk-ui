import { h, FunctionComponent, ComponentChildren } from 'preact'
import styles from './style.module.scss'

interface Props {
  onClick: (event: MouseEvent) => void
  children?: ComponentChildren
}

export const Button: FunctionComponent<Props> = ({
  onClick,
  children,
}: Props) => (
  <button onClick={onClick} className={styles.button}>
    {children}
  </button>
)
