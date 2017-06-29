# Onfido SDK UI Layer

[![bitHound Overall Score](https://www.bithound.io/github/onfido/onfido-sdk-ui/badges/score.svg)](https://www.bithound.io/github/onfido/onfido-sdk-ui)
[![bitHound Dependencies](https://www.bithound.io/github/onfido/onfido-sdk-ui/badges/dependencies.svg)](https://www.bithound.io/github/onfido/onfido-sdk-ui/master/dependencies/npm)
[![Build Status](https://travis-ci.org/onfido/onfido-sdk-ui.svg?branch=master)](https://travis-ci.org/onfido/onfido-sdk-ui)

## Table of contents

* [Overview](#overview)
* [Getting started](#getting-started)
* [JSON Web Token authentication](#json-web-token-authentication)
* [Handling callbacks](#handling-callbacks)
* [Customising SDK](#customising-sdk)
* [Uploading files to Onfido API](#uploading-files-to-onfido-api)
* [Creating checks](#creating-checks)
* [Going live](#going-live)

## Overview

This SDK provides a set of [React](https://facebook.github.io/react/) components for JavaScript applications to allow capturing of identity documents and face photos for the purpose of identity verification. The SDK offers a number of benefits to help you create the best onboarding / identity verification experience for your customers:

- Carefully designed UI to guide your customers through the entire photo-capturing process
- Modular design to help you seamlessly integrate the photo-capturing process into your application flow
- Advanced image quality detection technology to ensure the quality of the captured images meets the requirement of the Onfido identity verification process, guaranteeing the best success rate

Note: the SDK is only responsible for capturing photos. You still need to access the [Onfido API](https://documentation.onfido.com/) to upload photos, manage applicants and checks.

All document captures are collected through browser file upload. On handheld devices the SDK uses the `accept="image/*"` attribute to give the option to take a photo using the native capture methods. There is a feature currently in beta that uses the [getUserMedia API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) (where supported) to automatically detect and capture documents via a user’s webcam. This feature can be enabled using the [useWebcam](#public-options-and-methods) option. Face capture uses the webcam by default if one is available.

![Various views from the SDK](demo/screenshots.jpg)

## Getting started

### 1. Obtaining an API token

In order to start integration, you will need the **API token**. You can use our [sandbox](https://documentation.onfido.com/#testing) environment to test your integration, and you will find the sandbox token inside your [Onfido Dashboard](https://onfido.com/dashboard/api/tokens).

### 2. Generating a JSON Web Token

For security reasons, instead of using the API token directly in you client-side code, you will need to supply a short-lived JSON Web Token (JWT) to initialise the SDK. The easiest way to generate a JWT is via the [JWT endpoint](https://documentation.onfido.com/#json-web-tokens) in the Onfido API:

```shell
$ curl https://api.onfido.com/v2/jwt?referrer=YOUR_WEBPAGE_URL \
    -H 'Authorization: Token token=YOUR_API_TOKEN'
```

Make a note of the `jwt` value in the response, as you will need it later on when initialising the SDK. 

### 3. Including/Importing the library

#### 3.1 HTML Script Tag Include

Include it as a regular script tag on your page:

```html
<script src='dist/onfido.min.js'></script>
```

And the CSS styles:

```html
<link rel='stylesheet' href='dist/styles.css'>
```

#### Example app

[JsFiddle example here.](https://jsfiddle.net/4xqtt6fL/22/)
Simple example using script tags.

#### 3.2 NPM style import

You can also import it as a module into your own JS build system (tested with Webpack).


```sh
$ npm install --save onfido-sdk-ui
```

```js
// ES6 module import
import Onfido from 'onfido-sdk-ui'

// commonjs style require
var Onfido = require('onfido-sdk-ui')
```

The **CSS style** will be included **inline with the JS code** when the library is imported.

#### Notice

The library is **Browser only**, it does not support the **Node Context**.

#### Example App

 **[Webpack Sample App repository here.](https://github.com/onfido/onfido-sdk-web-sample-app/tree/0.0.2)**
Example app which uses the npm style of import.

### 4. Adding basic HTML markup

There are just two elements required in your HTML:

1. A button that triggers the modal to open
2. An empty element for the modal interface to mount itself on

```html
<!-- Somewhere on your page you need a button or link that triggers
the verification modal to open -->
<button id='onfido-button' disabled>Verify identity</button>

<!-- At the bottom of your page, you need an empty element where the
verification component will be mounted. -->
<div id='onfido-mount'></div>
```

### 5. Initialising the SDK

You are now ready to initialise the SDK:

```js
Onfido.init({
  // the JWT token that you generated earlier on
  token: 'YOUR_JWT_TOKEN',
  // id of the element you want to mount the component on
  containerId: 'onfido-mount',
  onComplete: function(capturesHash) {
    console.log('Photos captured');
  }
})
```

Congratulations! You have successfully started the flow. Carry on reading the next sections to learn how to:

- Generate JSON Web Tokens (manually or via the Onfido API)
- Handle callbacks
- Customise the SDK
- Upload files to the Onfido API
- Create checks

## JSON Web Token authentication

Clients are authenticated using JSON Web Tokens (JWTs). The tokens are one use only and expire after 30 minutes. See [here](https://jwt.io/) for details on how JWTs work.

You need a new JWT each time you initialise the SDK. You can obtain a JWT in two ways:

### 1. Through Onfido API

The Onfido [API](https://documentation.onfido.com/) exposes a JWT endpoint. See the API [documentation](https://documentation.onfido.com/#json-web-tokens) for details.

### 2. Generating your own

You can generate your own JWTs.

- **Algorithm:** `HS256`.
- **Secret:** Your Onfido API key.

### Payload

The payload is **not** encrypted. Do **not** put your API key in the payload.

The payload keys are case sensitive and should all be lowercase.

- `exp {Integer} required`

  The expiry time - UNIX time as an integer. This must be less than 30 minutes in the future.

- `jti {String} required`

  The one-time use unique identifier string. Use a 64 bit random string to avoid collisions. E.g. `"JTiYyyRk3w8"`

- `uuid {String} required`

  A unique ID that identifies your API token in our database. This can be shared publicly and is **not** the same as your API Token. We will provide you with your uuid on request.

- `ref {String} required`

  The HTTP referrer of the page where the SDK is initialised. See the API [documentation](https://documentation.onfido.com/#json-web-tokens) for allowed formats.

## Handling callbacks

A number of callback functions are fired at various points of the flow. The most important function is `onComplete`. Inside this callback, you would typically send the captured images to your backend server, where you would then [upload files](#uploading-files-to-onfido-api) and [create checks](#creating-checks) using the [Onfido API](https://documentation.onfido.com/).

- **`onReady {Function} optional`**

  Callback function that fires once the library has successfully authenticated using the JWT. In this function we recommend removing the `disabled` attribute on the modal trigger button.

- **`onDocumentCapture {Function} optional`**

  Callback that fires when the document has been successfully captured and confirmed by the user. It returns an object that contains the document capture.

- **`onFaceCapture {Function} optional`**

  Callback that fires when the face has been successfully captured and confirmed by the user. It returns an object that contains the face capture.

- **`onComplete {Function} optional`**

  Callback that fires when both the document and face have successfully been captured. It returns an object that contains both captures. This event data should sent to your backend where the full [API requests](#uploading-files-to-onfido-api) will be made.

  Here is an `onComplete` callback example, making use of the `getCaptures` convenience function:

  ```js
  Onfido.init({
    token: 'your-jwt-token',
    buttonId: 'onfido-button',
    containerId: 'onfido-mount',
    // here we send the data in the complete callback
    onComplete: function() {
      var captures = Onfido.getCaptures()
      sendToServer(captures)
    }
  })

  const reduceObj = (object, callback, initialValue) =>
    Object.keys(object).reduce(
      (accumulator, key) => callback(accumulator, object[key], key, object),
      initialValue)

  const objectToFormData = (object) =>
    reduceObj(object, (formData, value, key) => {
      formData.append(key, value)
      return formData;
    }, new FormData())

  const postData = (data, endpoint, callback) => {
    const request = new XMLHttpRequest()
    request.open('POST', endpoint, true)

    request.onload = () => {
      if (request.readyState === request.DONE) {
        callback(request)
      }
    }
    request.send(objectToFormData(data))
  }

  const sendToServer = ({documentCapture, faceCapture}) => {
    postFormData({
      file: documentCapture.blob,
      type: documentCapture.documentType
    },
      '/your-document-endpoint/',
      request => console.log('document uploaded')
    )

    postFormData({
      file: faceCapture.blob
    },
      '/your-face-endpoint/',
      request => console.log('face uploaded')
    )
  }
  ``` 

## Customising SDK

A number of options are available to allow you to customise the SDK:

- **`token {String} required`**

  A JWT is required in order to authorise with our WebSocket endpoint. If one isn’t present, an exception will be thrown.

- **`useModal {Boolean} optional`**

  Turns the SDK into a modal, which fades the background and puts the SDK into a contained box.

- **`isModalOpen {Boolean} optional`**

  In case `useModal` is set to `true`, this defines whether the modal is open or closed.
  To change the state of the modal after calling `init()` you need to later use `setOptions()` to modify it.
  The default value is `false`.

- **`buttonId {String} optional`**

  In case `useModal` is set to `true`, the button with this ID, when clicked, will open the verification modal. This defaults to `onfido-button`, although is not necessary to have a button at all.

- **`containerId {String} optional`**

  A string of the ID of the container element that the UI will mount to. This needs to be an empty element. The default ID is `onfido-mount`.

- **`steps {List} optional`**

  [link-to-steps-to-components-map]:src/components/App/StepComponentMap.js

  List of the different steps in the flow. Each step is defined by a named string. The available steps can found at [StepComponentMap.js][link-to-steps-to-components-map]

  It's also possible to pass parameters to each step. Eg:

  ```javascript
  steps: [
    {
      type: 'welcome',
      options: {
        title: 'Open your new bank account'
      }
    },
    {
      type: 'document',
      options: {
        useWebcam: true // This is in beta!
      }
    },
    'face'
  ]
  ```

  In the example above the step `'welcome'` will also pass the values inside of `options` to the properties (`props`) of the React components that make up the step. In order to know which `props` exist for each step, please read the source code for each component. The mapping between steps to components can be found at [StepComponentMap.js][link-to-steps-to-components-map]

### Changing options in runtime

It's possible to change the options initialised at runtime:

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
onfidoOut.setOptions({ token:"new token" });
...
//Open the modal
onfidoOut.setOptions({ isModalOpen:true });
```

The new options will be shallowly merged with the previous one. So one can pass only the differences to a get a new flow.

## Uploading files to Onfido API

**This SDK’s aim is to help with the document capture process. It does not actually perform the full document/face checks against our [API](https://documentation.onfido.com/).**

In order to perform a full document/face check, you need to send the captures to your own server, and then make calls to our [API](https://documentation.onfido.com/) with the captures included.

### 1. Creating an applicant

With your API token (see [Getting started](#getting-started)), you can create an applicant by making a request to the [create applicant endpoint](https://documentation.onfido.com/#create-applicant) from your server:

```shell
$ curl https://api.onfido.com/v2/applicants \
    -H 'Authorization: Token token=YOUR_API_TOKEN' \
    -d 'first_name=John' \
    -d 'last_name=Smith'
```

You will receive a response containing the applicant id.

### 2. Uploading files

You can then upload the document and the face photo using the [upload document endpoint](https://documentation.onfido.com/#upload-document) and the [upload live photo endpoint](https://documentation.onfido.com/#upload-live-photo) respectively.

```shell
$ curl https://api.onfido.com/v2/applicants/YOUR_APPLICANT_ID/documents \
    -H 'Authorization: Token token=YOUR_API_TOKEN' \
    -d 'type=DOCUMENT_TYPE' \
    -F 'file=@document.png;type=image/png'

$ curl https://api.onfido.com/v2/live_photos \
    -H 'Authorization: Token token=YOUR_API_TOKEN' \
    -d 'applicant_id=YOUR_APPLICANT_ID' \
    -F 'file=@face.png;type=image/png'
```

## Creating checks

Assuming an applicant has been created and the files have been [uploaded](#uploading-file-to-onfido-api), you can then create a check for the applicant.

### 1. Creating a check

You will need to create an *express* check by making a request to the [create check endpoint](https://documentation.onfido.com/#create-check). If you are just verifying a document, you only have to include a [document report](https://documentation.onfido.com/#document-report) as part of the check. On the other hand, if you are verify a document and a face photo, you will also have to include a [facial similarity report](https://documentation.onfido.com/#facial-similarity).

```shell
$ curl https://api.onfido.com/v2/applicants/YOUR_APPLICANT_ID/checks \
    -H 'Authorization: Token token=YOUR_API_TOKEN' \
    -d 'type=express' \
    -d 'reports[][name]=document' \
    -d 'reports[][name]=facial_similarity'
```

Note: you can also submit the POST request in JSON format.

You will receive a response containing the check id instantly. As document and facial similarity reports do not always return actual [results](https://documentation.onfido.com/#results) straightaway, you need to set up a webhook to get notified when the results are ready.

Finally, as you are testing with the sandbox token, please be aware that the results are pre-determined. You can learn more about sandbox responses [here](https://documentation.onfido.com/#sandbox-responses).

### 2. Setting up webhooks

Refer to the [Webhooks](https://documentation.onfido.com/#webhooks) section in the API documentation for details.

## Going live

Once you are happy with your integration and are ready to go live, please contact [client-support@onfido.com](mailto:client-support@onfido.com) to obtain live version of the API token. We will have to replace the sandbox token in your code with the live token.
 
A few things to check before you go live:

- Make sure you have set up webhooks to receive live events
- Make sure you have entered correct billing details inside your [Onfido Dashboard](https://onfido.com/dashboard/)

## How is the Onfido SDK licensed?

The Onfido SDK core and Onfido SDK UI layer are available under the MIT license.
