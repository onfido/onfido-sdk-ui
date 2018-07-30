// @flow
import * as React from 'react'
import { h } from 'preact'
import classNames from 'classnames'
import style from './style.css'
import { functionalSwitch } from '../utils'

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
  value: any,
  type: 'repeatDigits' | 'moveHead',
};

type Props = ChallengeType & {
  i18n: Object,
};

const RepeatDigits = ({i18n, value: digits}: Props) => (
  <ChallengeContainer
    title={i18n.t('capture.liveness.challenges.repeat_digits')}
    renderInstructions={() =>
      <span className={style.digits}>{digits.join(' – ')}</span>
    }
  />
)

const MoveHead = ({i18n, value: side}: Props) => (
  <ChallengeContainer
    title={i18n.t('capture.liveness.challenges.move_head', {
      side: i18n.t(`capture.liveness.challenges.${ side }`),
    })}
    renderInstructions={() =>
      <span className={classNames(style.moveHead, style[`moveHead-${ side}`])} />
    }
  />
)

const Challenge = (props: Props) => functionalSwitch(props.type, {
  repeatDigits: () => <RepeatDigits {...props} />,
  moveHead: () => <MoveHead {...props} />,
})

export default Challenge

