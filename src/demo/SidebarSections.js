import { h, Component } from 'preact'
import { commonLanguages, commonRegions, commonSteps } from './demoUtils'

export const SdkOptions = ({ sdkOptions, updateSdkOptions }) => (
  <div>
    <h1>SDK Options</h1>
    <label>
      <input
        type="checkbox"
        checked={sdkOptions.useModal}
        onChange={(e) => updateSdkOptions({ useModal: e.target.checked })}
      />
      useModal
    </label>

    <div class="label">
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

    <div class="label">
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
              smsNumberCountryCode: e.target.value,
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
                smsNumber: e.target.value,
              },
            })
          }
        />
      </div>
    </label>

    <div class="label">
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
  </div>
)

export const ViewOptions = ({ viewOptions, updateViewOptions }) => (
  <div>
    <h1>Page options</h1>
    <label>
      <input
        type="checkbox"
        checked={viewOptions.darkBackground}
        onChange={(e) =>
          updateViewOptions({ darkBackground: e.target.checked })
        }
      />
      Dark Background
    </label>

    <div class="label">
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

class CheckDataItem extends Component {
  copyText = (e) => {
    e.preventDefault()
    this.input.select()
    document.execCommand('copy')
  }

  render() {
    const { value } = this.props
    if (!value) return <i>unknown</i>

    return (
      <span>
        <input
          type="text"
          value={this.props.value}
          readOnly
          ref={(input) => (this.input = input)}
        />
        <input type="button" onClick={this.copyText} value="Copy" />
      </span>
    )
  }
}

export const CheckData = ({ checkData, sdkFlowCompleted }) => (
  <div>
    <h1>Check Data</h1>
    <div class="label">
      SDK Completion: {sdkFlowCompleted ? <b>Complete</b> : <i>In progress</i>}
    </div>
    <div class="label">
      Applicant ID: <CheckDataItem value={checkData.applicantId} />
    </div>
  </div>
)
