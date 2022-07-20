import { h, FunctionComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { Footer } from '../Footer'
import { Header } from '../Header'
import { Wrapper } from '../Wrapper'
import { BaseScreen } from '../BaseScreen'
import { LoaderIcon } from '../assets/LoaderIcon'
import { localised } from '~locales'
import { connect } from 'react-redux'
import { RootState } from '~types/redux'
import { buildCaptureStateKey } from '~utils/redux'

interface Props {
  videoPayload?: Blob
  nextStep: () => void
}

const mapStateToProps = ({ captures }: RootState, props: Props): Props => ({
  ...props,
  videoPayload: captures[buildCaptureStateKey({ method: 'activeVideo' })]?.blob,
})

const Uploading: FunctionComponent<Props> = ({ nextStep, videoPayload }) => {
  const [uploadProgress, setUploadProgress] = useState(0)

  console.log(videoPayload)

  let interval: NodeJS.Timeout

  /**
   * This method is only intended to mimic the real upload.
   */
  useEffect(() => {
    interval = setInterval(() => {
      setUploadProgress((value) => {
        if (value < 100) {
          return value + 1
        } else {
          nextStep()
          clearInterval(interval)
        }

        return value
      })

      return () => {
        clearInterval(interval)
      }
    }, 20)
  }, [])

  /**
   * Get the formatted upload progress
   * @returns The formatted upload progress.
   */
  const formattedUploadProgress = () => `${uploadProgress}%`

  return (
    <BaseScreen>
      <Wrapper>
        <Header title="Uploading" subtitle={formattedUploadProgress()}>
          <LoaderIcon />
        </Header>
      </Wrapper>

      <Footer />
    </BaseScreen>
  )
}

export default connect(mapStateToProps)(
  // @ts-ignore: Preact Provider compatibility
  localised(Uploading)
)
