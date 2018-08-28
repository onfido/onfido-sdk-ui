// @flow
import * as React from 'react'
import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import { functionalSwitch } from '../utils'
import { localised } from '../../locales'

type ChallengeContainerProps = {
  title: string,
  renderInstructions: void => React.Element<*>,
};

const ChallengeContainer = ({title, renderInstructions}: ChallengeContainerProps) => (
  <div className={style.challenge}>
    <div className={style.challengeTitle}>{title}</div>
    <div className={style.challengeDescription}>{renderInstructions()}</div>
  </div>
)

export type ChallengeType = {
  query: any,
  type: 'recite' | 'movement',
};

type Props = ChallengeType;

const Recite = localised(({t, query: digits}: Props) => (
  <ChallengeContainer
    title={t('capture.liveness.challenges.recite')}
    renderInstructions={() =>
      <span className={style.recite}>{digits.join(' – ')}</span>
    }
  />
))

const Movement = localised(({t, query = ''}: Props) => {
  const side = query.replace('turn', '').toLowerCase()
  return (
    <ChallengeContainer
      title={t('capture.liveness.challenges.movement', {
        side: t(`capture.liveness.challenges.${side}`),
      })}
      renderInstructions={() =>
        <span className={classNames(style.movement, style[`movement-${query}`])} />
      }
    />
  )
})

const Challenge = (props: Props) => functionalSwitch(props.type, {
  recite: () => <Recite {...props} />,
  movement: () => <Movement {...props} />,
})

export default Challenge

