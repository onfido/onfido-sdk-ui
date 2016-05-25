# Onfido SDK UI Layer

## Overview

This is a plug-and-play SDK that leverages the Onfido SDK core, helping users take document and face captures that can then be sent to our backend APIs.

The SDK uses WebSockets and the [getUserMedia API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) (where supported) to capture via a user’s webcam, falling back to a file upload for unsupported browsers. The `accept="image/*"` attribute is used to give the option to take a photo using the native capture methods on handheld devices.

All document captures are sent over WebSockets to our image evaluation API, to ensure your users are submitting a document image of adequate quality.

To initialise the SDK, a connection to our WebSocket endpoint is required. Connections are authorised using [JWTs](https://jwt.io/), which can be generated on your server, or fetched from our JWT endpoint. Read about how to do this in the [authentication section](#authentication) below.

## Screenshots

![Various views from the SDK](demo/screenshots.jpg "")

From left to right:

1. Home view where you first select your document type
2. The capture view where the document is captured over camera or upload
3. Home view where a document capture has been successful

## Example

To get up and running with the library, there are three things you need to include.

### 1. The script and styles

Include it as a regular script tag on your page:

```html
<script src='dist/onfido.min.js'></script>
```

Or import it as a module into your own JS build system:

```sh
$ npm install --save onfido-sdk-ui
```

```js
// ES6 module import
import Onfido from 'onfido-sdk-ui'

// commonjs style require
var Onfido = require('onfido-sdk-ui')
```

And finally, the CSS styles:

```html
<link rel='stylesheet' href='dist/styles.css'>
```

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
  // id of the button that will trigger the modal opening
  buttonId: 'onfido-button',
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
  }
})
```

## Public options and methods

A breakdown of the options and methods available to the SDK.

- **`token {String} required`**

  A JWT is required in order to authorise with our WebSocket endpoint. If one isn’t present, an exception will be thrown.

- **`buttonId {String} optional`**

  A string of the ID of the button that when clicked, will open the verification modal. This defaults to `onfido-button`. We recommend adding a `disabled` attribute to this element so that the modal cannot be activated until `onReady` has fired.

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
    id: "mwxm5loxdu63zlkawcdi",
    image: "data:image/webp;base64,9frG47Tzp/h/+bzsf/dd…",
    messageType: "document",
    documentType: "passport"
  },
  faceCapture: {
    id: "yy5j8hxlxukufjbrzfr",
    image: "data:image/webp;base64,UklGRrZcAQBXRUJQVlA4…",
    messageType: "face"
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

## [Authentication](#authentication)

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

- **`exp {Integer} required`**

  The expiry time - UNIX time as an integer. This must be less than 30 minutes in the future.

- **`jti {String} required`**

  The one-time use unique identifier string. Use a 64 bit random string to avoid collisions. E.g. `"JTiYyyRk3w8"`

- **`uuid {String} required`**

  A unique ID that identifies your API token in our database. This can be shared publicly and is **not** the same as your API Token. We will provide you with your uuid on request.

## How is the Onfido SDK licensed?

The Onfido SDK core and Onfido SDK UI layer are available under the MIT license.
