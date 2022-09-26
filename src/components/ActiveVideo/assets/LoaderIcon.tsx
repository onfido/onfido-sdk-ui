import { h, FunctionComponent } from 'preact'

export const LoaderIcon: FunctionComponent = () => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        opacity="0.25"
        cx="24"
        cy="24"
        r="22.5"
        stroke="#3640F5"
        strokeWidth="3"
      />
      <path
        d="M24 1.5C26.9547 1.5 29.8806 2.08198 32.6104 3.21271C35.3402 4.34344 37.8206 6.00078 39.9099 8.0901C41.9992 10.1794 43.6566 12.6598 44.7873 15.3896C45.918 18.1195 46.5 21.0453 46.5 24"
        stroke="#3640F5"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          dur="1s"
          type="rotate"
          from="0 24 24"
          to="360 24 24"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  )
}
