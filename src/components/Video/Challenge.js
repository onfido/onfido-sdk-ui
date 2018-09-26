// @flow
import * as React from 'react'
import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import { functionalSwitch } from '../utils'

type ChallengeContainerProps = {
  title: string,
  renderInstructions: void => React.Element<*>,
}

const ChallengeContainer = ({title, renderInstructions}: ChallengeContainerProps) => (
  <div className={style.challenge}>
    <div className={style.challengeTitle}>{title}</div>
    <div className={style.challengeDescription}>{renderInstructions()}</div>
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

type Props = ChallengeType & {
  i18n: Object,
}

const Recite = ({i18n, query: digits}: Props) => (
  <ChallengeContainer
    title={i18n.t('capture.liveness.challenges.recite')}
    renderInstructions={() =>
      <span className={style.recite}>{digits.join(" \u2013 ")}</span>
    }
  />
)

const Movement = ({i18n, query = ''}: Props) => {
  const side = query.replace('turn', '').toLowerCase()
  return (
    <ChallengeContainer
      title={i18n.t('capture.liveness.challenges.movement', {
        side: i18n.t(`capture.liveness.challenges.${side}`),
      })}
      renderInstructions={() =>
        <span className={classNames(style.movement, style[`movement-${query}`])} />
      }
    />
  )
}

const Challenge = (props: Props) => functionalSwitch(props.type, {
  recite: () => <Recite {...props} />,
  movement: () => <Movement {...props} />,
})

export default Challenge

