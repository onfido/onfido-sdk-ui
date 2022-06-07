import { h } from 'preact'
import { useSdkOptions } from '~contexts'
import { IconElement } from '~types/commons'

const IconCopyLink: IconElement = (props) => {
  const [sdkOptions] = useSdkOptions()

  return (
    <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g
        fill={sdkOptions?.customUI?.colorIcon || '#3640F5'}
        xlinkHref="#a"
        transform="translate(-2 -2)"
        fillRule="evenodd"
      >
        <path
          id="a"
          d="M5.643 7.529c.756-.756 2.073-.756 2.828 0L8.943 8l.942-.943-.471-.471a3.31 3.31 0 0 0-2.357-.977 3.31 3.31 0 0 0-2.356.977L3.286 8a3.339 3.339 0 0 0 0 4.714 3.322 3.322 0 0 0 2.357.975A3.321 3.321 0 0 0 8 12.714l.471-.471-.942-.943-.472.471a2.005 2.005 0 0 1-2.829 0 2.003 2.003 0 0 1 0-2.828l1.415-1.414zM11.3 9.414 12.714 8a3.339 3.339 0 0 0 0-4.714 3.337 3.337 0 0 0-4.714 0l-.471.471.942.943.472-.471a2.005 2.005 0 0 1 2.828 0c.78.782.78 2.046 0 2.828l-1.414 1.414c-.756.756-2.073.756-2.828 0L7.057 8l-.942.943.471.471a3.31 3.31 0 0 0 2.357.977 3.31 3.31 0 0 0 2.356-.977z"
        />
      </g>
    </svg>
  )
}

export default IconCopyLink
