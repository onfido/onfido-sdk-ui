import { h } from 'preact'
import { localised } from '~locales'
import { asyncComponent } from '~utils/components'
import Spinner from 'components/Spinner'

import type { StepComponentProps } from '~types/routers'

const ActiveVideo = asyncComponent(
  () => import(/* webpackChunkName: "activeVideo" */ './ActiveVideo'),
  Spinner
)

const LazyActiveVideo = (props: StepComponentProps) => (
  <ActiveVideo {...props} />
)

export default localised(LazyActiveVideo)
