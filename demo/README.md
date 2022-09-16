# Onfido SDK Sample App

## Overview

The purpose of this app is to show how to use the Onfido JavaScript SDK by use of the npm module.
By use of script tags you can see the example in the
[SDK repo here](https://github.com/onfido/onfido-sdk-ui).

## Run the app

Firstly, clone the project and run `npm install`. There're two ways to run the demo app:
The vanilla way & the React way.

### The vanilla way

- Start with `npm run start:vanilla`
- Access it via HTTPS: `https://localhost:8010`
- The app is located at `vanilla/index.js`

### The React way

- Start with `npm run start:react`
- Access it via HTTPS: `https://localhost:8020`
- The app is located at `react/src/index.js`

## Build the app

### The vanilla way

- Bundle with `npm run build:vanilla`
- The production bundle is located at `vanilla/bin`

### The React way

- Bundle with `npm run build:react`
- The production bundle is located at `react/build`

## Internals

- The `getToken` function will send a request to an internal Onfido service
  called `sdk-token-factory` that generates JWTs that allows internal contributors to test the app.
- In a real-life integration, the JWT would have to be requested from the host app server,
  which will then serve it to its front-end before initialising the SDK.
