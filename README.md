# Onfido SDK UI Layer

[![bitHound Overall Score](https://www.bithound.io/github/onfido/onfido-sdk-ui/badges/score.svg)](https://www.bithound.io/github/onfido/onfido-sdk-ui)
[![bitHound Dependencies](https://www.bithound.io/github/onfido/onfido-sdk-ui/badges/dependencies.svg)](https://www.bithound.io/github/onfido/onfido-sdk-ui/master/dependencies/npm)
[![Build Status](https://travis-ci.org/onfido/onfido-sdk-ui.svg?branch=master)](https://travis-ci.org/onfido/onfido-sdk-ui)

## Overview

This is a plug-and-play SDK that leverages the Onfido SDK core, helping users take document and face captures that can then be sent to our backend APIs.

The SDK uses WebSockets and the [getUserMedia API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) (where supported) to capture via a user’s webcam, falling back to a file upload for unsupported browsers. The `accept="image/*"` attribute is used to give the option to take a photo using the native capture methods on handheld devices.

All document captures are sent over WebSockets to our image evaluation API, to ensure your users are submitting a document image of adequate quality.

To initialise the SDK, a connection to our WebSocket endpoint is required. Connections are authorised using [JWTs](https://jwt.io/), which can be generated on your server, or fetched from our JWT endpoint. Read about how to do this in the [authentication section](#authentication) below.

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

[JsFiddle example here.](https://jsfiddle.net/4xqtt6fL/13/)
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
verification component will be mounted. It’s very important that you
set a style of `display: none` on this too, otherwise it will display
on your page -->
<div id='onfido-mount' style='display: none'></div>
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
  onDocumentCapture: function(event) {
    // callback for when the document has captured successfully
  },
  onFaceCapture: function(event) {
    // callback for when the face capture was successful
  },
  onComplete: function(event) {
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

  A string of the ID of the container element that the UI will mount to. This needs to be an empty element, and should be set to `display: none`. This defaults to `onfido-mount`.

- **`onReady {Function} optional`**

  Callback function that fires once the library has successfully authenticated using the JWT. In this function we recommend removing the `disabled` attribute on the modal trigger button.

- **`onDocumentCapture {Function} optional`**

  Callback that fires when the document has successfully captured. It returns an event object that contains your document capture.

- **`onFaceCapture {Function} optional`**

  Callback that fires when the face has successfully captured. It returns an event object that contains your face capture.

- **`onComplete {Function} optional`**

  Callback that fires when both the document and face have successfully captured. It returns an object that contains the captures. This event data should sent to your backend where the full API request will be made.

- **`steps {List} optional`**

  [link-to-steps-to-components-map]:src/components/App/StepComponentMap.js

  List of the different steps in the flow. Each step is defined by a named string. The available steps can found at [StepComponentMap.js][link-to-steps-to-components-map]

  It's also possible to pass parameters to each step. Eg:

  ```javascript
  steps: [
    {
      type:'welcome',
      options:{
        title:'Open your new bank account'
      }
    },
    'document'
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
    //base 64 encoded png image
    image: "data:image/png;base64,9frG47Tzp/h/+bzsf/dd…",
    //the result of the document selection step
    documentType: "passport"
  },
  faceCapture: {
    id: "yy5j8hxlxukufjbrzfr",
    image: "data:image/png;base64,UklGRrZcAQBXRUJQVlA4…",
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
    var data = Onfido.getCaptures()
    sendToServer(data)
  }
})

function sendToServer(data) {
  var request = new XMLHttpRequest()
  request.open('POST', '/your/server/endpoint', true)
  request.setRequestHeader('Content-Type', 'application/json')
  var dataString = JSON.stringify(data)
  request.send(dataString)
}
```

## Authentication

Clients are authenticated using JSON Web Tokens (JWTs). The tokens are one use only and expire after 30 minutes. See [here](https://jwt.io/) for details on how JWTs work.

You need a new JWT each time you initialise the SDK. You can obtain a JWT in two ways:

### 1. Through Onfido's API

The Onfido [API](https://onfido.com/documentation) exposes a JWT endpoint. See the API [documentation](https://onfido.com/documentation#json-web-tokens) for details.

### 2. Generate your own

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

  The HTTP referrer of the page where the SDK is initialised. See the API [documentation](https://onfido.com/documentation#json-web-tokens) for allowed formats.

## How is the Onfido SDK licensed?

The Onfido SDK core and Onfido SDK UI layer are available under the MIT license.
