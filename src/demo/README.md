# JS SDK Demo App

This Demo app gets built when running `npm run dev` - it is meant only to easily
preview the JS SDK quickly and easily

## `updateOptions`

A global `updateOptions` function is bound to the window, to allow dynamic passing
in of custom SDK options, if the sidebar isn't precise enough.

## Query params

You can put in query params to quickly configure the SDK as you like. You can
see the params that have an impact easily in `getInitSdkOptions`, in the
`demoUtils.js` file.
