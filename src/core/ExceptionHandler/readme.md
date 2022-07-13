##### **_Owner: SDK Infrastructure_**

# Exception Handler

## Goal

- Capture all unexpected and uncontrolled errors
- Capture all intended and controlled errors
- Provide an interface to capture errors
- Provide an `<ErrorBoundary/>` that catches unexpected exceptions and provides an optional fallback render
- Send all collected data to Sentry

### Services:

- [Sentry](https://sentry.io/) (3rd party)

## Import

```ts
// Methods
import { install, uninstall, captureException, wrapInTryCatch, addBreadcumb } from '~core/ExceptionHandler'

// Components
import { ErrorBoundary } from '~core/ExceptionHandler`
```

## API

### captureException

Capture an error with optional additional data.

```tsx
captureException(
  error?: Error,
  data?: Record<string, unknown>

  // Injected at build time
  file?: string
  method?: string
  lineNumber?: string
) => void
```

### addBreadcumb

The module tracks a breadcrumb queue with provided events and information to provide additional information to an error

The queue is global and the whole queue (up to that point) will be sent along with every error.

```tsx
addBreadcrumb({
  level?: 'info' | 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug' // default: 'info'
  message: string,
  data?: Record<string, unknown>
}) => void
```

### wrapInTryCatch

Wrap a function in a try-catch to automatically handle unexpected errors

```tsx
wrapInTryCatch(
  fn: (...args: any) => any
) => any
```

### install

> Handled by WebSDK automatically

```tsx
install({
  useGlobalListeners: boolean, // default: false
})
```

### uninstall

> Handled by WebSDK automatically

Closes connection with Sentry and stops capturing errors and breadcrumbs

```tsx
uninstall()
```

## Module developer guide

This module includes a couple of specific workarounds

**Integration differences**
The WebSDK is integrated in different ways by our customers, causing a range of issues for error tracking

Our customers integrate our WebSDK in the following ways:

- Bundled by us (dist or CDN)
- Bundled by them (lib) using their bundle setup

### Issues:

#### Unreliable & missing source maps

We do upload our source map to Sentry in the release process but we can't upload or provide us with their re-bundled version of the source map.

##### Solutions:

We want to keep a reasonable amount of recognition points in our minified bundle to make sense of stack traces:

We do this by:

- Don't minify function names or class names in our bundle
- We inject method name, filename and lineNumber for all `captureException()` methods at build time

**_Build time injections_**
We inject origin info (`name: string, filename: string, lineNumber: string`) as additional arguments to every `captureException()` in our code base at build time. Excluding developer hot reload.

We do this by using `morph-ts` that allow us to read and search through the AST (abstract syntax tree). See `build/morph/ExceptionHandler.injection.js`

#### Fingerprinting

Sentry uses something called fingerprinting to organize and group reported errors. They use the errors stack trace to accomplish this.

As our stack traces are unreliable (due to client integrations) Sentry has a hard time grouping errors together.

To help Sentry we implement our own fingerprinting by using the injected origin info. This works for errors captured by `captureException` but not by our ErrorBoundary as they are uncaught exceptions without origin injection.
