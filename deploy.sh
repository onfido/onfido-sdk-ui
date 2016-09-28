BRANCH_NAME=$TRAVIS_BRANCH # ref http://stackoverflow.com/a/37813003/689223 ; -f 2 trims the first two chars
BRANCH_SUBDOMAIN=`echo "$BRANCH_NAME" | sed -r 's/[\/]+/\./g'` # sed -r is only supported in linux, ref http://stackoverflow.com/a/2871217/689223
PRNAME=""
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then PRNAME=PR${TRAVIS_PULL_REQUEST}.; fi
BRANCH_DOMAIN=https://${PRNAME}${BRANCH_SUBDOMAIN}.onfido-sdk-ui.onfido.surge.sh
GITHUB_PR_COMMENTS=https://api.github.com/repos/${TRAVIS_REPO_SLUG}/issues/${TRAVIS_PULL_REQUEST}/comments #every PR is an issue, and the issues api allows to post general comments, while the PR api requires that comments are made to specific files
echo $BRANCH_NAME $BRANCH_SUBDOMAIN $BRANCH_DOMAIN
surge --project ./dist --domain $BRANCH_DOMAIN;
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then curl -H "Authorization: token ${GITHUB_API_TOKEN}" --request POST ${GITHUB_PR_COMMENTS} --data '{"body":"Travis automatic deployment: '${BRANCH_DOMAIN}'"}'; fi
