import { h, FunctionComponent } from 'preact'

export const CameraIcon: FunctionComponent = () => {
  return (
    <svg width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 48c13.255 0 24-10.745 24-24S37.255 0 24 0 0 10.745 0 24s10.745 24 24 24Z"
        fill="#3640F5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.383 18.076a.996.996 0 0 0-1.09.217L29 21.586V17a1 1 0 0 0-1-1H15a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-4.586l3.293 3.293A.999.999 0 1 0 34 29V19a.999.999 0 0 0-.617-.924ZM27 30H16V18h11v12Zm5-3.414L29.414 24 32 21.414v5.172Z"
        fill="#fff"
      />
    </svg>
  )
}
