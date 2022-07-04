# Modules

A module is an independend piece of code, with a consitent and versioned api, to help implement a specific set of use cases.

## Modules

> Note: Most modules are still WIP

- Analytics
- Performance analytics
- Api analytics
- Logger
- Network

### FAQ:

##### Module vs core

- **Module**: Everything in `/modules/*` is independend and could be published as NPM package and easily used in other projects.
- **Core**: Everything in `/src/core` is tightly coupled to our WebSDK, it could use one or more modules or implement a custom piece of code.
