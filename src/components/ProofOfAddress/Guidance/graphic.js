import { h } from 'preact'
import style from './style.scss'

const Graphic = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 272 217"
    preserveAspectRatio="xMidYMin meet"
    className={style.docImage}
  >
    <text transform="translate(0 59)" className={style.label}>
      Full name
    </text>
    <text transform="translate(0 90)" className={style.label}>
      Current
    </text>
    <text transform="translate(0 110)" className={style.label}>
      Address
    </text>
    <text transform="translate(0 141)" className={style.label}>
      Issue date or
    </text>
    <text transform="translate(84.314 141)" className={style.label} />
    <text transform="translate(0 161)" className={style.label}>
      Summary period
    </text>
    <text transform="translate(0 28)" className={style.label}>
      Logo
    </text>
    <g transform="translate(119)">
      <path
        fill="#2C3E4F"
        d="M8 0h122.79c1.985.002 3.9.744 5.37 2.08l8.65 7.84c.092.084.182.171.27.26l5.57 5.56A8 8 0 0 1 153 21.4V209a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V8a8 8 0 0 1 8-8z"
      />
      <path
        fill="#FFF"
        d="M8.03 4.02h126.2a4.002 4.002 0 0 1 2.83 1.17L147.8 15.9a4.005 4.005 0 0 1 1.171 2.83v190.241a4 4 0 0 1-4 4H8.03a4 4 0 0 1-4-4V8.02a4 4 0 0 1 4-4z"
      />
      <path
        fill="#2C3E4F"
        d="M135.189 2.95L142 9c.034.029.068.059.1.09l7.521 7.6a2 2 0 0 1-1.42 3.4H133.85a2 2 0 0 1-2-2V4.45a2 2 0 0 1 3.33-1.5h.009z"
      />
      <path
        fill="#F3F3F4"
        d="M101.66 63.29h30.21a1 1 0 0 1 1 1v2.02a1 1 0 0 1-1 1h-30.21a1 1 0 0 1-1-1v-2.02a1 1 0 0 1 1-1z"
      />
      <path
        fill="#D8DADC"
        d="M101.66 51.24h38.26a1 1 0 0 1 1 1v6.04a1 1 0 0 1-1 1h-38.26a1 1 0 0 1-1-1v-6.04a1 1 0 0 1 1-1zM13.08 99.46h90.609a1 1 0 0 1 1 1v6.04a1 1 0 0 1-1 1H13.08a1 1 0 0 1-1-1v-6.04a1 1 0 0 1 1-1z"
      />
      <path
        fill="#F3F3F4"
        fillOpacity=".5"
        d="M13.08 111.51h130.87a1 1 0 0 1 1 1v71.34a1 1 0 0 1-1 1H13.08a1 1 0 0 1-1-1v-71.34a1 1 0 0 1 1-1z"
      />
      <path
        fill="#D8DADC"
        d="M41.6 79.37v7.03c0 .55-.399 1-.92 1H13c-.5 0-.92-.45-.92-1V64.3c0-.56.41-1 .92-1h42.45c.5 0 .92.44.92 1v14.06c0 .56-.41 1-.92 1H41.6v.01zM13.08 51.24h66.449a1 1 0 0 1 1 1v6.04a1 1 0 0 1-1 1H13.08a1 1 0 0 1-1-1v-6.04a1 1 0 0 1 1-1z"
      />
      <ellipse fill="#D8DADC" cx="28.18" cy="28.13" rx="16.11" ry="16.07" />
    </g>
    <path
      fill="#8B9094"
      d="M36.5 23h102a.5.5 0 0 1 0 1h-102a.5.5 0 0 1 0-1zM68.5 54h70a.5.5 0 0 1 0 1h-70a.5.5 0 0 1 0-1zM55.5 84h83a.5.5 0 0 1 0 1h-83a.5.5 0 0 1 0-1z"
    />
    <g fill="#8B9094">
      <path d="M89.5 136h142c.275 0 .5.225.5.5s-.225.5-.5.5h-142a.5.5 0 0 1 0-1z" />
      <path d="M139.5 102a.5.5 0 0 1 .5.5v34a.5.5 0 0 1-1 0v-34a.5.5 0 0 1 .5-.5zM231.5 56a.5.5 0 0 1 .5.5v80c0 .275-.225.5-.5.5a.501.501 0 0 1-.5-.5v-80a.5.5 0 0 1 .5-.5z" />
    </g>
  </svg>
)

export default Graphic
