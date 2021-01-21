import { h, FunctionComponent } from 'preact'
import PageTitle from '../PageTitle'
import classNames from 'classnames'
import style from './style.scss'
import { localised } from '../../locales'

import type { ChallengePayload } from '~types/api'
import type { WithLocalisedProps } from '~types/hocs'

type ChallengeContainerProps = {
  title: string
  renderInstructions: () => h.JSX.Element
}

const ChallengeContainer: FunctionComponent<ChallengeContainerProps> = ({
  title,
  renderInstructions,
}) => (
  <div>
    <PageTitle title={title} className={style.challengeTitle} />
    <div aria-level="2" className={style.challengeDescription}>
      {renderInstructions()}
    </div>
  </div>
)

const Challenge: FunctionComponent<ChallengePayload & WithLocalisedProps> = ({
  query,
  type,
  translate,
}) => {
  if (type === 'recite') {
    return (
      <ChallengeContainer
        title={translate('video_capture.header.challenge_digit_instructions')}
        renderInstructions={() => (
          <span className={style.recite}>
            {(query as number[]).join(' \u2013 ')}
          </span>
        )}
      />
    )
  }

  if (type === 'movement' && typeof query === 'string') {
    const side = query.replace('turn', '').toLowerCase()

    return (
      <ChallengeContainer
        title={translate('video_capture.header.challenge_turn_template', {
          side: translate(`video_capture.header.challenge_turn_${side}`),
        })}
        renderInstructions={() => (
          <span
            className={classNames(style.movement, style[`movement-${query}`])}
          />
        )}
      />
    )
  }

  return null
}

export default localised<ChallengePayload>(Challenge)
