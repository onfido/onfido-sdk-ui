#!/bin/bash

# Split on "/", ref: http://stackoverflow.com/a/5257398/689223
REPO_SLUG_ARRAY=(${TRAVIS_REPO_SLUG//\// })
REPO_OWNER=${REPO_SLUG_ARRAY[0]}
REPO_NAME=${REPO_SLUG_ARRAY[1]}

DEPLOY_PATH=./dist

DEPLOY_SUBDOMAIN_UNFORMATTED_LIST=()

echo "TRAVIS_PULL_REQUEST: ${TRAVIS_PULL_REQUEST}"
echo "TRAVIS_TAG: ${TRAVIS_TAG}"

if [ "$TRAVIS_PULL_REQUEST" != "false" ]
then
  if [ "$NODE_ENV" == "production" ]
  then
    DEPLOY_SUBDOMAIN_UNFORMATTED_LIST+=(release-${TRAVIS_PULL_REQUEST}-pr)
  elif [ "$NODE_ENV" == "staging" ]
  then
    DEPLOY_SUBDOMAIN_UNFORMATTED_LIST+=(staging-${TRAVIS_PULL_REQUEST}-pr)
  elif [ "$NODE_ENV" == "test" ]
  then
    DEPLOY_SUBDOMAIN_UNFORMATTED_LIST+=(${TRAVIS_PULL_REQUEST}-pr)
  fi
elif [ -n "${TRAVIS_TAG// }" ] #TAG is not empty
then
  if [ "$NODE_ENV" == "production" ]
  then
    # sorts the Git tags and picks the latest
    # sort -V does not work on the Travis machine
    # sort -V              ref: http://stackoverflow.com/a/14273595/689223
    # sort -t ...          ref: http://stackoverflow.com/a/4495368/689223
    # reverse with sed     ref: http://stackoverflow.com/a/744093/689223
    # git tag regex        explanation and tests: https://regex101.com/r/CjNA8f/4
    # get git tags | match git tag regex pattern (ignore if has any extra label appended, e.g. 3.2.1-rc.1) | sort versions | reverse | pick first line
    # for regex, \d escape for digits does not work in grep       ref: https://askubuntu.com/questions/407053/why-is-my-grep-regex-not-working
    # curly brackets are escaped here for the regex to work in command line
    GIT_TAG_REGEX="^[0-9]\{1,3\}\.[0-9]\{1,2\}\.[0-9]\{1,2\}$"
    LATEST_TAG=`git tag | grep $GIT_TAG_REGEX | sort -t. -k 1,1n -k 2,2n -k 3,3n -k 4,4n | sed '1!G;h;$!d' | sed -n 1p`
    echo "LATEST_TAG: ${LATEST_TAG}"

    if [ "$TRAVIS_TAG" == "$LATEST_TAG" ]
    then
      DEPLOY_SUBDOMAIN_UNFORMATTED_LIST+=(latest)
      sentry-cli --auth-token $SENTRY_AUTH_TOKEN
      sentry-cli releases new $LATEST_TAG --log-level=DEBUG
      sentry-cli releases files $LATEST_TAG upload-sourcemaps ./dist/
    fi

    DEPLOY_SUBDOMAIN_UNFORMATTED_LIST+=(${TRAVIS_TAG}-tag)
  fi
else
  if [ "$NODE_ENV" == "test" ]
  then
    DEPLOY_SUBDOMAIN_UNFORMATTED_LIST+=(${TRAVIS_BRANCH}-branch)
  fi
fi

for DEPLOY_SUBDOMAIN_UNFORMATTED in "${DEPLOY_SUBDOMAIN_UNFORMATTED_LIST[@]}"
do
  # replaces non alphanumeric symbols with "-"
  # sed -r is only supported in linux, ref http://stackoverflow.com/a/2871217/689223
  # Domain names follow the RFC1123 spec [a-Z] [0-9] [-]
  # The length is limited to 253 characters
  # https://en.wikipedia.org/wiki/Domain_Name_System#Domain_name_syntax
  DEPLOY_SUBDOMAIN=`echo "$DEPLOY_SUBDOMAIN_UNFORMATTED" | sed -r 's/[^A-Za-z0-9]+/\-/g'`
  echo "DEPLOY_SUBDOMAIN: ${DEPLOY_SUBDOMAIN}"

  DEPLOY_DOMAIN=https://${DEPLOY_SUBDOMAIN}-microsoft-idv-sdk-ui-onfido.surge.sh

  # Rebuild with TEST_ENV=deployment for test target only
  if [ "$NODE_ENV" == "test" ]; then
    TEST_ENV=deployment npm run build
  fi

  surge --project ${DEPLOY_PATH} --domain $DEPLOY_DOMAIN;

  if [ "$TRAVIS_PULL_REQUEST" != "false" ]
  then
    # Using the Issues api instead of the PR api
    # Done so because every PR is an issue, and the issues api allows to post general comments,
    # while the PR api requires that comments are made to specific files and specific commits
    GITHUB_PR_COMMENTS=https://api.github.com/repos/${TRAVIS_REPO_SLUG}/issues/${TRAVIS_PULL_REQUEST}/comments
    curl -H "Authorization: token ${GITHUB_API_TOKEN}" --request POST ${GITHUB_PR_COMMENTS} --data '{"body":"Travis automatic deployment: '${DEPLOY_DOMAIN}'"}'
  fi
done

echo "Deploy domain: ${DEPLOY_DOMAIN}"
