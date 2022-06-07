import { h } from 'preact'
import { useSdkOptions } from '~contexts'
import { IconElement } from '~types/commons'

const IconSuccess: IconElement = (props) => {
  const [sdkOptions] = useSdkOptions()
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M24 48c13.255 0 24-10.745 24-24S37.255 0 24 0 0 10.745 0 24s10.745 24 24 24Z"
        fill={sdkOptions?.customUI?.colorIcon || '#3640F5'}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m20.943 31.61 13.333-13.334-1.885-1.885L20 28.78l-5.724-5.724-1.885 1.886 6.666 6.666a1.33 1.33 0 0 0 1.886 0Z"
        fill="#fff"
      />
    </svg>
  )
}

export default IconSuccess
