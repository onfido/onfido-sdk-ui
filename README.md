# Onfido SDK UI Layer

[![Build Status](https://travis-ci.org/onfido/onfido-sdk-ui.svg?branch=master)](https://travis-ci.org/onfido/onfido-sdk-ui)
[![npm version](https://img.shields.io/npm/v/onfido-sdk-ui)](https://www.npmjs.com/package/onfido-sdk-ui)

## Table of contents

- [Overview](#overview)
- [Getting started](#getting-started)
- [Handling callbacks](#handling-callbacks)
- [Removing the SDK](#removing-the-sdk)
- [Initialization options](#initialization-options)
- [Customizing the SDK](#customizing-the-sdk)
- [Creating checks](#creating-checks)
- [User Analytics](#user-analytics)
- [Premium Enterprise Features](#premium-enterprise-features)
- [Going live](#going-live)
- [Accessibility](#accessibility)
- [TypeScript](#typescript)
- [More information](#more-information)

## Overview

The Onfido Web SDK provides a set of components for JavaScript applications to capture identity documents and selfie photos, videos, and motion captures for the purpose of identity verification.

The SDK offers a number of benefits to help you create the best identity verification experience for your customers:

- Carefully designed UI to guide your customers through the entire capture process for photos, videos, or motion captures
- Modular design to help you seamlessly integrate the capture process for photos, videos, or motion captures into your application flow
- Advanced image quality detection technology to ensure the quality of the captured images meets the requirement of the Onfido identity verification process, guaranteeing the best success rate
- Direct image upload to the Onfido service, to simplify integration

⚠️ Note: the SDK is only responsible for capturing photos, videos, and motion captures. You still need to access the [Onfido API](https://documentation.onfido.com/) to manage applicants and perform checks.

![Various views from the SDK](demo/screenshots.jpg)

## Getting started

The following content assumes you're using our API v3 versions for backend calls. If you are currently using API `v2` please refer to [this migration guide](https://developers.onfido.com/guide/api-v2-to-v3-migration-guide) for more information.

<Callout type="info">

> ℹ️ If you are integrating using Onfido Studio please see out [Studio integration guide](ONFIDO_STUDIO.md).

</Callout>

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
$ curl https://api.onfido.com/v3/applicants \
  -H 'Authorization: Token token=<YOUR_API_TOKEN>' \
  -d 'first_name=John' \
  -d 'last_name=Smith'
```

The JSON response will contain an `id` field containing an UUID that identifies the applicant. Once you pass the applicant ID to the SDK, documents, photos, videos, and motion captures uploaded by that instance of the SDK will be associated with that applicant.

### 3. Generate an SDK token

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

#### 3.1 The referrer argument

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

### 4. Import the library

You can either:

- import directly into your HTML page
- use npm
- use our CDN

#### 4.1 HTML Script Tag Include

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

#### 4.2 NPM style import

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

#### 4.3 CDN

Alternatively, you can use hosted versions of files above from our CDN such as:

```html
<!-- Replace "<version>" with the actual version you want to use, example: 9.0.0 -->
<script src="https://assets.onfido.com/web-sdk-releases/<version>/onfido.min.js"></script>
<script src="https://assets.onfido.com/web-sdk-releases/<version>/onfidoAuth.min.js"></script>
```

### 5. Add basic HTML markup

Add an empty HTML element at the bottom of your page for the modal interface to mount itself on.

```html
<div id="onfido-mount"></div>
```

### 6. Initialize the SDK

You can now initialize the SDK, using the SDK token.

```javascript
Onfido.init({
  token: '<YOUR_SDK_TOKEN>',
  containerId: 'onfido-mount',
  containerEl: <div id="root" />, //ALTERNATIVE to `containerId`
  onComplete: function (data) {
    console.log('everything is complete')
  },
  steps: ['welcome', 'poa', 'document', 'face', 'complete'],
})
```

| Parameter     | Format           | Notes                                                                                                                                                                                                                                                                                                                                            |
| ------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `token`       | string           | **required** <br />Your Web SDK token                                                                                                                                                                                                                                                                                                            |
| `containerId` | string           | **optional** <br />A string containing the ID of the container element that the UI will mount to. This must be an empty element. The default is `onfido-mount`. <br /> Alternatively, if your integration requires it, you can pass in the container element instead. Note that if `containerEl` is provided, then `containerId` will be ignored |
| `onComplete`  | function         | **optional** A [callback function](#handling-callbacks) that executes after the applicant's document and face have both been captured and uploaded successfully                                                                                                                                                                                  |
| `steps`       | string or object | List of different steps corresponding to parts of the process the user will be presented with                                                                                                                                                                                                                                                    |

## Handling callbacks

### `onComplete {Function} optional`

Callback that fires when both the document and face have been successfully captured and uploaded. You can then trigger your backend to [create a check](https://documentation.onfido.com/#create-check), using the associated applicant ID.

Example `onComplete` callback:

```javascript
Onfido.init({
  token: '<YOUR_SDK_TOKEN>',
  containerId: 'onfido-mount',
  onComplete: function (data) {
    console.log('everything is complete')
  },
})
```

`data` is an object that contains properties of the document and face images captured during the SDK flow.

For two-sided documents like `driving_licence` and `national_identity_card`, the object will also contain a `document_back` property representing the reverse side.

For the face step an object is returned with the `variant` used for the face capture,`'standard' | 'video' | 'motion'`. This informs whether to specify a `facial_similarity_photo`, `facial_similarity_video`, or `facial_similarity_motion` report during check creation.

```javascript
    {
       "document_front": {
         "id": "<DOCUMENT_ID_FRONT>",
         "type": "passport",
         "side": "front"
       },
       "face": {
         "id": "<FACE_ID>",
         "variant": "standard"
       },
       "document_back": {
         "id": "<DOCUMENT_ID_BACK>",
         "type": "driving_licence",
         "side": "back"
       },
       "poa": {
         "id": "<POA_DOCUMENT_ID>"
         "type": "utility_bill"
       }
    }
```

For the Auth step a data object is returned with parameters `success`, `token`, `type`, and `uuid`. The `success` variable informs whether or not the user was authenticated successfuly, whereas `token` is a JWT that can be used to validate the user authentication.

**Example of an auth `onComplete` data callback:**

```javascript
    {
      "success": true,
      "token": "eyJhbGciOiJSUz...",
      "type": "complete",
      "uuid": "b3b9142d-3071-401d-821b-17ab134d4798"
    }
```

### `onError {Function} optional`

Callback that fires when an error occurs. The callback returns the following error types:

- `exception`
  This will be returned for the following errors:

  - timeout and server errors
  - authorization
  - invalid token
  - missing data in `onComplete` callback
  - [Auth] exception handling API response

  This data can be used for debugging purposes.

```javascript
{
  type: "exception",
  message: "The request could not be understood by the server, please check your request is correctly formatted"
}
```

- `expired_token`
  This error will be returned when a token has expired. This error type can be used to provide a new token at runtime.

```javascript
{
  type: "expired_token",
  message: "The token has expired, please request a new one"
}
```

### `onUserExit {Function} optional`

Callback that fires when the user abandons the flow without completing it.

The callback returns a string with the reason for leaving. For example, `'USER_CONSENT_DENIED'` is returned when a user exits the flow because they declined the consent prompt.

```javascript
Onfido.init({
  token: '<YOUR_SDK_TOKEN>',
  containerId: 'onfido-mount',
  onUserExit: function (userExitCode) {
    console.log(userExitCode)
  },
})
```

### `onModalRequestClose {Function} optional`

Callback that fires when the user attempts to close the modal.

You can then decide to close the modal or keep it open by changing the property `isModalOpen`.

## Removing the SDK

If you have embedded the SDK inside a single page app, you can call the `tearDown` function to remove the SDK completely from the current webpage. It will reset the state and you can safely re-initialize the SDK inside the same webpage later on.

```javascript
onfidoOut = Onfido.init({...})
...
onfidoOut.tearDown()
```

## Initialization options

- **`token {String} required`**

  A JWT is required in order to authorize with our WebSocket endpoint. If one isn’t present, an exception will be thrown.

- **`useModal {Boolean} optional`**

  Turns the SDK into a modal, which fades the background and puts the SDK into a contained box. The default value is `false`.

  ```javascript
  <script>
      var onfido = {}

      function triggerOnfido() {
        onfido = Onfido.init({
          useModal: true,
          isModalOpen: true,
          onModalRequestClose: function() {
            // Update options with the state of the modal
            onfido.setOptions({isModalOpen: false})
          },
          token: '<YOUR_SDK_TOKEN>',
          onComplete: function(data) {
            // callback for when everything is complete
            console.log("everything is complete")
          }
        });
      };
  </script>

  <body>
    <!-- Use a button to trigger the Onfido SDK  -->
    <button onClick="triggerOnfido()">Verify identity</button>
    <div id='onfido-mount'></div>
  </body>
  ```

- **`isModalOpen {Boolean} optional`**

  Defines whether the modal is open or closed, if `useModal` is set to `true`. The default value is `false`.

  To change the state of the modal after calling `init()` you need to use `setOptions()`.

- **`shouldCloseOnOverlayClick {Boolean} optional`**

  If `useModal` is set to `true`, by default the user can close the SDK by clicking on the close button or on the background overlay. You can disable the user's ability to close the SDK by clicking the background overlay through setting `shouldCloseOnOverlayClick` to `false`. The default value is `true`.

- **`autoFocusOnInitialScreenTitle {Boolean} optional`**

  Sets the SDK to auto focus on the initial screen's title. By default the SDK will auto focus on every screen's title. When disabled, auto focus will not be applied for the initial screen's title. The SDK will still auto focus to all subsequent screens' titles as the user goes through the steps. The default value is `true`.

- **`containerId {String} optional`**

  A string of the ID of the container element that the UI will mount to. This needs to be an empty element. The default ID is `onfido-mount`. If your integration needs to pass the container element itself, use `containerEl` as described next.

- **`containerEl {Element} optional`**

  The container element that the UI will mount to. This needs to be an empty element. This can be used as an alternative to passing in the container ID string previously described for `containerId`. Note that if `containerEl` is provided, then `containerId` will be ignored.

- **`smsNumberCountryCode {String} optional`**

  You can change the default country for the SMS number input by passing the `smsNumberCountryCode` option when the SDK is initialized. The value should be a string containing a 2-character ISO Country code. If empty, the SMS number country code will default to `GB`.

  ```javascript
  smsNumberCountryCode: 'US'
  ```

- **`userDetails {Object} optional`**

  The following user details can be specified ahead of time, so that the user doesn't need to provide the information themselves:

  - `smsNumber` (optional) : The user's mobile number, which can be used for sending SMS messages to the user, for example, when a user requests to use their mobile devices to take photos. The value should be a string containing the mobile number with a country code.

  ```javascript
  userDetails: {
    smsNumber: '+447500123456'
  }
  ```

- **`steps {List} optional`**

  The list of different steps to be shown in the SDK flow and their custom options. Each step can either be specified as a string (when no customization is required) or an object (when customization is required).

  ```javascript
  steps: [
    {
      type: 'welcome',
      options: {
        title: 'Open your new bank account',
      },
    },
    'document',
    'face',
  ]
  ```

  See [flow customization](#flow-customization) for details of the custom options for each step.

## Customizing the SDK

The Web SDK has multiple customizable features that provide flexibility, while also being easy to integrate. You can also read our [SDK customization guide](https://developers.onfido.com/guide/sdk-customization).

### UI customization

- **`customUI {Object} optional`**

  Please refer to the [SDK UI customization documentation](UI_CUSTOMIZATION.md) for details of the supported UI customization options that can be set in this property.

### Language Localization

- **`language {String || Object} optional`**

  You can customize the language displayed on the SDK by passing a string or object. If `language` is not present the default copy will be in English.

  #### Supported languages

  The SDK supports and maintains the following languages. These can be implemented directly inside the SDK by passing the `language` option as a string containing the supported language tag.

  | Language          | Locale Tag |
  | ----------------- | ---------- |
  | English (default) | `en_US`    |
  | German            | `de_DE`    |
  | Spanish           | `es_ES`    |
  | French            | `fr_FR`    |
  | Italian           | `it_IT`    |
  | Portuguese        | `pt_PT`    |
  | Dutch             | `nl_NL`    |
  | Czech             | `cs_CZ`    |
  | Polish            | `pl_PL`    |
  | Romanian          | `ro_RO`    |

  Example:

  ```javascript
  language: 'es_ES' | 'es'
  ```

  #### Custom languages

  The SDK can also be displayed in a custom language for locales that Onfido does not currently support. To implement this, pass an object containing the following keys:

  | Key             | Description                                                                                | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
  | --------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `locale`        | **required** <br /> A locale tag.                                                          | This is required when providing phrases for an unsupported language. You can also use this to partially customize the strings of a supported language (e.g. Spanish), by passing a supported language locale tag (e.g. `es_ES`). For missing keys, the values will be displayed in the language specified within the locale tag if supported, otherwise they will be displayed in English. The locale tag is also used to override the language of the SMS body for the cross device feature. This feature is owned by Onfido and is currently only supports English, Spanish, French and German. |
  | `phrases`       | **required** <br /> An object containing the keys you want to override and the new values. | The keys can be found in [`src/locales/en_US/en_US.json`](src/locales/en_US/en_US.json). They can be passed as a nested object or as a string using the dot notation for nested values. See the examples below.                                                                                                                                                                                                                                                                                                                                                                                   |
  | `mobilePhrases` | **optional** <br /> An object containing the keys you want to override and the new values. | The values specified within this object are only visible on mobile devices. Please refer to the `mobilePhrases` property in [`src/locales/en_US/en_US.json`](src/locales/en_US/en_US.json). **Note**: support for standalone `mobilePhrases` key will be deprecated soon. Consider nesting it inside `phrases` if applicable.                                                                                                                                                                                                                                                                     |

  ```javascript
  language: {
    locale: 'en_US',
    phrases: { welcome: { title: 'My custom title' } },
    mobilePhrases: {
      'capture.driving_licence.instructions': 'This string will only appear on mobile'
    }
  }
  ```

### Flow customization

#### welcome

This step is the introduction screen of the SDK. It displays a summary of the capture steps the user will pass through. These steps can be specified to match the flow required. This is an optional screen.

The custom options are:

- `title` (string)
- `descriptions` ([string])
- `nextButton` (string)

#### document

This is the identity document capture step. Users will be asked to select the document type and its issuing country before providing images of their selected document. They will also have a chance to check the quality of the image(s) before confirming.

Document type and document country selection is an optional screen. This screen will only show to the end user if specific options are not configured to the SDK.

The custom options are:

- `documentTypes` (object)

  The list of document types visible to the user can be filtered by using the `documentTypes` option. When `documentTypes` is not defined, the default value for each document type is `true`. When `documentTypes` is defined, it will override the default values. Absent types are considered `false`.

- `country` (string)

  Document country can be specified per document type. The `country` configuration for a document type allows you to specify the issuing country of the document as a string containing a 3-letter ISO 3166-1 alpha-3 country code.

  If `documentTypes` only includes one document type with a country value, users will not see the document selection screen and instead will be taken directly to the capture screen.

  ⚠️ **Note**: the `null` value is deprecated and has no effect.

  ⚠️ **Note**: You can set the country for all document types except **Passport**. This is because passports have the same format worldwide so the SDK does not require this additional information.

For example, if you want to allow only Spanish (ESP) driving licences, and national identity cards and residence permits for all countries:

```json
{
  "steps": [
    "welcome",
    {
      "type": "document",
      "options": {
        "documentTypes": {
          "driving_licence": {
            "country": "ESP"
          },
          "national_identity_card": true,
          "residence_permit": true
        }
      }
    },
    "complete"
  ]
}
```

- `forceCrossDevice` (boolean - default: `false`)

  The Web SDK offers a cross device flow where desktop users will be given the option to continue using their desktop browser or swap to using their mobile device browser to complete the capture process. If a user selects to use their mobile device they will be redirected via a secure link that they can receive by SMS or QR code to complete the flow. At the end of the capture process users will be redirected back to their desktop to complete the SDK flow.

  When `forceCrossDevice` is set to `true`, the cross device flow is mandatory for all users. Desktop users will be required to complete the capture process on a mobile device browser.
  Configuring this option minimises the risk of fraudulent upload by ensuring a higher likelihood of live capture.

  ```javascript
  options: {
    forceCrossDevice: true
  }
  ```

  - `useLiveDocumentCapture` (boolean - default: `false`). DEPRECATED OPTION, WILL BE REMOVED NEXT QUARTERLY.
    **This feature is only available on mobile devices.**

  When set to `true`, users on mobile browsers with camera support will be able to capture document images using an optimised camera UI, where the SDK directly controls the camera feed to ensure live capture. Configuring this option minimises the risk of fraudulent upload by bypassing the device's default camera application. For unsupported scenarios, see the `uploadFallback` section below.

  Tested on: Android Chrome `78.0.3904.108`, iOS Safari `13`

- `uploadFallback` (boolean - default: `true`)

  The SDK will attempt to open an optimised camera UI for the user to take a live photo of the selected document. When this is not possible (because of an unsupported browser or mobile devices with no camera), by default the user will be presented with an HTML5 File Input upload because of `uploadFallback`. In this scenario, they will be able to use their mobile device's default camera application to take a photo.

  This method does not guarantee live capture, because certain mobile device browsers and camera applications may also allow uploads from the user's gallery of photos.

  ⚠️ **Warning**: If the mobile device does not have a camera or lacks camera browser support the user will not be able to complete the flow if `uploadFallback` is set to `false`.

  ```javascript
  options: {
    uploadFallback: false
  }
  ```

#### poa

This is the Proof of Address capture step. Users will be asked to select the issuing country of their document, the document type, and to provide images of their selected document. They will also have a chance to check the quality of the images before confirming. There are no custom options for this step.

#### face

This is the face capture step. Users will be asked to capture their face in the form of a photo, a video, or a motion capture. For photos and videos, they will also have a chance to check its quality before confirming.

The custom options are:

- `requestedVariant` (string - default: `standard`)

  A preferred variant can be requested for this step, by passing the option `requestedVariant: 'standard' | 'video' | 'motion'`. If `requestedVariant` is:

  - `standard`: a photo will be captured;
  - `video`: a video will be captured;
  - `motion`: a motion capture will be captured.

  The SDK will try to fulfil this request depending on camera availability, device capabilities, and browser support on the user's device. If a video cannot be taken, the face step will fallback to the `standard` variant. If Motion is not available, the face step will fallback to either `video` or `standard` variants. See `videoCaptureFallback` and `photoCaptureFallback` to control the fallback.

  If the SDK is initialized with the `requestedVariant` option for the face step, make sure you use the data returned in the [`onComplete` callback](#handling-callbacks) to request the correct report when creating a check.

- `uploadFallback` (boolean - default: `true`)

  By default, the SDK will attempt to open an optimised camera UI for the user to take a live photo or video. When this is not possible (because of an unsupported browser or mobile devices with no camera), by default the user will be presented with an HTML5 File Input upload because of `uploadFallback`. In this scenario, they will be able to use their mobile device's default camera application to take a photo, but will not be presented with an optimised camera UI.

  This method does not guarantee live capture, because certain mobile device browsers and camera applications may also allow uploads from the user's gallery of photos.

  ⚠️ **Warning**: If the mobile device does not have a camera or lacks camera browser support the user will not be able to complete the flow if `uploadFallback` is set to `false`.

  ```javascript
  options: {
    requestedVariant: 'standard' | 'video',
    uploadFallback: false
  }
  ```

- `useMultipleSelfieCapture` (boolean - default: `true`)

  When enabled, this feature allows the SDK to take additional selfie snapshots to help improve face similarity check accuracy. When disabled, only one selfie photo will be taken.

- `photoCaptureFallback` (boolean - default: `true`)

  When enabled, this feature allows end-users to upload selfies if the requested variant is `video` or `motion` and their browser does not support MediaRecorder, or if the requested variant is `motion` and Motion is unavailable on their device due to device capabilities.

  When disabled, it will forward the user to the cross-device flow in order to attempt to capture a video in another device. If the user is already in a mobile device and it does not support MediaRecorder, the unsupported browser error will be shown.

- `videoCaptureFallback` (boolean - default: `true`)

  When enabled, this feature allows end-users to upload videos if the requested variant is `motion` and their browser supports MediaRecorder, yet Motion is not supported due to device capabilities.

  When disabled, it will forward the user to the cross-device flow in order to attempt to capture a photo in another device. Having both `photoCaptureFallback` and `videoCaptureFallback` disabled would forward the user to the cross-device flow with Motion.

#### auth

This is the authentication step. If you have followed the guidelines specific to including authentication, you'll have this step made available. In here, a loading screen is presented to the user to fetch all necessary resources to perform authentication.

After all resources are loaded, the session is initialized, and the authentication check begins. An oval frame of the camera will be present (if camera permissions are provided) and actionable elements will render, asking the user to place their face in the frame, followed up by a different set of instructions for them to follow to successfully authenticate the user.

If the user is not a match, or conditions are not good enough to successfully authenticate, the user will be asked to retry authentication. If authentication is not possible (i.e. user performing authentication is not a match, doesn't provide optimal light/environment conditions, or doesn't follow instructions on screen), the page will rollback to the previous step. Custom option is:

- `retries` (number)

This option allows the integrator to set the maximum number of retries until authentication session is cancelled. **Default maximum number of attempts is 3.**

#### complete

This is the final completion step. The screen displays a completion message to signal the next steps to the user. This is an optional screen. The custom options are:

- `message` (string)
- `submessage` (string)

#### Cross device - mobile client introductory screen

When a user switches to the SDK's Cross Device flow, they will see an introductory screen when the SDK client loads on their mobile browser.
![Default Cross device mobile client introductory screen](demo/cross-device-client-intro.png)

- **`crossDeviceClientIntroProductName {String} optional`**

  You can customize the text by adding your company or product name to the subtitle with this option. We recommend that you set this, alongside the corresponding `crossDeviceClientIntroProductLogoSrc` below, to notify the user that this is part of a flow initiated on a desktop or laptop browser when they open the Cross Device link on their mobile browser. This is also an opportunity to include your branding in the SDK flow.

  ```javascript
  Onfido.init({
    token: '<YOUR_SDK_TOKEN>',
    crossDeviceClientIntroProductName: 'for a [COMPANY/PRODUCT NAME] loan',
  })
  ```

  ![Cross Device Client Intro screen with client product name and copy](demo/cross-device-client-intro-example-1.png)

- **`crossDeviceClientIntroProductLogoSrc {String} optional`**

  You can customize the icon by adding your company or product logo to be displayed instead of the default SDK icon image with this option. We recommend that you set this, alongside the corresponding `crossDeviceClientIntroProductName` above, to notify the user that this is part of a flow initiated on a desktop browser when they open the Cross Device link on their mobile browser. This is also an opportunity to include your branding in the SDK flow.
  The image used should be no more than 144px in both height and width.

  ```javascript
  Onfido.init({
    token: '<YOUR_SDK_TOKEN>',
    crossDeviceClientIntroProductLogoSrc: 'path://to/logo/image/file',
  })
  ```

  ![Cross Device Client Intro screen with client product logo](demo/cross-device-client-intro-example-2.png)

### Changing options in runtime

It's possible to change the options initialized at runtime:

```javascript
onfidoOut = Onfido.init({...})
...
//Change the title of the welcome screen
onfidoOut.setOptions({
  steps: [
    {
      type:'welcome',
      options:{title:"New title!"}
    },
    'document',
    'face',
    'complete'
  ]
});
...
//replace the jwt token
onfidoOut.setOptions({ token: '<YOUR_NEW_SDK_TOKEN>' });
...
//Open the modal
onfidoOut.setOptions({ isModalOpen:true });
```

The new options will be shallowly merged with the previous one, so you can only pass the differences to a get a new flow.

## Creating checks

The SDK is responsible for the capture of identity documents and selfie photos, videos, and motion captures. It doesn't perform any checks against the [Onfido API](https://documentation.onfido.com/). You need to access the Onfido API in order to manage applicants and perform checks.

### 1. Creating a check

For a walkthrough of how to create a document and facial similarity check using the Web SDK read our [Web SDK Quick Start guide](https://developers.onfido.com/guide/web-sdk-quick-start).

For further details on how to [create a check](https://documentation.onfido.com/#create-check) with the Onfido API.

Note: If you are testing with a sandbox token, please be aware that the results are pre-determined. You can learn more about [sandbox responses](https://documentation.onfido.com/#pre-determined-responses).

Note: If you are currently using API `v2` please refer to [this migration guide](https://developers.onfido.com/guide/api-v2-to-v3-migration-guide) for more information.

### 2. Setting up webhooks

Reports may not always return actual [results](https://documentation.onfido.com/#results) straightaway.

You can [set up webhooks](https://developers.onfido.com/guide/get-started-integrating#set-up-a-webhook) to be notified upon completion of a check or report, or both.

## User Analytics

The SDK allows you to track a user's journey through the verification process via a dispatched event. This gives insight into how your users make use of the SDK screens.

### Overriding the hook

In order to track a user's progress through the SDK an `EventListener` must be added that listens for `UserAnalyticsEvent` events. This can be done anywhere within your application.

For example:

```javascript
addEventListener('userAnalyticsEvent', (event) => /*Your code here*/);
```

The code inside of the `EventListener` will now be called when a particular event is triggered. For a full list of events see [tracked events](#tracked-events).

The parameter being passed in is an `Event` object. The details related to the user analytics event can be found at the path `event.detail` and are as follows:

|              |                                                                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `eventName`  | **string** <br /> Indicates the type of event. This will always be returned as `"Screen"` as each tracked event is a user visiting a screen. |
| `properties` | **map object** <br /> Contains the specific details of an event. For example, the name of the screen visited.                                |

### Using the data

You can use the data to monitor how many users reach each screen in your flow. You can do this by storing the number of users that reach each screen and comparing that to the number of users who reached the `Welcome` screen.

### Tracked events

Below is the list of potential events currently being tracked by the hook:

```
WELCOME - User reached the "Welcome" screen
USER_CONSENT - User reached the "User Consent" screen
DOCUMENT_TYPE_SELECT - User reached the "Choose document" screen where the type of document to upload can be selected
ID_DOCUMENT_COUNTRY_SELECT - User reached the "Select issuing country" screen where the the appropriate issuing country can be searched for and selected if supported
CROSS_DEVICE_INTRO - User reached the cross device "Continue on your phone" intro screen
CROSS_DEVICE_GET_LINK - User reached the cross device "Get your secure link" screen
CROSS_DEVICE_START - User reached the "document capture" screen on mobile after visiting the cross device link
DOCUMENT_CAPTURE_FRONT - User reached the "document capture" screen for the front side (for one-sided or two-sided document)
DOCUMENT_CAPTURE_BACK - User reached the "document capture" screen for the back side (for two-sided document)
DOCUMENT_CAPTURE_CONFIRMATION_FRONT - User reached the "document confirmation" screen for the front side (for one-sided or two-sided document)
DOCUMENT_CAPTURE_CONFIRMATION_BACK - User reached the "document confirmation" screen for the back side (for two-sided document)
FACIAL_INTRO - User reached the "selfie intro" screen
FACIAL_CAPTURE - User reached the "selfie capture" screen
FACIAL_CAPTURE_CONFIRMATION - User reached the "selfie confirmation" screen
VIDEO_FACIAL_INTRO - User reached the "face video intro" screen
VIDEO_FACIAL_CAPTURE_STEP_1 - User reached the 1st challenge during "face video capture", challenge_type can be found in eventProperties
VIDEO_FACIAL_CAPTURE_STEP_2 - User reached the 2nd challenge during "face video capture", challenge_type can be found in eventProperties
UPLOAD - User's file is uploading
```

## Premium Enterprise Features

Please refer to the [Premium Enterprise Features documentation](ENTERPRISE_FEATURES.md) for details of the following features offered to our Enterprise customers:

- Customized API Requests
- Callbacks Overview
- Cross device URL

The above features must be enabled for your account before they can be used. For more information, please contact your Onfido Solution Engineer or Customer Success Manager.

## Going live

Once you are happy with your integration and are ready to go live, please contact [client-support@onfido.com](mailto:client-support@onfido.com) to obtain a live API token. You will have to replace the sandbox token in your code with the live token.

Check the following before you go live:

- you have set up [webhooks](https://documentation.onfido.com/#webhooks) to receive live events
- you have entered correct billing details inside your [Onfido Dashboard](https://onfido.com/dashboard/)

## Accessibility

The Onfido SDK has been optimised to provide the following accessibility support by default:

- Screen reader support: accessible labels for textual and non-textual elements available to aid screen reader navigation, including dynamic alerts
- Keyboard navigation: all interactive elements are reachable using a keyboard
- Sufficient color contrast: default colors have been tested to meet the recommended level of contrast
- Sufficient touch target size: all interactive elements have been designed to meet the recommended touch target size

Refer to our [accessibility statement](https://developers.onfido.com/guide/sdk-accessibility-statement) for more details.

⚠️ Note: If you make your own UI customizations, you are responsible for ensuring that the UI changes will still adhere to accessibility standards. For example, accessible color contrast ratios and dyslexic friendly fonts.

## TypeScript

From version `6.5.0`, TypeScript is officially supported, providing typings for:

- `init()` method
- `options` argument (`SdkOptions`) and return object (`SdkHandle`) of `init()` method
- Arguments (`SdkResponse` and `SdkError`) for `onComplete()` and `onError()` callbacks
- `steps` option (`StepTypes` and `StepConfig`)
- `language` option (`SupportedLanguages` and `LocaleConfig`)
- `region` option (`ServerRegions`)

## More information

### Browser compatibility

| ![Chrome](https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Edge](https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![Safari](https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png) |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Latest ✔                                                                                            | Latest \* ✔                                                                                            | Latest ✔                                                                                      | Latest ✔                                                                                            |

\* _Firefox on Android, iOS not supported_

### Troubleshooting

#### Content Security Policy issues

In order to mitigate potential cross-site scripting issues, most modern browsers use a Content Security Policy (CSP). These policies might prevent the SDK from correctly displaying the images captured during the flow or correctly load styles. If CSP is blocking some of the SDK functionalities, make sure you add the following snippet inside the `<head>` tag of your application.

```html
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self' https://assets.onfido.com;
  script-src 'self' 'unsafe-eval' https://assets.onfido.com https://sentry.io;
  style-src 'self' https://assets.onfido.com;
  connect-src 'self' data: blob: *.onfido.com wss://*.onfido.com https://sentry.io;
  img-src 'self' data: blob: https://assets.onfido.com/;
  media-src blob: https://assets.onfido.com;
  worker-src blob:;
  object-src 'self' blob:;
  frame-src 'self' data: blob:;
"
/>
```

#### SDK navigation issues

In rare cases, the SDK back button might not work as expected within the application history. This is due to the interaction of `history/createBrowserHistory` with the browser history API.
If you notice that by clicking on the SDK back button, you get redirected to the page that preceeded the SDK initialization, you might want to consider using the following configuration option when initialising the SDK: `useMemoryHistory: true`. This option allows the SDK to use the `history/createMemoryHistory` function, instead of the default `history/createBrowserHistory`. This option is intended as workaround, while a more permanent fix is implemented.

Example:

```javascript
Onfido.init({
  useMemoryHistory: true,
})
```

#### Iframe camera and microphone permission issues

If embedded inside a cross-origin iframe, the SDK may fail to access the camera and microphone. This is a known issue on recent Chrome versions where requests fail in a similar way as if a user had denied a permission prompt. You may need to add the following `allow` attribute to your iframe:

```html
<iframe src="..." allow="camera;microphone"></iframe>
```

### Support

Please open an issue through [GitHub](https://github.com/onfido/onfido-sdk-ui/issues). Please be as detailed as you can. Remember **not** to submit your token in the issue. Also check the closed issues to check whether it has been previously raised and answered.

If you have any issues that contain sensitive information please send us an email with the ISSUE: at the start of the subject to [web-sdk@onfido.com](mailto:web-sdk@onfido.com).

Previous versions of the SDK will be supported for a month after a new major version release. Note that when the support period has expired for an SDK version, no bug fixes will be provided, but the SDK will keep functioning (until further notice).

## How is the Onfido SDK licensed?

Please see [LICENSE](https://github.com/onfido/onfido-sdk-ui/blob/master/LICENSE) for licensing details.
