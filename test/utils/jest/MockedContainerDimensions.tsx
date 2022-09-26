import { h, FunctionComponent } from 'preact'
import { ContainerDimensionsProvider } from '~contexts/useContainerDimensions'

type Props = {
  width?: number
  height?: number
}

const MockedContainerDimensions: FunctionComponent<Props> = ({
  children,
  height = 1,
  width = 1,
}) => (
  <ContainerDimensionsProvider
    overridenDimensions={{
      width,
      height,
      x: 0,
      y: 0,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      toJSON: jest.fn().mockReturnValue(''),
    }}
  >
    {children}
  </ContainerDimensionsProvider>
)

export default MockedContainerDimensions
