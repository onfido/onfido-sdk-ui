# onfido-sdk-core

Onfido's JavaScript identity verification software development kit.

## Authentication

Clients are authenticated using JSON Web Tokens (JWTs). The tokens are one use only and expire after 30 minutes. See [here](https://jwt.io/) for details of how JWTs work.

You need a new JWT each time you initialize the SDK. You can obtain a JWT in two ways:

#### Onfido's API

The Onfido [API](https://onfido.com/documentation) exposes a JWT endpoint. See the API [documentation](https://onfido.com/documentation) for details. 

#### Generate your own

You can generate your own JWTs.

- **Algorithm:** HS256.
- **Secret:** Your Onfido API Key.

##### Payload

The payload is **not** encrypted. Do **not** put your API key in the payload.

The payload keys are case sensitive and should all be lowercase.

- **exp**: The expiry time - UNIX time as an integer. This must be less than 30 minutes in the future.
- **jti**: The one-time use unique identifier string. Use a 64 bit random string to avoid collisions. E.g. "JTiYyyRk3w8"
- **uuid**: A unique ID that identifies your API token in our database. This can be shared publicly and is **not** the same as your API Token. We will provide you with your uuid on request.
