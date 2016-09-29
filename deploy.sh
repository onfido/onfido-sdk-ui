#!/bin/bash

# -f 2 trims the first two chars
# ref http://stackoverflow.com/a/37813003/689223 ;
BRANCH_NAME=$TRAVIS_BRANCH

# replaces "/" with "."
# sed -r is only supported in linux, ref http://stackoverflow.com/a/2871217/689223
BRANCH_SUBDOMAIN=`echo "$BRANCH_NAME" | sed -r 's/[\/]+/\./g'`

PRNAME=""
if [ "$TRAVIS_PULL_REQUEST" != "false" ]
then
  PRNAME=PR${TRAVIS_PULL_REQUEST}.
fi

# Split on "/", ref: http://stackoverflow.com/a/5257398/689223
REPO_SLUG_ARRAY=(${TRAVIS_REPO_SLUG//\// })
REPO_OWNER=${REPO_SLUG_ARRAY[0]}
REPO_NAME=${REPO_SLUG_ARRAY[1]}

DEPLOY_DOMAIN=https://${PRNAME}${BRANCH_SUBDOMAIN}.${REPO_NAME}.${REPO_OWNER}.surge.sh
DEPLOY_PATH=./dist

# Using the Issues api instead of the PR api
# Done so because every PR is an issue, and the issues api allows to post general comments,
# while the PR api requires that comments are made to specific files and specific commits
GITHUB_PR_COMMENTS=https://api.github.com/repos/${TRAVIS_REPO_SLUG}/issues/${TRAVIS_PULL_REQUEST}/comments

echo $BRANCH_NAME $BRANCH_SUBDOMAIN $DEPLOY_DOMAIN

surge --project ${DEPLOY_PATH} --domain $DEPLOY_DOMAIN;

if [ "$TRAVIS_PULL_REQUEST" != "false" ]
then
  curl -H "Authorization: token ${GITHUB_API_TOKEN}" --request POST ${GITHUB_PR_COMMENTS} --data '{"body":"Travis automatic deployment: '${DEPLOY_DOMAIN}'"}'
fi
