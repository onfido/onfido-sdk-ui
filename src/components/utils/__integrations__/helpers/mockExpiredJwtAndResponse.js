export const EXPIRED_JWT_TOKEN =
  'eyJhbGciOiJFUzUxMiJ9.eyJleHAiOjE2NDUxMTQ3MDYsInBheWxvYWQiOnsiYXBwIjoiYmQ3NzMzOGYtYWI5MC00N2JjLThmNTMtNDA0N2ExMTA4NWJmIiwiY2xpZW50X3V1aWQiOiJjZTY5ZjE4Zi04MDA2LTQyM2QtYWZkYS1mY2FmZjBkZTIxNTQiLCJpc19zYW5kYm94IjpmYWxzZSwicmVmIjoiKjovLyovKiIsInNhcmRpbmVfc2Vzc2lvbiI6IjY2ZjZiNjI4LWQ0N2ItNDhkZS1hMWFlLTkwZmQwY2JlOWQxNSJ9LCJ1dWlkIjoiYnE5WmxmLW5kY0IiLCJlbnRlcnByaXNlX2ZlYXR1cmVzIjp7ImNvYnJhbmQiOnRydWUsImxvZ29Db2JyYW5kIjp0cnVlLCJoaWRlT25maWRvTG9nbyI6dHJ1ZSwiZGlzYWJsZU1vYmlsZVNka0FuYWx5dGljcyI6dHJ1ZX0sInVybHMiOnsidGVsZXBob255X3VybCI6Imh0dHBzOi8vdGVsZXBob255Lm9uZmlkby5jb20iLCJkZXRlY3RfZG9jdW1lbnRfdXJsIjoiaHR0cHM6Ly9zZGsub25maWRvLmNvbSIsInN5bmNfdXJsIjoiaHR0cHM6Ly9zeW5jLm9uZmlkby5jb20iLCJob3N0ZWRfc2RrX3VybCI6Imh0dHBzOi8vaWQub25maWRvLmNvbSIsImF1dGhfdXJsIjoiaHR0cHM6Ly9hcGkub25maWRvLmNvbSIsIm9uZmlkb19hcGlfdXJsIjoiaHR0cHM6Ly9hcGkub25maWRvLmNvbSJ9fQ.MIGHAkIBfuA8iir66_fd5iXTbZIBPXYPJ5yTrbiSwiMQi5wLLM1L9FS3xuyOFtKprebFLMJyzhXufmtgWgfgPcPSi7GrI28CQVjGdUokkdNP6PqzEWluaJA49AaWuWXQzM7gC_E7lHuLbOQa0gXGgHgKgTTAypGDBRU_GfzX_WYHfZJwmvMElOkh'

export const ASSERT_EXPIRED_JWT_ERROR_OBJECT = {
  status: 401,
  response: {
    error: {
      fields: {},
      message: 'The token has expired, please request a new one',
      type: 'expired_token',
    },
  },
}

export const ASSERT_EXPIRED_JWT_ERROR = (done, error) => {
  try {
    expect(error).toEqual(ASSERT_EXPIRED_JWT_ERROR_OBJECT)
    done()
  } catch (err) {
    done(err)
  }
}
