#!/bin/bash
set -e
set -x

echo "starting container"
docker-compose up -d

CMD="mvn --no-transfer-progress $1 clean verify"

if [[ ! -z "${DD_ENV}" ]]; then
  CMD="${CMD} -Pdd"
fi

set +e

if [[ -z "${PERCY_TOKEN}" ]]; then
  $CMD
else
  # shellcheck disable=SC2086
  percy exec -- $CMD
fi

EXIT=$?

echo "shutting down container"
docker-compose down

echo "::set-output name=exit_code::$EXIT"
exit $EXIT
