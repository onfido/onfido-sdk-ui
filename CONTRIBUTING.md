## Contributors guidelines
 
### Getting started
To start contributing to the Onfido Web SDK, clone this repository and run the following commands:
 
- `npm install` to install the project dependencies
- `npm run dev` to generate the build and run the dev server
 
The SDK will be running on https://localhost:8080.
 
Note: The SDK runs on `https`, which is needed to support the camera functionality.
 
You can also run it using `docker` and `docker-compose` by running the following command: `docker-compose -f docker-compose.dev.yml up`.
 
### Testing
The Web SDK has a large coverage of UI tests. To set up your environment, please refer to the [testing guidelines](./test/TESTING_GUIDELINES.md).
Once your environment is ready, you can run UI tests by running `npm run build:test && npm run travis && npm run test:ui`.
The Web SDK has partial coverage of unit tests that can be executed with `npm run test`.
You can also run a type checker and linter by running `npm run check`.
 
### Contributing
When creating a new branch, contributors should use the following convention `{task-type}/{task-description}-{ticket-number}`.
The most used task types are `feature`, `fix` or `improvement`. The ticket number is optional and is only expected from internal contributors.
 
For more details, check out the [pull request checklist](./.github/PULL_REQUEST_TEMPLATE.md).
 
In order to merge your Pull Request, you should get an approval from 2 Onfido team members. For internal contributors, all the PR checks must pass, while for any contributor external to the Onfido team the PR checks will always fail.
 
The current Pull Request checks are
- Bundlesize - A tool that monitors the SDK size increase
- Travis CI - Our continuous integration tool
 
At build time, our CI runs the following tests:
- UI
- Unit
- Type checker
- Linter
- Dependencies vulnerability detection
 
All of the above must have passed in order for the build to succeed.
 
### Internationalization
 
The SDK supports several languages. To pull the translations from our localisation service run `npm run lokalise:download`.
Every time you add, remove or edit a translation key or value, please remember to update [MIGRATION.md](MIGRATION.md) with the relevant key, so that the integrators that use language customisation can keep track of language changes. These changes will result in a MINOR version release.
 
### Accessibility
The Onfido SDK team values accessibility. Please make sure that your code is accessible 
by following the [Web Content Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/) and by adding [automated accessibility tests](test/utils/accessibility.js) for any new screen.

### Private environment variables

In order to run the Web SDK demo app or to run development scripts locally as an internal contributor you will need the following environment variables:
- `$LOKALISE_TOKEN`
- `$LOKILISE_PROJECT_ID`
- `$SDK_TOKEN_FACTORY_SECRET`

Please speak to a member of the Onfido SDK team to obtain them.

### Releases


### Troubleshooting
 
If you are testing on Internet Explorer, you might see errors when opening localhost due to bugs in `webpack-dev-server` dependencies. As a workaround you can run `npm run build && npm run travis` instead of `npm run dev`.

 
Thank you so much for contributing! :heart: :heart: :heart:
 
The Onfido SDK Team