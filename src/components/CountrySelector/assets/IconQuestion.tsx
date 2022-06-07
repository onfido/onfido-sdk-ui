import { h } from 'preact'
import { useSdkOptions } from '~contexts'
import { IconElement } from '~types/commons'

const IconQuestion: IconElement = (props) => {
  const [sdkOptions] = useSdkOptions()

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 12"
      fill="none"
      {...props}
    >
      <circle
        cx={6}
        cy={6}
        r={6}
        fill={sdkOptions?.customUI?.colorIcon || '#3640f5'}
      />
      <path
        fillRule="evenodd"
        d="M6.5 7.45A2.515 2.515 0 0 0 8.5 5c0-1.378-1.12-2.5-2.5-2.5S3.5 3.622 3.5 5h1a1.5 1.5 0 1 1 3 0A1.5 1.5 0 0 1 6 6.5h-.5V8h1v-.55zM5.5 9h1v1h-1V9z"
        fill="#fff"
      />
    </svg>
  )
}

export default IconQuestion
