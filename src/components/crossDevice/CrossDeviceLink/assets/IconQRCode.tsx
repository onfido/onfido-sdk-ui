import { h } from 'preact'
import { useSdkOptions } from '~contexts'
import { IconElement } from '~types/commons'

const IconQRCode: IconElement = (props) => {
  const [sdkOptions] = useSdkOptions()
  return (
    <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill={sdkOptions?.customUI?.colorIcon || '#3640F5'} fillRule="evenodd">
        <path d="M0 0h10v10H0V0zm1 1v8h8V1H1z" />
        <path d="M6 0h4v4H6V0zm1 1v2h2V1H7zM0 0h4v4H0V0zm1 1v2h2V1H1zM0 6h4v4H0V6zm1 1v2h2V7H1z" />
      </g>
    </svg>
  )
}

export default IconQRCode
