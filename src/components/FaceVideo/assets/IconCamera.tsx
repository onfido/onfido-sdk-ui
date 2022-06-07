import { h } from 'preact'
import { useSdkOptions } from '~contexts'
import { IconElement } from '~types/commons'

const IconCamera: IconElement = (props) => {
  const [sdkOptions] = useSdkOptions()
  return (
    <svg
      viewBox="0 0 27 27"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <defs>
        <path id="a" d="M.03 0h26.59v26.592H.029z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <mask id="b" fill="#fff">
          <use xlinkHref="#a" />
        </mask>
        <path
          d="M25 14c0 6.627-5.373 12-12 12S1 20.627 1 14 6.373 2 13 2s12 5.373 12 12"
          fill={sdkOptions?.customUI?.colorIcon || '#353FF4'}
          mask="url(#b)"
        />
        <path
          d="m21.358 10.334-3.62 3.191a1.05 1.05 0 0 0 0 1.618l3.62 3.19v-8zM16 17.367c0 .749-.552 1.356-1.234 1.356H6.234c-.682 0-1.234-.607-1.234-1.356V10.08c0-.749.552-1.357 1.234-1.357h8.532c.682 0 1.234.608 1.234 1.357v7.287z"
          fill="#FEFEFE"
          mask="url(#b)"
        />
      </g>
    </svg>
  )
}

export default IconCamera
