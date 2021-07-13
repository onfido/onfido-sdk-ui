import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'

import { useLocales } from '~locales'
import PageTitle from '../PageTitle'
import style from './style.scss'

import type { ChallengePayload } from '~types/api'

type ChallengeContainerProps = {
  title: string
  renderChallenge: () => h.JSX.Element
  nextMovementInstruction?: string
}

const ChallengeContainer: FunctionComponent<ChallengeContainerProps> = ({
  title,
  renderChallenge,
  nextMovementInstruction,
}) => (
  <div>
    <PageTitle title={title} className={style.challengeTitle} />
    <div className={style.challengeDescription}>{renderChallenge()}</div>
    {nextMovementInstruction && (
      <span className={style.challengeSubTitle}>{nextMovementInstruction}</span>
    )}
  </div>
)

type ChallengeProps = {
  challenge: ChallengePayload
}

const Challenge: FunctionComponent<ChallengeProps> = ({ challenge }) => {
  const { translate } = useLocales()

  if (challenge.type === 'recite') {
    return (
      <ChallengeContainer
        title={translate('video_capture.header.challenge_digit_instructions')}
        renderChallenge={() => (
          <span aria-level="2" className={style.recite}>
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
        title={translate(`video_capture.header.challenge_turn_${side}`)}
        renderChallenge={() => (
          <span
            aria-hidden="true"
            className={classNames(
              style.movement,
              style[`movement-${challenge.query}`]
            )}
          />
        )}
        nextMovementInstruction={translate(
          'video_capture.header.challenge_turn_forward'
        )}
      />
    )
  }

  return null
}

export default Challenge
