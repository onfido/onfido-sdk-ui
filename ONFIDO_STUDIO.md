# Onfido Studio

## Overview

Onfido Studio enables you to build an optimised route to verify each end user, by defining and configuring different paths, as well as incorporating a combination of signals, in a single identity verification flow.

## Getting started

Minimum supported version for Workflows: onfido-sdk-ui@9.0.0 and API v3.4

### Initialize the SDK for Studio

You can now initialize the SDK, using the SDK token and workflowRunId.

```javascript
Onfido.init({
  token: '<YOUR_SDK_TOKEN>',
  containerId: 'onfido-mount',
  containerEl: <div id="root" />, //ALTERNATIVE to `containerId`
  onComplete: function (data) {
    console.log('everything is complete')
  },
  workflowRunId: '<YOUR_WORKFLOW_RUN_ID>',
})
```

- `workflowRunId` {String} required
  An existing workflow id is required to extract the dynamic flow.

### Handling callbacks

```javascript
Onfido.init({
  token: '<YOUR_SDK_TOKEN>',
  containerId: 'onfido-mount',
  workflowRunId: '<WORKFLOW_RUN_ID>',
  onComplete: function (data) {
    console.log('everything is complete')
  },
  onUserExit: function (userExitCode) {
    console.log(userExitCode)
  },
  onError: function (error) {
    console.log(error)
  },
})
```

## Customizing the SDK

### UI Customisation

- **`customUI {Object} optional`**
  There’s no change in how to specify custom UI options.
  Please refer to the [SDK UI customization documentation](UI_CUSTOMIZATION.md) for details of the supported UI customization options that can be set in this property.

### Custom Localisation

There’s no change in how to specify a custom language. Please refer to the Web SDK [language localization documentation](README.md#customizing-the-sdk) for details.
