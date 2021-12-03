export const EXPIRED_JWT_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MDc3MDc1NTEsInBheWxvYWQiOiJycUFvMEtSbXdtWlViWFRLUHp2TXlTaGZtelNDNVhtRWM3aVZ4ZzJ5b2NQbEQrbk9rQmxtcHBaK0FCKzBcbkwveEtYRm4yeTBNZGxNNXRXVE5HeVNVSG5nPT1cbiIsInV1aWQiOiJpd29rRlZlZEcxOCIsImVudGVycHJpc2VfZmVhdHVyZXMiOnsiY29icmFuZCI6dHJ1ZSwiaGlkZU9uZmlkb0xvZ28iOnRydWV9LCJ1cmxzIjp7InRlbGVwaG9ueV91cmwiOiJodHRwczovL3RlbGVwaG9ueS5vbmZpZG8uY29tIiwiZGV0ZWN0X2RvY3VtZW50X3VybCI6Imh0dHBzOi8vc2RrLm9uZmlkby5jb20iLCJzeW5jX3VybCI6Imh0dHBzOi8vc3luYy5vbmZpZG8uY29tIiwiYXV0aF91cmwiOiJodHRwczovL2VkZ2UuYXBpLm9uZmlkby5jb20iLCJvbmZpZG9fYXBpX3VybCI6Imh0dHBzOi8vYXBpLm9uZmlkby5jb20iLCJob3N0ZWRfc2RrX3VybCI6Imh0dHBzOi8veGQub25maWRvLmNvbSJ9fQ.Ece4NQpZLsPzsgd6W4kDYNugW66W_Fl__jfz6d96WEI'

export const EXPECTED_EXPIRED_TOKEN_ERROR = {
  status: 401,
  response: {
    error: {
      fields: {},
      message: 'The token has expired, please request a new one',
      type: 'expired_token',
    },
  },
}

// FIXME: This expected empty response is intended as a temporary solution only to unblock CI builds.
//        API endpoints for /documents, /live_photos, /live_videos was changed with the intention of
//        returning the generic 'authorization_error' response, but currently is only an empty response
//        when received by the SDK on error from the use of an expired token.
//        To be fixed by IX team, see IX-1967
export const TEMP_EMPTY_ERROR = {
  status: 0,
  response: {},
}
