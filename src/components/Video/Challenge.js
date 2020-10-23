// @flow
import * as React from 'react'
import { h } from 'preact'
import PageTitle from '../PageTitle'
import classNames from 'classnames'
import style from './style.scss'
import { functionalSwitch } from '~utils'
import { localised, type LocalisedType } from '../../locales'

type ChallengeContainerProps = {
  title: string,
  renderInstructions: (void) => React.Element<*>,
}

const ChallengeContainer = ({
  title,
  renderInstructions,
}: ChallengeContainerProps) => (
  <div>
    <PageTitle title={title} className={style.challengeTitle} />
    <div aria-level="2" className={style.challengeDescription}>
      {renderInstructions()}
    </div>
  </div>
)

export type ChallengeType = {
  query: any,
  type: 'recite' | 'movement',
}

export type ChallengeResultType = {
  id: string,
  challenges: Array<ChallengeType>,
  switchSeconds?: number,
}

type Props = LocalisedType & ChallengeType

const Recite = localised(({ translate, query: digits }: Props) => (
  <ChallengeContainer
    title={translate('video_capture.header.challenge_digit_instructions')}
    renderInstructions={() => (
      <span className={style.recite}>{digits.join(' \u2013 ')}</span>
    )}
  />
))

const Movement = localised(({ translate, query = '' }: Props) => {
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
})

const Challenge = (props: ChallengeType) => {
  const ReciteSwitch = () => <Recite {...props} />
  const MovementSwitch = () => <Movement {...props} />

  return functionalSwitch(props.type, {
    recite: ReciteSwitch,
    movement: MovementSwitch,
  })
}

export default Challenge
