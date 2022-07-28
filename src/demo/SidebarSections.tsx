import { h, FunctionComponent } from 'preact'
import { useCallback, useRef } from 'preact/compat'

import detectSystem from '~utils/detectSystem'
import type { SdkOptions } from '~types/sdk'

import {
  CheckData,
  UIConfigs,
  commonLanguages,
  commonRegions,
  commonSteps,
  commonVisibleCrossDeviceLinkOptions,
} from './demoUtils'

import { UICustomizationOptions } from '~types/ui-customisation-options'
import customUIConfig from './custom-ui-config.json'

export const SdkOptionsView: FunctionComponent<{
  sdkOptions: SdkOptions
  resetSdkOptions: () => void
  updateSdkOptions: (newOptions: Partial<SdkOptions>) => void
}> = ({ sdkOptions, resetSdkOptions, updateSdkOptions }) => (
  <div>
    <h1>SDK Options</h1>
    <div className="label">
      <button onClick={resetSdkOptions}>Reset persisted options</button>
    </div>
    <label>
      <input
        type="checkbox"
        checked={sdkOptions.useModal}
        onChange={(e) =>
          updateSdkOptions({ useModal: (e.target as HTMLInputElement).checked })
        }
      />
      &nbsp;Display SDK as Modal
    </label>
    <label>
      <input
        type="checkbox"
        checked={!!sdkOptions.customUI}
        onChange={(e) =>
          updateSdkOptions({
            customUI: (e.target as HTMLInputElement).checked
              ? (customUIConfig as UICustomizationOptions)
              : undefined,
          })
        }
      />
      &nbsp;Use customised SDK UI
    </label>
    <div className="label">
      Region
      <div>
        {commonRegions.map((region) => (
          <input
            type="button"
            key={region}
            value={region}
            onClick={() => updateSdkOptions({ region })}
          />
        ))}
      </div>
    </div>
    <div className="label">
      language
      <div>
        {Object.keys(commonLanguages).map((key) => (
          <input
            type="button"
            key={key}
            value={key}
            onClick={() =>
              updateSdkOptions({
                language: commonLanguages[key],
              })
            }
          />
        ))}
      </div>
    </div>
    <label>
      smsNumberCountryCode
      <div>
        <input
          type="text"
          value={sdkOptions.smsNumberCountryCode || ''}
          onChange={(e) =>
            updateSdkOptions({
              smsNumberCountryCode: (e.target as HTMLInputElement).value,
            })
          }
        />
      </div>
    </label>
    <label>
      userDetails.smsNumber
      <div>
        <input
          type="text"
          value={
            (sdkOptions.userDetails && sdkOptions.userDetails.smsNumber) || ''
          }
          onChange={(e) =>
            updateSdkOptions({
              userDetails: {
                ...sdkOptions.userDetails,
                smsNumber: (e.target as HTMLInputElement).value,
              },
            })
          }
        />
      </div>
    </label>
    <label>
      _crossDeviceLinkMethods
      <div>
        {Object.keys(commonVisibleCrossDeviceLinkOptions).map((key) => (
          <input
            type="button"
            key={key}
            value={key}
            onClick={() =>
              updateSdkOptions({
                _crossDeviceLinkMethods:
                  commonVisibleCrossDeviceLinkOptions[key],
              })
            }
          />
        ))}
      </div>
    </label>
    <label>
      crossDeviceClientIntroProductName
      <div>
        <input
          type="text"
          value={sdkOptions.crossDeviceClientIntroProductName || ''}
          onChange={(e) =>
            updateSdkOptions({
              crossDeviceClientIntroProductName: (e.target as HTMLInputElement)
                .value,
            })
          }
        />
      </div>
    </label>
    <label>
      crossDeviceClientIntroProductLogoSrc (image URL)
      <div>
        <input
          type="text"
          value={sdkOptions.crossDeviceClientIntroProductLogoSrc || ''}
          onChange={(e) =>
            updateSdkOptions({
              crossDeviceClientIntroProductLogoSrc: (e.target as HTMLInputElement)
                .value,
            })
          }
        />
      </div>
    </label>
    <div className="label">
      steps
      <div>
        {Object.keys(commonSteps).map((key) => (
          <input
            type="button"
            key={key}
            value={key}
            title={JSON.stringify(commonSteps[key], null, 2)}
            onClick={() =>
              updateSdkOptions({
                steps: commonSteps[key],
              })
            }
          />
        ))}
      </div>
    </div>
    <div className="label">
      <input
        type="checkbox"
        checked={
          !!sdkOptions.overrideSdkConfiguration?.experimental_features
            ?.motion_experiment?.enabled
        }
        title="motion_experiment"
        onChange={(e) =>
          updateSdkOptions({
            overrideSdkConfiguration: {
              ...sdkOptions.overrideSdkConfiguration,
              experimental_features: {
                ...sdkOptions.overrideSdkConfiguration?.experimental_features,
                motion_experiment: {
                  enabled: (e.target as HTMLInputElement).checked,
                },
              },
            },
          })
        }
      />
      &nbsp;Motion Experiment
    </div>
  </div>
)

export const ViewOptionsComponent: FunctionComponent<{
  viewOptions: UIConfigs
  updateViewOptions: (newOptions: Partial<UIConfigs>) => void
}> = ({ viewOptions, updateViewOptions }) => (
  <div>
    <h1>Page options</h1>
    <label>
      <input
        type="checkbox"
        checked={viewOptions.darkBackground}
        onChange={(e) =>
          updateViewOptions({
            darkBackground: (e.target as HTMLInputElement).checked,
          })
        }
      />
      Dark Background
    </label>

    <div className="label">
      SDK Mounted status
      <div>
        <input
          type="button"
          value={viewOptions.tearDown ? 'Re-mount' : 'Tear down'}
          onClick={() => updateViewOptions({ tearDown: !viewOptions.tearDown })}
        />
      </div>
    </div>
  </div>
)

const CheckDataItem: FunctionComponent<{ value?: string }> = ({ value }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const copyText = useCallback((e: MouseEvent) => {
    e.preventDefault()
    inputRef.current?.select()
    document.execCommand('copy')
  }, [])

  if (!value) return <i>unknown</i>

  return (
    <span>
      <input type="text" value={value} readOnly ref={inputRef} />
      <input type="button" onClick={copyText} value="Copy" />
    </span>
  )
}

export const CheckDataView: FunctionComponent<{
  checkData: CheckData
  sdkFlowCompleted: boolean
}> = ({ checkData, sdkFlowCompleted }) => (
  <div>
    <h1>Check Data</h1>
    <div className="label">
      SDK Completion: {sdkFlowCompleted ? <b>Complete</b> : <i>In progress</i>}
    </div>
    <div className="label">
      Applicant ID: <CheckDataItem value={checkData.applicantId} />
    </div>
  </div>
)

export const SystemInfo: FunctionComponent = () => {
  const osInfo = detectSystem('os')
  const browserInfo = detectSystem('browser')

  return (
    <div>
      <h1>System info</h1>
      <pre className="systemInfo">
        OS: <strong>{osInfo.name}</strong>
      </pre>
      <pre className="systemInfo">
        OS version: <strong>{osInfo.version}</strong>
      </pre>
      <pre className="systemInfo">
        Browser: <strong>{browserInfo.name}</strong>
      </pre>
      <pre className="systemInfo">
        Browser version: <strong>{browserInfo.version}</strong>
      </pre>
    </div>
  )
}
