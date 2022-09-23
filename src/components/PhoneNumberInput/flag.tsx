import { h } from 'preact'
import classNames from 'classnames'
import { getCountryFlagSrc } from '~supported-documents'
import style from './flag.scss'

const FlagComponent = ({ country }: { country: string }) => (
  <span
    className={classNames('react-phone-number-input__icon', style.flagIcon)}
    style={{
      'background-image': `url(${getCountryFlagSrc(country, 'rectangle')})`,
    }}
  />
)
export default FlagComponent
