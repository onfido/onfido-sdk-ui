import { h } from 'preact'
import { useSdkOptions } from '~contexts'
import { IconElement } from '~types/commons'

const IconCheckmark: IconElement = (props) => {
  const [sdkOptions] = useSdkOptions()
  return (
    <svg viewBox="0 0 13 11" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M10.17.52 4.302 6.746 2.836 5.19a1.596 1.596 0 0 0-2.347 0 1.84 1.84 0 0 0 0 2.491l2.64 2.805a1.59 1.59 0 0 0 2.347 0l7.04-7.475a1.84 1.84 0 0 0 0-2.49 1.59 1.59 0 0 0-2.346 0z"
        fill={sdkOptions?.customUI?.colorIcon || '#353FF4'}
        fillRule="evenodd"
      />
    </svg>
  )
}

export default IconCheckmark
