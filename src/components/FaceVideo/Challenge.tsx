import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'

import { localised } from '../../locales'
import PageTitle from '../PageTitle'
import style from './style.scss'

import type { ChallengePayload } from '~types/api'
import type { WithLocalisedProps } from '~types/hocs'

type ChallengeContainerProps = {
  title: string
  renderInstructions: () => h.JSX.Element
  movementChallengeSubTitle?: string
}

const ChallengeContainer: FunctionComponent<ChallengeContainerProps> = ({
  title,
  renderInstructions,
  movementChallengeSubTitle,
}) => (
  <div>
    {/* <PageTitle title={title} className={style.challengeTitle} /> */}
    <span role="heading" aria-level="1" className={style.challengeTitle}>
      {title}
    </span>
    <div aria-level="2" className={style.challengeDescription}>
      {renderInstructions()}
    </div>
    {movementChallengeSubTitle && (
      <span role="heading" aria-level="1" className={style.challengeTitle}>
        {movementChallengeSubTitle}
      </span>
    )}
  </div>
)

type ChallengeProps = {
  challenge: ChallengePayload
}

type Props = ChallengeProps & WithLocalisedProps

const Challenge: FunctionComponent<Props> = ({ challenge, translate }) => {
  if (challenge.type === 'recite') {
    return (
      <ChallengeContainer
        title={translate('video_capture.header.challenge_digit_instructions')}
        renderInstructions={() => (
          <span className={style.recite}>
            {challenge.query.join(' \u2013 ')}
          </span>
        )}
      />
    )
  }

  if (challenge.type === 'movement') {
    const side = challenge.query.replace('turn', '').toLowerCase()

    return (
      <ChallengeContainer
        title={translate('video_capture.header.challenge_turn_template', {
          side: translate(`video_capture.header.challenge_turn_${side}`),
        })}
        renderInstructions={() => (
          <span
            className={classNames(
              style.movement,
              style[`movement-${challenge.query}`]
            )}
          />
        )}
        movementChallengeSubTitle={translate(
          'video_capture.header.challenge_turn_next_step'
        )}
      />
    )
  }

  return null
}

export default localised(Challenge)
