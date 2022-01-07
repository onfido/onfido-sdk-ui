#!/bin/bash
set -e
set -x

echo "starting container"
docker-compose up -d

set +e
echo "executing $1"
$1
EXIT=$?

echo "exit code: $EXIT"
echo "shutting down container"
docker-compose down
exit $EXIT
