import { h } from 'preact'
import { useSdkOptions } from '~contexts'
import { IconElement } from '~types/commons'

const IconAlert: IconElement = (props) => {
  const [sdkOptions] = useSdkOptions()

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14"
      fill="none"
      {...props}
    >
      <circle
        cx={7}
        cy={7}
        r={7}
        fill={sdkOptions?.customUI?.colorIcon || '#e61c1c'}
      />
      <path
        fillRule="evenodd"
        d="M6.417 2.917h1.167v5.828H6.417V2.917zm0 6.998h1.167v1.168H6.417V9.915z"
        fill="#fff"
      />
    </svg>
  )
}

export default IconAlert
