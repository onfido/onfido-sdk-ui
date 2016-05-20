# Onfido JS SDK View Layer

## Important note

*This code is unfinished and actively being worked on.* It should therefore not be used in a live environment.

## [Overview](#overview)

This library is a plug-and-play view layer that leverages the Onfido SDK core, helping users take document and face captures that can then be sent to our backend APIs.

The library uses WebSockets and the [getUserMedia API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) (where supported) to capture via a user’s webcam, falling back to a file upload for unsupported browsers. The `accept="image/*"` attribute is used to give the option to take a photo using the native capture methods on handheld devices. Document captures are sent over WebSockets to our document checking API, to ensure your users are submitting a valid document.

To initialise the plugin, a connection to our WebSocket endpoint is required. Connections are authorised using [JWTs](https://jwt.io/), which can be generated on your server, or fetched from our JWT endpoint. Read about how to do this in the [authentication section](#authentication) below.

## [Authentication](#authentication)

Clients are authenticated using JSON Web Tokens (JWTs). The tokens are one use only and expire after 30 minutes. See [here](https://jwt.io/) for details of how JWTs work.

You need a new JWT each time you initialize the SDK. You can obtain a JWT in two ways:

### Onfido's API

The Onfido [API](https://onfido.com/documentation) exposes a JWT endpoint. See the API [documentation](https://onfido.com/documentation#json-web-tokens) for details.

### Generate your own

You can generate your own JWTs.

- **Algorithm:** `HS256`.
- **Secret:** Your Onfido API key.

#### Payload

The payload is **not** encrypted. Do **not** put your API key in the payload.

The payload keys are case sensitive and should all be lowercase.

- `exp`: The expiry time - UNIX time as an integer. This must be less than 30 minutes in the future.
- `jti`: The one-time use unique identifier string. Use a 64 bit random string to avoid collisions. E.g. `"JTiYyyRk3w8"`
- `uuid`: A unique ID that identifies your API token in our database. This can be shared publicly and is **not** the same as your API Token. We will provide you with your uuid on request.
