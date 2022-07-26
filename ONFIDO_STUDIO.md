# Onfido Studio

## Overview

Onfido Studio enables you to build an optimised route to verify each end user, by defining and configuring different paths, as well as incorporating a combination of signals, in a single identity verification flow.

## Getting started

Minimum supported version for Workflows: [onfido-sdk-ui@9.0.0](https://github.com/onfido/onfido-sdk-ui/releases/tag/9.0.0) and API [v3.4]()

### 1. Obtain an API token

In order to start integrating, you'll need an [API token](https://documentation.onfido.com/#api-tokens).

You can use our [sandbox](https://documentation.onfido.com/#sandbox-testing) environment to test your integration. To use the sandbox, you'll need to generate a sandbox API token in your [Onfido Dashboard](https://onfido.com/dashboard/api/tokens).

⚠️ **Note: You must never use API tokens in the frontend of your application or malicious users could discover them in your source code. You should only use them on your server.**

#### 1.1 Regions

Onfido offers region-specific environments. Refer to the [Regions](https://documentation.onfido.com/#regions) section in the API documentation for token format and API base URL information.

### 2. Create an applicant

To create an applicant from your backend server, make request to the ['create applicant' endpoint](https://documentation.onfido.com/#create-applicant), using a valid API token.

⚠️ Note: Different report types have different minimum requirements for applicant data. For a Document or Facial Similarity report, the minimum applicant details required are `first_name` and `last_name`.

```shell
$ curl https://api.onfido.com/v4/applicants \
  -H 'Authorization: Token token=<YOUR_API_TOKEN>' \
  -d 'first_name=John' \
  -d 'last_name=Smith'
```

The JSON response will contain an `id` field containing an UUID that identifies the applicant. Once you pass the applicant ID to the SDK, documents and live photos and videos uploaded by that instance of the SDK will be associated with that applicant.

### 2. WorkflowRun

Requesting a workflow run is a new, additional step required for a Workflows integration. Workflow runs fully replace Checks.

Important: You must now request a workflow run before you initialise the SDK

POST /v4/workflow_runs
Starts a workflow run. The request body must include the workflow_id and applicant_id. Authentication using API token. Returns a “workflow_run_id”.

```shell
$ curl -X POST https://api.onfido.com/v4/workflow_runs/ \
  -H 'Authorization: Token token=<YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{
    "applicant_id": "<APPLICANT_ID>",
    "workflow_id": "<WORKFLOW_ID>"
  }'
```

The workflow run will begin immediately, pausing on the first interactive task it reaches until you initialise the SDK for end user interaction.

### 4. Generate an SDK token

The SDK is authenticated using SDK tokens. Each authenticated instance of the SDK will correspond to a single Onfido applicant. You’ll need to generate and include a new token each time you initialize the Web SDK.

⚠️ Note: You must never use API tokens in the frontend of your application or malicious users could discover them in your source code. You should only use them on your server.

To generate an SDK token, make a request to the ['generate SDK token' endpoint](https://documentation.onfido.com/#generate-web-sdk-token), including the applicant ID and a valid referrer.

```shell
$ curl https://api.onfido.com/v3/sdk_token \
  -H 'Authorization: Token token=<YOUR_API_TOKEN>' \
  -F 'applicant_id=<APPLICANT_ID>' \
  -F 'referrer=<REFERRER_PATTERN>'
```

| Parameter      | Notes                                                            |
| -------------- | ---------------------------------------------------------------- |
| `applicant_id` | **required** <br /> Specifies the applicant for the SDK instance |
| `referrer`     | **required** <br /> The referrer URL pattern                     |

⚠️ Note: SDK tokens expire after 90 minutes.

#### 4.1 The referrer argument

The referrer argument specifies the URL of the web page where the Web SDK will be used. The referrer sent by the browser must match the referrer URL pattern in the SDK token for the SDK to successfully authenticate.

The referrer pattern guarantees that other malicious websites cannot reuse the SDK token in case it is lost. You can read more about referrer policy [in Mozilla's
documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy).

⚠️ Note: You must use a site referrer policy that lets the
`Referer` header be sent. If your policy does not allow this (e.g.
`Referrer-Policy: no-referrer`), then you'll receive a `401 bad_referrer`
error when trying to use the Web SDK.

Permitted referrer patterns are as follows:

| Section  | Format                                       | Example                       |
| -------- | -------------------------------------------- | ----------------------------- |
| Referrer | `scheme://host/path`                         | `https://*.<DOMAIN>/<PATH>/*` |
| Scheme   | `*` or `http` or `https`                     | `https`                       |
| Host     | `*` or `*.` then any char except `/` and `*` | `*.<DOMAIN>`                  |
| Path     | Any char or none                             | `<PATH>/*`                    |

An example of a valid referrer is `https://*.example.com/example_page/*`.

### 5. Import the library

You can either:

- import directly into your HTML page
- use npm

#### 5.1 HTML Script Tag Include

You can include the library as a regular script tag on your page:

```html
<script src="dist/onfido.min.js"></script>
```

⚠️ Note: The above import does **not** include the Auth module. To include it, use:

```html
<script src="dist/onfidoAuth.min.js"></script>
```

If you are importing the Auth module, you do not need to import the standard SDK module (`dist/onfido.min.js`) also.

⚠️ **The Authentication module is currently a BETA feature.**

And the CSS styles:

```html
<link rel="stylesheet" href="dist/style.css" />
```

You can see a [simple example using script tags](https://jsfiddle.net/gh/get/library/pure/onfido/onfido-sdk-ui/tree/master/demo/fiddle/).

#### 5.2 NPM style import

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

⚠️ Note: The above import does **not** include the Auth module. To include it, use:

```javascript
// ES6 module import
import { init } from 'onfido-sdk-ui/dist/onfidoAuth.min.js'

// commonjs style require
var Onfido = require('onfido-sdk-ui/dist/onfidoAuth.min.js')
```

In addition to the alternative way of importing Auth, you need to have an `auth-sdk/` folder in your public assets folder, and copy the contents of `node_modules/onfido-sdk-ui/dist/auth-sdk` into it.

If you are using Webpack on your application, you can automate this by adding:

```javascript
new CopyPlugin({
  patterns: [
    {
      from: `../../node_modules/onfido-sdk-ui/dist/auth-sdk`,
      to: `${__dirname}/bin/src/auth-sdk`,
    },
  ],
})
```

This will fetch the core authentication technology from the SDK into your application. Using web workers for authentication enables the best performance achievable, without compromising on usability.

The CSS style will be included inline with the JS code when the library is imported.

⚠️ Note: The library is **Browser only**, it does not support the **Node Context**.

You can see an [example app using npm style import](https://github.com/onfido/onfido-sdk-web-sample-app/).

### 6. Add basic HTML markup

Add an empty HTML element at the bottom of your page for the modal interface to mount itself on.

```html
<div id="onfido-mount"></div>
```

### 7. Initialize the SDK for Studio

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
