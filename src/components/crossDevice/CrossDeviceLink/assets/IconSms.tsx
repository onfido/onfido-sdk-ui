import { h } from 'preact'
import { useSdkOptions } from '~contexts'
import { IconElement } from '~types/commons'

const IconSms: IconElement = (props) => {
  const [sdkOptions] = useSdkOptions()

  return (
    <svg viewBox="0 0 14 13" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g
        fill={sdkOptions?.customUI?.colorIcon || '#3640F5'}
        transform="translate(-1 -2)"
        fillRule="evenodd"
      >
        <path
          id="a"
          d="m14 2h-12c-0.36819 0-0.66667 0.29848-0.66667 0.66667v8c0 0.36819 0.29848 0.66667 0.66667 0.66667h2.6667v2.6667c-5.9623e-4 0.26991 0.16178 0.5135 0.41115 0.61678s0.53642 0.045842 0.72685-0.14545l3.138-3.138h5.0573c0.36819 0 0.66667-0.29848 0.66667-0.66667v-8c0-0.36819-0.29848-0.66667-0.66667-0.66667zm-0.66667 8h-4.6667c-0.17686-2.565e-4 -0.34651 0.070051-0.47133 0.19533l-2.1953 2.1953v-1.724c0-0.36819-0.29848-0.66667-0.66667-0.66667h-2.6667v-6.6667h10.667v6.6667zm-9.3333-5.3333h8v1.3333h-8v-1.3333zm0 2.6667h4v1.3333h-4v-1.3333z"
        />
      </g>
    </svg>
  )
}

export default IconSms
