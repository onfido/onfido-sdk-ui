import { h, FunctionComponent } from 'preact'

export const ErrorIcon: FunctionComponent = () => {
  return (
    <svg width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 48c13.255 0 24-10.745 24-24S37.255 0 24 0 0 10.745 0 24s10.745 24 24 24Z"
        fill="#F54E4E"
      />
      <path
        d="m29.59 16.459-5.658 5.656-5.656-5.656-1.885 1.885L22.047 24l-5.656 5.656 1.885 1.886 5.656-5.656 5.657 5.656 1.886-1.886L25.819 24l5.656-5.656-1.886-1.885Z"
        fill="#fff"
      />
    </svg>
  )
}
