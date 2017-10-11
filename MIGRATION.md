# # Onfido SDK UI Migration Guide

## `1.1.0` -> `2.0.0`

### Breaking changes

- Removed `onDocumentCapture` that used to be fired when the document had been successfully captured, confirmed by the user and uploaded to the Onfido API
- Removed `onFaceCapture` callbacks that used to be fired when the face has beed successfully captured, confirmed by the user and uploaded to the Onfido API.
- Removed `getCaptures` function that used to return the document and face files captured during the flow.
- Changed the behaviour of `onComplete` callback. It used to return an object that contained all captures, now it doesn't return any data.

### Example of old behaviour

```js
Onfido.init({
  token: 'YOUR_JWT_TOKEN',
  containerId: 'onfido-mount',
  onDocumentCapture: function(data) {
    /*callback for when the*/ console.log("document has been captured successfully", data)
  },
  onFaceCapture: function(data) {
    /*callback for when the*/ console.log("face capture was successful", data)
  },
  onComplete: function(capturesHash) {
    console.log("everything is complete")
    // data returned by the onComplete callback including the document and face files captured during the flow
    console.log(capturesHash)
    // function that used to return the document and face files captured during the flow.
    console.log(Onfido.getCaptures())
  }
})
```

### Example of new behaviour

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
