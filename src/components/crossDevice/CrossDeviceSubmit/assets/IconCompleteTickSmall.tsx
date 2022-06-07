import { h } from 'preact'
import { useSdkOptions } from '~contexts'
import { IconElement } from '~types/commons'

const IconCompleteTickSmall: IconElement = (props) => {
  const [sdkOptions] = useSdkOptions()
  return (
    <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="none" fillRule="evenodd">
        <circle
          fill={sdkOptions?.customUI?.colorIcon || '#353FF4'}
          cx={18}
          cy={18}
          r={18}
        />
        <path
          d="m24.25 10.526-8.8 9.34-2.2-2.336a2.395 2.395 0 0 0-3.52 0c-.973 1.035-.973 2.71 0 3.738l3.96 4.206a2.385 2.385 0 0 0 3.52 0l10.56-11.211c.973-1.034.973-2.71 0-3.737a2.385 2.385 0 0 0-3.52 0Z"
          fill="#FFF"
        />
      </g>
    </svg>
  )
}

export default IconCompleteTickSmall
