import { h } from 'preact'
import { useSdkOptions } from '~contexts'
import { IconElement } from '~types/commons'

const IconInfo: IconElement = (props) => {
  const [sdkOptions] = useSdkOptions()

  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <defs>
        <path
          id="a"
          d="M8.667 9.933a3.34 3.34 0 0 0 2.666-3.266c0-1.838-1.495-3.334-3.333-3.334S4.667 4.83 4.667 6.667H6c0-1.103.897-2 2-2s2 .897 2 2c0 1.102-.897 2-2 2h-.667v2h1.334v-.734zM7.333 12h1.334v1.333H7.333V12z"
        />
      </defs>
      <g fill="none" fillRule="evenodd">
        <circle
          cx={8}
          cy={8}
          r={8}
          fill={sdkOptions.customUI?.colorIcon || '#3640F5'}
        />
        <use fill="#FFF" xlinkHref="#a" />
      </g>
    </svg>
  )
}

export default IconInfo
