# Web SDK Demo App

This Demo app gets built when running `npm run dev` - it is meant only to easily
preview the Web SDK quickly and easily

## "Previewer" mode

A little wrapper that allows you to try different SDK options etc. quickly and easily exists, too. To reach it, you need to go to https://localhost:8080/previewer

## `updateOptions`

A global `updateOptions` function is bound to the window, to allow dynamic passing
in of custom SDK options, if the sidebar isn't precise enough.

## Query params

You can put in query params to quickly configure the SDK as you like. You can
see the params that have an impact easily in `getInitSdkOptions`, in the
`demoUtils.ts` file.
