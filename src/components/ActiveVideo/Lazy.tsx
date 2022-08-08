import { h } from 'preact'
import { localised } from '~locales'
import { asyncComponent } from '~utils/components'
import Spinner from 'components/Spinner'

import type { RenderFallbackProp, StepComponentProps } from '~types/routers'
import FallbackButton from 'components/Button/FallbackButton'

const ActiveVideo = asyncComponent(
  () => import(/* webpackChunkName: "activeVideo" */ './ActiveVideo'),
  Spinner
)

const LazyActiveVideo = (props: StepComponentProps) => {
  const { changeFlowTo } = props
  const renderCrossDeviceFallback: RenderFallbackProp = ({ text }) => {
    return (
      <FallbackButton
        text={text}
        onClick={() => changeFlowTo('crossDeviceSteps')}
      />
    )
  }

  return (
    <ActiveVideo
      renderCrossDeviceFallback={renderCrossDeviceFallback}
      {...props}
    />
  )
}

export default localised(LazyActiveVideo)
