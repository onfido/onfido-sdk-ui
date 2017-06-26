# Onfido SDK UI Layer

[![bitHound Overall Score](https://www.bithound.io/github/onfido/onfido-sdk-ui/badges/score.svg)](https://www.bithound.io/github/onfido/onfido-sdk-ui)
[![bitHound Dependencies](https://www.bithound.io/github/onfido/onfido-sdk-ui/badges/dependencies.svg)](https://www.bithound.io/github/onfido/onfido-sdk-ui/master/dependencies/npm)
[![Build Status](https://travis-ci.org/onfido/onfido-sdk-ui.svg?branch=master)](https://travis-ci.org/onfido/onfido-sdk-ui)

## Overview

This is a plug-and-play SDK that leverages the Onfido SDK core, helping users take document and face captures that can then be sent to our backend APIs.

All document captures are sent over WebSockets to our image evaluation API, to ensure your users are submitting a document image of adequate quality.

All document captures are collected through file upload. On handheld devices the SDK uses the `accept="image/*"` attribute to give the option to take a photo using the native capture methods. There is a feature currently in beta that uses the [getUserMedia API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) (where supported) to automatically detect and capture documents via a user’s webcam. This feature can be enabled using the [useWebcam](#public-options-and-methods) option. Face capture uses the webcam by default if one is available.

To initialise the SDK, a connection to our WebSocket endpoint is required. Connections are authorized using [JWTs](https://jwt.io/), which can be generated on your server, or fetched from our JWT endpoint. Read about how to do this in the [authentication section](#authentication) below.

## Screenshots

![Various views from the SDK](demo/screenshots.jpg)

## Example

To get up and running with the library, there are three things you need to include.

### 1. Include/Import the library

#### 1.1 HTML Script Tag Include

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

#### 1.2 NPM style import

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

### 2. Some markup

There are just two things required in your HTML:

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

### 3. SDK init code

An example of how the SDK is initialised with all the available options used. These are broken down into more detail below.

```js
Onfido.init({
  // the token that you generate on your server
  token: 'your-jwt-token',
  // id of the element you want to mount the component on
  containerId: 'onfido-mount',
  // here are various callbacks that fire during the capture process
  onReady: function() {
    // callback that fires when successfully authorised
  },
  onDocumentCapture: function(capture) {
    // callback for when the document has captured successfully
  },
  onFaceCapture: function(capture) {
    // callback for when the face capture was successful
  },
  onComplete: function(capturesHash) {
    // callback for when everything is complete
  },
  steps: [
    //you can customize the flow of different steps of the SDK flow
    //you can change the order or remove steps
    'welcome','document','face','complete'
  ]
})
```

### 4. Change options in runtime

It's possible to change the options initialised at runtime.
Example below.

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

## Public options and methods

A breakdown of the options and methods available to the SDK.

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

- **`onReady {Function} optional`**

  Callback function that fires once the library has successfully authenticated using the JWT. In this function we recommend removing the `disabled` attribute on the modal trigger button.

- **`onDocumentCapture {Function} optional`**

  Callback that fires when the document has been successfully captured and confirmed by the user. It returns an object that contains the document capture.

- **`onFaceCapture {Function} optional`**

  Callback that fires when the face has been successfully captured and confirmed by the user. It returns an object that contains the face capture.

- **`onComplete {Function} optional`**

  Callback that fires when both the document and face have successfully been captured. It returns an object that contains both captures. This event data should sent to your backend where the full API requests will be made.

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

## Completing the check

**This SDK’s aim is to help with the document capture process. It does not actually perform the full document checks against our API.**

In order to perform a full document check, you need to send the captures to your own server, and then make the call to our API with the captures included.

Built into the core is a `getCaptures` convenience method that returns back an object containing your captures.

```js
// assigning the captures to a variable
var captures = Onfido.getCaptures()
```

You should get something returned back that looks like this:

```js
{
  documentCapture: {
    //local id of the capture
    //useful only if you want to track and reference captures which have been taken
    id: "mwxm5loxdu63zlkawcdi",
    //captures will be returned as File or Blob
    blob: BlobOrFile
    //the result of the document selection step
    documentType: "passport"
  },
  faceCapture: {
    id: "yy5j8hxlxukufjbrzfr",
    blob: BlobOrFile,
  }
}
```

With this data, you will want to send it over to your backend, either by attaching it to a form, and submitting it inline, or asynchronously. If going for the latter, the `onComplete` callback is the best to use.

Here is a more complete example:

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

## Authentication

Clients are authenticated using JSON Web Tokens (JWTs). The tokens expire 90 minutes after being created.
You need a new JWT each time you initialise the SDK.

See [here](https://jwt.io/) for details on how JWTs work.

### How to generate JWT tokens

The Onfido [API](https://onfido.com/documentation) exposes a JWT endpoint, which you can use to generate JWT tokens. See the API [documentation](https://onfido.com/documentation#json-web-tokens) for details.

## How is the Onfido SDK licensed?

The Onfido SDK core and Onfido SDK UI layer are available under the MIT license.
