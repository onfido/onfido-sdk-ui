import { h } from 'preact'
import { useSdkOptions } from '~contexts'
import { IconElement } from '~types/commons'

const IconWarningSmall: IconElement = (props) => {
  const [sdkOptions] = useSdkOptions()

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" {...props}>
      <g fill="none" fillRule="evenodd">
        <circle
          fill={sdkOptions.customUI?.colorIcon || '#3640F5'}
          cx={8}
          cy={8}
          r={8}
        />
        <g transform="translate(7 3)" fill="#fff">
          <rect y={3} width={2} height={7} rx={1} />
          <circle cx={1} cy={1} r={1} />
        </g>
      </g>
    </svg>
  )
}

export default IconWarningSmall
