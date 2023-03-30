# Onfido Studio

## Overview

[Onfido Studio](https://developers.onfido.com/guide/onfido-studio-product) is a drag and drop interface enabling you to build an optimised route to verify each end user, by defining and configuring different paths, as well as incorporating a combination of signals, in a single identity verification flow.

## Getting started

Minimum supported version for Workflows: [onfido-sdk-ui@9.0.0](https://github.com/onfido/onfido-sdk-ui/releases/tag/9.0.0) and API `v3.4`

The SDK communicates directly and dynamically with active workflows to show the relevant screens to ensure the correct capture and upload of user information. As a result, the SDK flow will vary depending on the workflow configuration. You won't need to specify any steps directly in the SDK integration as these will be overridden when the workflow run ID is passed into the SDK initialisation.

SDK tokens are required to authenticate the SDKs for workflows. You can generate SDK tokens using the [Onfido API](<(https://documentation.onfido.com/#generate-sdk-token)>).

### 1. Workflow run

You must create a [workflow run](https://documentation.onfido.com/#create-workflow-run) before you initialise the SDK, including the `workflow_id` and `applicant_id` in the request body.

```shell
$ curl -X POST https://api.onfido.com/v3.4/workflow_runs/ \
  -H 'Authorization: Token token=<YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{
    "applicant_id": "<APPLICANT_ID>",
    "workflow_id": "<WORKFLOW_ID>"
  }'
```

The [response](https://documentation.onfido.com/#workflow-run-object) will contain a `workflow_run_id`.

### 2. Import the library

You can either:

- import directly into your HTML page
- use npm (valid from version 9+)

#### 2.1 HTML Script Tag Include

You can include the library as a regular script tag on your page:

```html
<script src="dist/onfido.min.js"></script>
```

And the CSS styles:

```html
<link rel="stylesheet" href="dist/style.css" />
```

You can see a simple example using script tags [here](https://jsfiddle.net/gh/get/library/pure/onfido/onfido-sdk-ui/tree/master/demo/fiddle/).

#### 2.2 NPM style import

You can import the library as a module into your own JS build system (tested with Webpack):

```shell
$ npm install --save onfido-sdk-ui
```

```javascript
// ES6 module import
import { init } from 'onfido-sdk-ui'

// commonjs style require
var Onfido = require('onfido-sdk-ui')
```

The CSS style will be included inline with the JS code when the library is imported.

⚠️ Note: The library is **Browser only**, it does not support the **Node Context**.

You can see an example app using npm style import [in our sample app](https://github.com/onfido/onfido-sdk-web-sample-app/).

### 3. Add basic HTML markup

Add an empty HTML element at the bottom of your page for the modal interface to mount itself on.

```html
<div id="onfido-mount"></div>
```

### 4. Initialize the SDK for Studio

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
  The ID of the workflow run. An existing workflow id is required to extract the dynamic flow.

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

| Function       | Description                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **onComplete** | `{Function} optional` <br /> Callback that fires when all interactive tasks in the workflow have been completed. On success, if you have configured [webhooks](https://documentation.onfido.com/#webhooks), a notification will be sent to your backend confirming the workflow run has finished. You do not need to create a check using your backend as this is handled directly by the Workflow. |
| **onError**    | `{Function} optional` <br /> Callback that fires when an error occurs.                                                                                                                                                                                                                                                                                                                              |
| **onUserExit** | `{Function} optional` <br /> Callback that fires when the user abandons the flow without completing it.                                                                                                                                                                                                                                                                                             |

## Customizing the SDK

### UI Customisation

- **`customUI {Object} optional`**
  There’s no change in how to specify custom UI options.
  Please refer to the [SDK UI customization documentation](UI_CUSTOMIZATION.md) for details of the supported UI customization options that can be set in this property.

### Custom Localisation

There’s no change in how to specify a custom language. Please refer to the Web SDK [language localization documentation](README.md#customizing-the-sdk) for details.
