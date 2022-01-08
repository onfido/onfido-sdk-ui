#!/bin/bash
set -e
set -x

echo "starting container"
docker-compose up -d

set +e
$1
EXIT=$?

echo "shutting down container"
docker-compose down
exit $EXIT
