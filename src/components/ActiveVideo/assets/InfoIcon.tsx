import { h, FunctionComponent } from 'preact'

export const InfoIcon: FunctionComponent = () => {
  return (
    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 12C2 6.486 6.465 2 11.953 2 17.493 2 22 6.486 22 12s-4.486 10-10 10S2 17.514 2 12Zm2 0c0 4.411 3.589 8 8 8s8-3.589 8-8-3.609-8-8.047-8C7.567 4 4 7.589 4 12Zm9-5h-2v7h2V7Zm0 10v-2h-2v2h2Z"
        fill="#636670"
      />
    </svg>
  )
}
