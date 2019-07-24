// @flow
import * as React from 'react'
import { h } from 'preact'
import PageTitle from '../PageTitle'
import classNames from 'classnames'
import style from './style.css'
import { functionalSwitch } from '~utils'
import { localised } from '../../locales'
import type { LocalisedType } from '../../locales'

type ChallengeContainerProps = {
  title: string,
  renderInstructions: void => React.Element<*>,
}

const ChallengeContainer = ({title, renderInstructions}: ChallengeContainerProps) => (
  <div>
    <PageTitle title={title} className={style.challengeTitle} />
    <div aria-level="2" className={style.challengeDescription}>{renderInstructions()}</div>
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

type Props = LocalisedType & ChallengeType;

const Recite = localised(({translate, query: digits}: Props) => (
  <ChallengeContainer
    title={translate('capture.liveness.challenges.recite')}
    renderInstructions={() =>
      <span className={style.recite}>{digits.join(" \u2013 ")}</span>
    }
  />
))

const Movement = localised(({translate, query = ''}: Props) => {
  const side = query.replace('turn', '').toLowerCase()
  return (
    <ChallengeContainer
      title={translate('capture.liveness.challenges.movement', {
        side: translate(`capture.liveness.challenges.${side}`),
      })}
      renderInstructions={() =>
        <span className={classNames(style.movement, style[`movement-${query}`])} />
      }
    />
  )
})

const Challenge = (props: ChallengeType) => functionalSwitch(props.type, {
  recite: () => <Recite {...props} />,
  movement: () => <Movement {...props} />,
})

export default Challenge

