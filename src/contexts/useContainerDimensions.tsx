import { h, createContext, FunctionComponent, Component } from 'preact'
import { useContext, useEffect, useRef, useState } from 'preact/compat'

/**
 * This context aims to provide an accessible outer-most container dimensions,
 * to serve calculations like in DocumentOverlay
 */
const ContainerDimensionsContext = createContext<DOMRect | undefined>(undefined)

type Props = {
  overridenDimensions?: DOMRect
}

export const ContainerDimensionsProvider: FunctionComponent<Props> = ({
  children,
  overridenDimensions,
}) => {
  const [dimensions, setDimensions] = useState<DOMRect | undefined>(
    overridenDimensions
  )

  const containerRef = useRef<Component>()

  useEffect(() => {
    if (overridenDimensions) {
      return
    }

    const handleResize = () => {
      const wrappedElement = containerRef.current?.base

      if (wrappedElement && wrappedElement instanceof Element) {
        setDimensions(wrappedElement.getBoundingClientRect())
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [containerRef]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ContainerDimensionsContext.Provider ref={containerRef} value={dimensions}>
      {children}
    </ContainerDimensionsContext.Provider>
  )
}

export const useContainerDimensions = (): DOMRect => {
  const containerDimensions = useContext(ContainerDimensionsContext)

  if (!containerDimensions) {
    throw new Error(`Container wasn't rendered!`)
  }

  return containerDimensions
}
