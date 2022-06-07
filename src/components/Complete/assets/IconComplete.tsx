import { h } from 'preact'
import { useSdkOptions } from '~contexts'
import { IconElement } from '~types/commons'

const IconComplete: IconElement = (props) => {
  const [sdkOptions] = useSdkOptions()

  return (
    <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="none" fillRule="evenodd">
        <circle
          fill={sdkOptions.customUI?.colorIcon || '#353FF4'}
          cx={28}
          cy={28}
          r={28}
        />
        <path
          d="m37.723 16.373-13.69 14.53-3.423-3.633c-1.512-1.6-3.964-1.6-5.476 0-1.512 1.608-1.512 4.214 0 5.813l6.16 6.544c1.513 1.61 3.964 1.61 5.477 0l16.43-17.44c1.51-1.61 1.51-4.215 0-5.814-1.513-1.61-3.964-1.61-5.477 0z"
          fill="#FFF"
        />
      </g>
    </svg>
  )
}

export default IconComplete
