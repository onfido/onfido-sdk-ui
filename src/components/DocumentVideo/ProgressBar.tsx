import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'
import style from './style.scss'

export type Props = {
  stepNumber: number
  totalSteps: number
}

const ProgressBar: FunctionComponent<Props> = ({ stepNumber, totalSteps }) => (
  <div className={style.progress}>
    {Array(totalSteps)
      .fill(null)
      .map((_step, index) => (
        <span
          className={classNames(style.step, {
            [style.active]: index < stepNumber,
          })}
          key={`document-video-progress-${index}`}
        />
      ))}
  </div>
)

export default ProgressBar
