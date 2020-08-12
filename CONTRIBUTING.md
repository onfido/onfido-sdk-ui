## Contributors guidelines

### Getting started

To start contributing to the Onfido Web SDK, clone this repository and run the following commands:

- `npm install` to install the project dependencies
- `npm run dev` to generate the build and run the dev server

The SDK will be running on https://localhost:8080.

Note: The SDK runs on `https`, which is needed to support the camera functionality.

You can also run it using `docker` and `docker-compose` by running the following command: `docker-compose -f docker-compose.dev.yml up`.

### Private environment variables

_This section applies to internal contributors only._

In order to run the Web SDK demo app or to run development scripts locally as an internal contributor you will need the following environment variables:

- `$LOKALISE_TOKEN`
- `$LOKALISE_PROJECT_ID`
- `$SDK_TOKEN_FACTORY_SECRET`

Please speak to a member of the Onfido SDK team to obtain them. To use these variables in the Web SDK, add them to your local `PATH` and run `npm run build`.

### Contributing

When creating a new branch, contributors should use the following convention `{task-type}/{task-description}-{ticket-number}`.
The most used task types are `feature`, `fix` or `improvement`. The ticket number is an optional reference to our internal ticketing system.
If your pull request is related to a GitHub issue, please reference the issue in your PR description.

For more details, check out the [pull request checklist](./.github/PULL_REQUEST_TEMPLATE.md).

In order to merge your pull request, you should get an approval from 2 Onfido team members.

The current pull request checks are

- Bundlesize - A tool that monitors the SDK size increase
- Travis CI - Our continuous integration tool

This project uses the following linters:

- eslint
- stylelint

A Prettier config has been set up for this project and it is recommended to set your IDE to run Prettier on save if possible.

At build time, our CI runs the following tests:

- UI
- Unit
- Type checker
- Linter
- Dependencies vulnerability detection

All of the above must have passed in order for the build to succeed. Please note that the CI relies on encrypted variables to run tests therefore the build will only be executed if the pull request has been created by an internal contributor and it will always fail for pull requests from external contributors.
For internal contributors, all the PR checks must pass.

### Testing

The Web SDK has a large coverage of UI tests. To set up your environment, please refer to the [testing guidelines](./test/TESTING_GUIDELINES.md).
Once your environment is ready, you can run `npm run build:test && npm run travis` to create the build and start up the server, and `npm run test:ui` to run the UI tests.
The Web SDK has partial coverage of unit tests that can be executed with `npm run test`.
You can also run a type checker and linter by running `npm run check`.
You should also manually test any change in all the supported browsers, both on desktop and mobile. To facilitate this process, every time a new pull request is created, a new demo app link will be generated. If you don't have enough devices to test your changes, you can perform manual tests on different devices on Browserstack.

### Internationalization

_This section applies to internal contributors only._

The SDK supports several languages. To pull the translations from our localisation service run `npm run lokalise:download`.
Every time you add, remove or edit a translation key or value, please remember to update [MIGRATION.md](MIGRATION.md) with the relevant key, so that the integrators that use language customisation can keep track of language changes. These changes will result in a MINOR version release.

### Accessibility

The Onfido SDK team values accessibility. Please make sure that your code is accessible
by following the [Web Content Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/) and by adding [automated accessibility tests](test/utils/accessibility.js) for any new screen.

### Releases

In order to perform a release, please follow the guidelines within [this document](release/RELEASE_GUIDELINES.md).

### Previewer

Different SDK configuration options can be tested manually inside the previewer that can be found by using the `/previewer` path. E.g. https://localhost:8080/previewer.
Some of the SDK configuration options can also be previewed in the demo app by using the following query strings:

| QueryString                | Values              | Default | Description                                                      |
| -------------------------- | ------------------- | ------- | ---------------------------------------------------------------- |
| `liveness`                 | `true`,`false`      | `false` | Enable liveness video feature for the `face` step                |
| `useMultipleSelfieCapture` | `true`,`false`      | `false` | Enable snapshot feature for the `face` step                      |
| `useModal`                 | `true`,`false`      | `false` | Preview SDK as modal                                             |
| `language`                 | `en`,`es`,`de`,`fr` | `en`    | Preview SDK in a different language                              |
| `useWebcam`                | `true`,`false`      | `false` | Enable the document auto capture feature for the `document` step |
| `poa`                      | `true`,`false`      | `false` | Enable the `poa` flow                                            |
| `oneDoc`                   | `true`,`false`      | `false` | Preselect `passport` as the only document type                   |
| `region`                   | `US`,`CA`,`EU`      | `EU`    | Generate JWT for a supported region with SDK Token Factory       |
| `useHistory`               | `true`,`false`      | `false` | Enable basic dummy host app history                              |

Usage example: https://localhost:8080?liveness=true&language=de
Please refer to [this file](./src/demo/demoUtils.js) for more available options.

### Useful links

Demo app link for the latest release: https://latest-onfido-sdk-ui-onfido.surge.sh

Demo app link for the latest development branch: http://development-branch-onfido-sdk-ui-onfido.surge.sh/

Specific tags can be tested by using the following link format https://2-2-0-tag-onfido-sdk-ui-onfido.surge.sh/

### Troubleshooting

If you are testing on Internet Explorer, you might see errors when opening localhost due to bugs in `webpack-dev-server` dependencies. As a workaround you can run `npm run build && npm run travis` instead of `npm run dev`.

Thank you so much for contributing! :heart: :heart: :heart:

The Onfido SDK Team
