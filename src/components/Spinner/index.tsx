import { h } from 'preact'
import { useLocales } from '~locales'
import style from './style.scss'
import { useEffect, useRef } from 'preact/compat'

type SpinnerProps = {
  shouldAutoFocus?: boolean
}

const Spinner = ({ shouldAutoFocus }: SpinnerProps) => {
  const { translate } = useLocales()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    containerRef.current && shouldAutoFocus && containerRef.current.focus()
  }, [shouldAutoFocus])

  return (
    <div>
      <div
        className={style.loader}
        aria-live="assertive"
        tabIndex={-1}
        role="progressbar" // fixes issues on iOS where the aria-live="assertive" is not announced
        ref={containerRef}
        aria-label={translate('generic.loading')}
      >
        <div className={style.inner}>
          <div />
          <div />
          <div />
        </div>
      </div>
    </div>
  )
}

export default Spinner
