# Webtest

The end to end tests are written in java using on [TestNG](https://testng.org/doc/). A common part of testing is moved
to the [Webtest library](https://github.com/it-ony/webtest).

The tests are bootstrapping the web-sdk as part of the test run.

# Executing tests

Tests can be executed against local or remote browsers. The behavior is controlled by the system property `local` which
is a boolean. Properties can either be controlled via the `-D` argument of the jvm, or more easily via the properties
files in the [resources](/test/webtest/src/test/resources) folder. The resource folder is scanned and properties are
taken in the following order:

* local
* ENVIRONMENT-REGION
* REGION
* ENVIRONMENT
* common

where `ENVIRONMENT` and `REGION` are based on the system properties named `environment` and `region`. By default, the
environment is `DEV` and region is `EU`.

A best practice for local testing is to create a `local.properties` file and put the local test properties into it.

```properties
local=true
```

## Local testing

Set the property `local=true`. Local testing will spin up a browser instance locally. 
Change browsers by setting the property with, for example, `browser=firefox`.

To execute the tests locally you need

* Java 11. Set `$JAVA_HOME` environment variable in your path
* Maven, which you can install via `brew install maven`
* Docker and docker-compose

## Remote testing

Tests can be also executed against a remote grid by setting the system property `local=false` and specifying a gridUrl
as a property pointing to a remote grid.

For testing against browserstack the gridUrl will be composed automatically, if the properties `browserstack.username`
and `browserstack.accessKey` or the environment variables `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` are
specified.

## Running the tests

The tests are by default executed against a test server under the url `http://localhost:8081/local/`. The url can be
controlled with the property `baseUrl`. By doing so, we can run the tests also against the live web-sdk.

The test-server can be started via `npm run test-server`. It will build the sdk, copy the dist output, build a docker
and start the container with docker-compose. Make sure you have docker running on your system.

```shell
npm run test-server && docker-compose up --build
```

If you anyway have the web-sdk running in development mode `npm run dev`, you can skip the building and run the test
server with the command below instead

```shell
npm run test-server:prepare && docker-compose up --build
```

Tests can be run from the IDE directly or via maven. For running from the IDE just press the play button next to the
test. A maven run can be triggered via `mvn verify`. In maven, you can specify the tests to be included by the `it.test`
property, see this [documentation](https://maven.apache.org/surefire/maven-failsafe-plugin/examples/single-test.html).

# Write a test

The test class should be placed in [webtest/src/test/java] and be named `<something>IT.java`. Tests are written as
methods that are annotated with `@Test`.

## Bootstrap the SDK

The tests itself bootstrap the SDK. The following snipped is the minimal bootstrapping code

```java
onfido().init();
```

which, will invoke the following default parameters

```java
withSteps("welcome", "document");
put("containerId", "root"); 
```

### Controlling the steps

The SDK steps can be controlled with the `.withSteps` method, which takes a list of either strings or objects that 
can be serialized. E.g. a document step can be setup either with "document" or as a complex object with 

```java
onfido().withSteps(
    "welcome",
    new DocumentStep()
        .withDocumentType(DRIVING_LICENCE,new DocumentStep.Option("ESP"))
        .withDocumentType(IDENTITY_CARD,new DocumentStep.Option("MYS"))
        .withDocumentType(RESIDENT_PERMIT,new DocumentStep.Option(null))
    ).init()
``` 
                                              
will result in an SDK bootstrapping of

```js
Onfido.init({
    "language": "en_US",
    "containerId": "root",
    "steps": ["welcome", {
        "type": "document",
        "options": {
            "documentTypes": {
                "national_identity_card": {
                    "country": "MYS"
                },
                "driving_licence": {
                    "country": "ESP"
                },
                "residence_permit": {
                    "country": null
                }
            }
        }
    }],
    "token": "..."
})
```

which will result 
