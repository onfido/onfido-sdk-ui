# Premium Enterprise Features

## Table of contents

- [Customized API Requests](#customized-api-requests)
- [Callbacks Overview](#callbacks-overview)
- [Cross device URL](#cross-device-url)

The following features must be enabled for your account before they can be used. For more information, please contact your Onfido Solution Engineer or Customer Success Manager.

## Customized API Requests

This premium enterprise feature enables you to control the data collected by the Onfido SDK by using callbacks that are invoked when the end user submits their captured media. The callbacks provide all of the information that would normally be sent directly to the Onfido API and expect a promise in response that controls what the SDK does next.

Before the feature can be used, it must be enabled for your account. Once enabled, you will need to set `useCustomizedApiRequests` to `true` and provide the callbacks for `onSubmitDocument`, `onSubmitVideo`, `onSubmitSelfie` within the `enterpriseFeatures` block of the configuration options. Note: The callback for video is not supported yet.

```javascript
Onfido.init({
  // Other options here
  enterpriseFeatures: {
    useCustomizedApiRequests: true,
    onSubmitDocument: (documentData) => {
      // Your callback code here
    },
    onSubmitSelfie: (selfieData) => {
      // Your callback code here
    },
    onSubmitVideo: (videoData) => {
      // Your callback code here
    },
  },
})
```

To enable callbacks on the cross-device flow you must also host the cross-device experience of the Onfido SDK yourself. This can be done using the [cross device URL](#cross-device-url) premium enterprise feature. Once you have a server with the Onfido Web SDK installed and set up you must initialize the SDK with `mobileFlow: true` as well as the callbacks and `useCustomizedApiRequests` options shown above.

### Callbacks Overview

The callbacks return a FormData object, including the information that the SDK would send to Onfido. The callbacks are invoked when the end user confirms their image through the user interface. The request will not be sent to Onfido unless requested in the response.

**onSubmitDocument FormData Paramaters**

```javascript
{
  file: blob,
  side: string,
  type: string,
  sdk_validations: object,
  sdk_source: string,
  sdk_version: string,
  sdk_metadata: object,
}
```

**onSubmitSelfie FormData Paramaters**

```javascript
{
  file: blob,
  snapshot: blob,
  sdk_source: string,
  sdk_version: string,
  sdk_metadata: object,
}

```

**onSubmitVideo FormData Paramaters**

```javascript
{
  file: blob,
  challenge:  { type: 'recite' / 'movement', query: number[] / string }
  challenge_id: string,
  challenge_switch_at: number, // seconds
  languages: { source: 'sdk', language_code: string }
  sdk_source: string,
  sdk_version: string,
  sdk_metadata: object,
}
```

#### Allowing the SDK to upload data to Onfido

If you would like the SDK to upload the user-submitted data directly to Onfido you can resolve the promise with an object containing `continueWithOnfidoSubmission: true`

```javascript
onSubmitDocument: (data) => {
  // Note: data is a FormData object, to view the contents you can use:
  for(const [key, value] of data.entries()) {
    console.log('data (key,value): ', key, value);
  }

  // Send data to your backend then resolve promise,
  return Promise.resolve({ continueWithOnfidoSubmission: true })
})
```

#### Providing the SDK with the Onfido response

You can choose to upload the data to Onfido yourself from your backend. We strongly recommend that you add all of the data provided to you through the callbacks in your request to the appropriate endpoint - `/documents` or `/live_photos`. Additionally, you should use the SDK token created for each applicant in the `Authorization` header of the request as shown below. Note: The SDK token is not included in the FormData provided by the callbacks. You may want to append this, or a different unique identifier that is mapped to the applicant's SDK token, on your backend before sending it off.

```text
Authorization: Bearer <SDK token here>
```

Once you have sent the request to Onfido yourself, you can supply the SDK with the response so it can determine what the end user should be presented with. In the case where a success response is received, the promise should be resolved with `onfidoSuccessResponse: <onfidoResponse>`. Otherwise reject the promise with the Onfido error response.

Note: An error response could be returned due to image quality issues. In this case, the SDK will present the end user with the appropriate error message.

```javascript
onSubmitDocument: (data) => {
  // Send request to Onfido API /documents via your backend proxy
  .then(onfidoSuccessResponse =>
    Promise.resolve({ onfidoSuccessResponse: <onfidoResponse> }))
  .catch(onfidoError => Promise.reject(onfidoError))
}
```

This is a sample openAPI YAML file you could use as an example to start your own proxy.

```yaml
openapi: 3.0.0
info:
  title: Network decouple back-end sample
  description: Network decouple back-end setup skeleton
  version: '1.0'
  contact: {}
tags: []
servers: []
components:
  schemas:
    IDocumentsRequest:
      type: object
      properties:
        file:
          type: string
          format: binary
          description: Uploaded document. Passed in from the web SDK callback.
        type:
          type: string
          default: passport
          description: >-
            The type of document that was submitted. Passed in from the web SDK
            callback.
        side:
          type: string
          default: front
          description: >-
            The type side of the document that was submitted. Passed in from the
            web SDK callback.
        sdk_metadata:
          type: object
          description: >-
            The metadata that web SDK collects. Forward this to Onfido API
            without modifications. Passed in from the web SDK callback.
        sdk_validations:
          type: object
          description: >-
            This is a an object used by web SDK to seek image quality feedback
            from the API. Forward this object without modifications to Onfido
            API. Passed in from the web SDK callback.
        sdk_source:
          type: string
          default: onfido_web_sdk
          description: >-
            The source of origin of the requests. Forward this without
            modifications to the Onfido API. Passed in from the web SDK callback.
        sdk_version:
          type: string
          description: >-
            The SDK version. Forward this without modifications to the Onfido
            API. Passed in from the web SDK callback.
    IMultiFrameSelfieRequest:
      type: object
      properties:
        file:
          type: string
          format: binary
          description: Uploaded photo
        sdk_metadata:
          type: object
          description: >-
            The metadata that web SDK collects. Forward this to Onfido API
            without modifications. Passed in from the web SDK callback.
        sdk_source:
          type: string
          default: onfido_web_sdk
          description: >-
            The source of origin of the requests. Forward this without
            modifications to the Onfido API. Passed in from the web SDK callback.
        sdk_version:
          type: string
          description: >-
            The SDK version. Forward this without modifications to the Onfido
            API. Passed in from the web SDK callback.
        snapshot:
          type: string
          format: binary
          description: Uploaded snapshot taken by the Web SDK to improve fraud analysis.
paths:
  /onfido/v3.3/documents:
    post:
      operationId: OnfidoController documents
      parameters:
        - name: Auhorization
          in: header
          description: Customer back-end Authentication token
          schema:
            type: string
      requestBody:
        required: true
        description: The API endpoint to intercept the document upload from the Web SDK
        content:
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/IDocumentsRequest'
      responses:
        '200':
          description: >-
            The response received from Onfido v3.3/documents API call. The
            response format might slightly vary with the use case. Forward it
            without modifications as the callback response.
          content:
            application/json:
              schema:
                properties:
                  id:
                    type: string
                    format: uuid
                  created_at:
                    type: string
                    format: date-time
                  file_name:
                    type: string
                  file_size:
                    type: integer
                  file_type:
                    type: string
                  type:
                    type: string
                  side:
                    type: string
                  issuing_country:
                    type: string
                  applicant_id:
                    type: string
                  href:
                    type: string
                  download_href:
                    type: string
                  sdk_warnings:
                    type: object
        '201':
          description: ''
          content:
            application/json:
              schema:
                type: object
        '422':
          description: ''
          content:
            application/json:
              schema:
                properties:
                  error:
                    type: object
                    properties:
                      type:
                        type: string
                      message:
                        type: string
                  fields:
                    type: object
  /onfido/v3/live_photos:
    post:
      operationId: OnfidoController
      parameters:
        - name: Auhorization
          in: header
          description: Customer back-end Authentication token
          schema:
            type: string
      requestBody:
        required: true
        description: The API endpoint to intercept the live photos upload from the Web SDK
        content:
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/IMultiFrameSelfieRequest'
      responses:
        '200':
          description: >-
            The response received from Onfido v3/live_photos API call. The
            response format might slightly vary with the use case. Forward it
            without modifications as the callback response.
          content:
            application/json:
              schema:
                properties:
                  id:
                    type: string
                    format: uuid
                  created_at:
                    type: string
                    format: date-time
                  file_name:
                    type: string
                  file_type:
                    type: string
                  file_size:
                    type: integer
                  href:
                    type: string
                  sdk_source:
                    type: string
                  sdk_version:
                    type: string
                  download_href:
                    type: string
        '201':
          description: ''
          content:
            application/json:
              schema:
                type: object
```

## Cross device URL

This premium enterprise feature allows you to specify your own custom or whitelabel url that the cross device flow will redirect to instead of the Onfido default `id.onfido.com`. To use this feature generate an SDK token as shown below and use it to start the SDK.

```shell
$ curl https://api.onfido.com/v3/sdk_token \
 -H 'Authorization: Token token=YOUR_API_TOKEN' \
 -F 'applicant_id=YOUR_APPLICANT_ID' \
 -F 'referrer=REFERRER_PATTERN' \
 -F 'cross_device_url=YOUR_CUSTOM_URL'
```

In addition to this, you must either:

- Set up a server to forward the incoming HTTP request, including the path, to `https://id.onfido.com`
- Set up a server to host the Onfido Web SDK yourself at the provided URL

### Set up a server to forward the incoming HTTP request, including the path, to `https://id.onfido.com`

You can do this by setting up a server as a reverse proxy so that the URL that the end-user sees is your selected URL but the content shown is the Onfido-hosted Web SDK.

An example set-up for a minimal nginx server using docker:

nginx.conf

```nginx
server {
  # Change the next 2 lines as needed
  listen       80;
  server_name  localhost;

  location / {
    # This forwards the path to Onfido and is the only change
    # necessary when working with the default nginx configuration
    proxy_pass https://id.onfido.com;
  }
}
```

dockerfile

```docker
FROM nginx:1.15.8-alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
```

### Set up a server to host the Onfido Web SDK yourself at the provided URL

This server must use the same version of the Onfido Web SDK and must initialize the SDK with `Onfido.init({ mobileFlow: true })`. All other configuration options, except for callbacks provided for the `useCustomizedApiRequests` feature, will be provided by your original instance of the Onfido Web SDK.

This is an example of how you could host the Onfido Web SDK with minimal setup, but it does not have to be done this way. This example involves using docker and an nginx image to serve an html file which starts the Onfido Web SDK using just the minified js and css files from the dist directory. (`onfido-sdk-ui/dist/onfido.min.js` and `onfido-sdk-ui/dist/style.css`)

To help with getting the correct version of the Web SDK, we append the Onfido files with the base32 version that is associated with each release. This value can be obtained from the first 2 characters in the appended path when using the cross-device flow. For example, if the current release appends a path that starts with `BW` we would rename the minified files `BW-onfido.min.js` and `BW-style.css` for this example to work.

File structure for this minimal example

```text
- dist
  - <BASE32>-onfido.min.js
  - <BASE32>-style.css
- dockerfile
- nginx.conf
- index.html
```

dockerfile

```docker
FROM nginx:1.15.8-alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY ./index.html /usr/share/nginx/html/

COPY ./dist /usr/share/nginx/sdk/
```

nginx.conf

```nginx
server {
  # Change the next 2 lines as needed
  listen       80;
  server_name  localhost;

  location ~ ^/[0-9a-zA-Z]+$ {
    root   /usr/share/nginx/html;
    try_files $uri /index.html =404;
  }

  location ~* \.(js|jpg|png|css)$ {
    root /usr/share/nginx/sdk/;
  }
}
```

index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta
      charset="utf-8"
      name="viewport"
      content="width=device-width, initial-scale=1"
    />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="format-detection" content="telephone=no" />
    <title>Onfido Verification</title>
    <style type="text/css">
      html,
      body {
        height: 100%;
        margin: 0;
      }
      body,
      button {
        -webkit-font-smoothing: antialiased;
      }
      @media (min-width: 30em) {
        #onfido-mount {
          position: relative;
          top: 10%;
        }
        .onfido-sdk-ui-Modal-inner {
          font-family: 'Open Sans', sans-serif !important;
        }
      }
    </style>
    <script type="text/javascript">
      var version = window.location.pathname.substring(1, 3)
      var jsPath = version + '-onfido.min.js'
      var cssPath = version + '-style.css'

      var link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = cssPath

      var script = document.createElement('script')
      script.onload = function () {
        window.onfidoOut = Onfido.init({ mobileFlow: true })
      }
      script.src = jsPath

      document.head.appendChild(link)
      document.head.appendChild(script)
    </script>
  </head>

  <body>
    <div id="onfido-mount"></div>
  </body>
</html>
```

## Crossdevice SDK options

- `customUI` - Apply UI customisation to the crossDevice instance. If supplied, the crossdevice customUI will take president over the one specified in the main SDK instance.
