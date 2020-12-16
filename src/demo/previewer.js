import { h, render } from 'preact'
import { memo } from 'preact/compat'
import { useEffect, useRef, useState } from 'preact/hooks'
import { getInitSdkOptions } from './demoUtils'
import {
  SdkOptions,
  ViewOptions,
  CheckData,
  SystemInfo,
} from './SidebarSections'

const channel = new MessageChannel()
const port1 = channel.port1

if (process.env.NODE_ENV === 'development') {
  require('preact/devtools')
}

const SdkPreviewer = () => {
  const [viewOptions, setViewOptions] = useState({
    darkBackground: false,
    iframeWidth: '100%',
    iframeHeight: '100%',
    tearDown: false,
  })
  const [sdkOptions, setSdkOptions] = useState(getInitSdkOptions())
  const [sdkFlowCompleted, setSdkFlowCompleted] = useState(false)
  const [checkData, setCheckData] = useState({
    applicantId: null,
    sdkFlowCompleted: false,
  })

  const iframe = useRef(null)

  const updateViewOptions = (newOptions) =>
    setViewOptions((currentOptions) => ({ ...currentOptions, ...newOptions }))

  const updateSdkOptions = (newOptions) =>
    setSdkOptions((currentOptions) => ({
      ...currentOptions,
      ...newOptions,
    }))

  /**
   * This side effect should run once after the component mounted,
   * and should execute the clean-up function when the component unmounts.
   */
  useEffect(() => {
    let globalOnCompleteFunc = null

    const onMessage = (message) => {
      if (message.data.type === 'UPDATE_CHECK_DATA') {
        setCheckData({
          ...checkData,
          ...message.data.payload,
        })
        return
      }

      if (message.data.type === 'SDK_COMPLETE') {
        setSdkFlowCompleted(true)

        if (globalOnCompleteFunc) {
          globalOnCompleteFunc(message.data.data)
        }

        console.log('Complete with data!', message.data.data)
      }
    }

    const onIFrameLoad = () => {
      // Transfer port2 to the iframe
      iframe.current.contentWindow.postMessage('init', '*', [channel.port2])
    }

    window.updateOptions = ({ onComplete, ...sdkOptions }) => {
      if (!onComplete || typeof onComplete !== 'function') {
        console.warn('[Onfido SDK] onComplete is not a function!')
      } else {
        globalOnCompleteFunc = onComplete
      }

      updateSdkOptions(sdkOptions)
    }
    window.addEventListener('message', onMessage)
    port1.onmessage = onMessage

    const iframeRef = iframe.current
    if (iframeRef) {
      iframeRef.addEventListener('load', onIFrameLoad)
    }

    return () => {
      delete window.updateOptions
      delete globalOnCompleteFunc.current
      window.removeEventListener('message', onMessage)

      if (iframeRef) {
        iframeRef.removeEventListener('load', onIFrameLoad)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Re-render the demo app only if `sdkOptions` or `viewOptions` changed
   */
  useEffect(() => {
    port1.postMessage({
      type: 'RENDER',
      options: {
        checkData,
        sdkFlowCompleted,
        sdkOptions,
        viewOptions,
      },
    })
  }, [sdkOptions, viewOptions]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="previewer">
      <div
        className={`iframe-wrapper${viewOptions.darkBackground ? ' dark' : ''}`}
      >
        <iframe
          src={`/index.html${window.location.search}`}
          ref={iframe}
          style={{
            width: viewOptions.iframeWidth,
            height: viewOptions.iframeHeight,
          }}
        />
      </div>
      <div className="sidebar">
        <a href={`/`}>(view vanilla SDK demo page)</a>

        <SdkOptions
          sdkOptions={sdkOptions}
          updateSdkOptions={updateSdkOptions}
        />

        <ViewOptions
          viewOptions={viewOptions}
          updateViewOptions={updateViewOptions}
        />

        {!sdkOptions.mobileFlow && (
          // Check data is confusing in `mobileFlow`, as we don't have the
          // applicant ID etc. correctly, we only have the `link_id` to the
          // parent room where the data _is_ stored correctly
          <CheckData
            checkData={checkData}
            sdkFlowCompleted={sdkFlowCompleted}
          />
        )}

        <SystemInfo />
      </div>
    </div>
  )
}

const Previewer = memo(SdkPreviewer)

const rootNode = document.getElementById('previewer-app')
render(<Previewer />, rootNode)
