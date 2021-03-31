export const Config = (function () {
  // -------------------------------------
  // REQUIRED
  // Available at https://dev.facetec.com/#/account
  // NOTE: This field is auto-populated by the FaceTec SDK Configuration Wizard.
  const device_key_identifier = 'dI6BscHk3fuQIIHWuZdKKq6V233LqiAs'

  // -------------------------------------
  // REQUIRED
  // The URL to call to process FaceTec SDK Sessions.
  // In Production, you likely will handle network requests elsewhere and without the use of this variable.
  // See https://dev.facetec.com/#/security-best-practices?link=zoom-server-rest-endpoint-security for more information.
  // NOTE: This field is auto-populated by the FaceTec SDK Configuration Wizard.
  const BaseURL = process.env.OLD_AUTH

  // -------------------------------------
  // REQUIRED
  // The FaceMap Encryption Key you define for your application.
  // Please see https://dev.facetec.com/#/licensing-and-encryption-keys for more information.
  // NOTE: This field is auto-populated by the FaceTec SDK Configuration Wizard.
  const public_key =
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5PxZ3DLj+zP6T6HFgzzk\n' +
    'M77LdzP3fojBoLasw7EfzvLMnJNUlyRb5m8e5QyyJxI+wRjsALHvFgLzGwxM8ehz\n' +
    'DqqBZed+f4w33GgQXFZOS4AOvyPbALgCYoLehigLAbbCNTkeY5RDcmmSI/sbp+s6\n' +
    'mAiAKKvCdIqe17bltZ/rfEoL3gPKEfLXeN549LTj3XBp0hvG4loQ6eC1E1tRzSkf\n' +
    'GJD4GIVvR+j12gXAaftj3ahfYxioBH7F7HQxzmWkwDyn3bqU54eaiB7f0ftsPpWM\n' +
    'ceUaqkL2DZUvgN0efEJjnWy5y1/Gkq5GGWCROI9XG/SwXJ30BbVUehTbVcD70+ZF\n' +
    '8QIDAQAB\n' +
    '-----END PUBLIC KEY-----'

  const production_key_text = process.env.AUTH_PUBLIC_TEXT
  return {
    device_key_identifier,
    BaseURL,
    public_key,
    production_key_text,
  }
})()
