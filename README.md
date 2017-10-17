# Onfido SDK UI Layer

[![bitHound Overall Score](https://www.bithound.io/github/onfido/onfido-sdk-ui/badges/score.svg)](https://www.bithound.io/github/onfido/onfido-sdk-ui)
[![bitHound Dependencies](https://www.bithound.io/github/onfido/onfido-sdk-ui/badges/dependencies.svg)](https://www.bithound.io/github/onfido/onfido-sdk-ui/master/dependencies/npm)
[![Build Status](https://travis-ci.org/onfido/onfido-sdk-ui.svg?branch=master)](https://travis-ci.org/onfido/onfido-sdk-ui)

## Table of contents

* [Overview](#overview)
* [Getting started](#getting-started)
* [Handling callbacks](#handling-callbacks)
* [Removing SDK](#removing-sdk)
* [Customising SDK](#customising-sdk)
* [Creating checks](#creating-checks)
* [Going live](#going-live)

## Overview

This SDK provides a set of components for JavaScript applications to allow capturing of identity documents and face photos for the purpose of identity verification. The SDK offers a number of benefits to help you create the best onboarding / identity verification experience for your customers:

- Carefully designed UI to guide your customers through the entire photo-capturing process
- Modular design to help you seamlessly integrate the photo-capturing process into your application flow
- Advanced image quality detection technology to ensure the quality of the captured images meets the requirement of the Onfido identity verification process, guaranteeing the best success rate
- Direct image upload to the Onfido service, to simplify integration*

Note: the SDK is only responsible for capturing photos. You still need to access the [Onfido API](https://documentation.onfido.com/) to manage applicants and checks.

Users will be prompted to upload a file containing an image of their document. On handheld devices they can also use the native camera to take a photo of their document.

Face capture uses the webcam by default for capturing live photos of users. File upload is supported as a fallback, if webcam is not available.

![Various views from the SDK](demo/screenshots.jpg)

## Getting started

### 1. Obtaining an API token

In order to start integration, you will need the **API token**. You can use our [sandbox](https://documentation.onfido.com/#testing) environment to test your integration, and you will find the sandbox token inside your [Onfido Dashboard](https://onfido.com/dashboard/api/tokens).

### 2. Creating an applicant

With your API token, you should create an applicant by making a request to the [create applicant endpoint](https://documentation.onfido.com/#create-applicant) from your server:

```shell
$ curl https://api.onfido.com/v2/applicants \
    -H 'Authorization: Token token=YOUR_API_TOKEN' \
    -d 'first_name=John' \
    -d 'last_name=Smith'
```

You will receive a response containing the applicant id which will be used to create a JSON Web Token.

### 3. Generating an SDK token

For security reasons, instead of using the API token directly in you client-side code, you will need to generate and include a short-lived JSON Web Token ([JWT](https://jwt.io/)) every time you initialise the SDK. To generate an SDK Token you should perform a request to the [SDK Token endpoint](https://documentation.onfido.com/#sdk-tokens) in the Onfido API:

```shell
$ curl https://api.onfido.com/v2/sdk_token
  -H 'Authorization: Token token=YOUR_API_TOKEN'
  -F 'applicant_id=YOUR_APPLICANT_ID'
  -F 'referrer=REFERRER_PATTERN'
```

Make a note of the `token` value in the response, as you will need it later on when initialising the SDK.

\* Tokens expire 90 minutes after creation.

### 4. Including/Importing the library

#### 4.1 HTML Script Tag Include

Include it as a regular script tag on your page:

```html
<script src='dist/onfido.min.js'></script>
```

And the CSS styles:

```html
<link rel='stylesheet' href='dist/style.css'>
```

#### Example app

[JsFiddle example here.](https://jsfiddle.net/4xqtt6fL/35/)
Simple example using script tags.

#### 4.2 NPM style import

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

 **[Webpack Sample App repository here](https://github.com/onfido/onfido-sdk-web-sample-app/).**
Example app which uses the npm style of import.

### 5. Adding basic HTML markup

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

### 6. Initialising the SDK

You are now ready to initialise the SDK:

```js
Onfido.init({
  // the JWT token that you generated earlier on
  token: 'YOUR_JWT_TOKEN',
  // id of the element you want to mount the component on
  containerId: 'onfido-mount',
  onComplete: function() {
    console.log("everything is complete")
    // You can now trigger your backend to start a new check
  }
})
```

Congratulations! You have successfully started the flow. Carry on reading the next sections to learn how to:

- Handle callbacks
- Remove the SDK from the page
- Customise the SDK
- Create checks

## Handling callbacks

- **`onComplete {Function} optional`**

  Callback that fires when both the document and face have successfully been captured and uploaded.
  At this point you can trigger your backend to create a check by making a request to the Onfido API [create check endpoint](https://documentation.onfido.com/#create-check).

  Here is an `onComplete` callback example:

  ```js
  Onfido.init({
    token: 'your-jwt-token',
    buttonId: 'onfido-button',
    containerId: 'onfido-mount',
    onComplete: function() {
      console.log("everything is complete")
      // tell your backend service that it can create the check
    }
  })

  ```
  Based on the applicant id, you can then create a check for the user via your backend.

## Removing SDK

If you are embedding the SDK inside a single page app, you can call the `tearDown` function to remove the SDK complelety from the current webpage. It will reset state and you can safely re-initialise the SDK inside the same webpage later on.

```javascript
onfidoOut = Onfido.init({...})
...
onfidoOut.tearDown()
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

  List of the different steps and their custom options. Each step can either be specified as a string (when no customisation is required) or an object (when customisation is required):

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

  In the example above, the SDK flow is consisted of three steps: `welcome`, `document` and `face`. Note that the `title` option of the `
  welcome` step and the `useWebcam` option of the `document` step are being overridden, while the `face` step is not being customised.

  Below are descriptions of the steps and the custom options that you can specify inside the `options` property. Unless overridden, the default option values will be used:

  ### welcome ###

  This is the introduction screen of the SDK. Use this to explain to your users that they need to supply identity documents (and face photos) to have their identities verified. The custom options are:

  - title (string)
  - descriptions ([string])
  - nextButton (string)

  ### document ###

  This is the document capture step. Users will be asked to select the document type and to provide images of their selected documents. They will also have a chance to check the quality of the images before confirming. The custom options are:

  - useWebcam (boolean - note that this is an *experimental* beta option)

  ### face ###

  This is the face capture step. Users will be asked to provide face images of themselves. They will also have a chance to check the quality of the images before confirming. No customisation options are available for this step.

  ### complete ###

  This is the final completion step. You can use this to inform your users what is happening next. The custom options are:

  - message (string)
  - submessage (string)

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

## Creating checks

This SDK’s aim is to help with the document capture process. It does not actually perform the full document/face checks against our [API](https://documentation.onfido.com/).

In order to perform a full document/face check, you need to call our [API](https://documentation.onfido.com/) to create a check for the applicant on your backend

### 1. Creating a check

With your API token and applicant id (see [Getting started](#getting-started)), you will need to create an *express* check by making a request to the [create check endpoint](https://documentation.onfido.com/#create-check). If you are just verifying a document, you only have to include a [document report](https://documentation.onfido.com/#document-report) as part of the check. On the other hand, if you are verify a document and a face photo, you will also have to include a [facial similarity report](https://documentation.onfido.com/#facial-similarity).

```shell
$ curl https://api.onfido.com/v2/applicants/YOUR_APPLICANT_ID/checks \
    -H 'Authorization: Token token=YOUR_API_TOKEN' \
    -d 'type=express' \
    -d 'reports[][name]=document' \
    -d 'reports[][name]=facial_similarity'
```

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
