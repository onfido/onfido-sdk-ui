#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -o nounset

cp ../{key,cert}.pem ./

rm -rf ./frontend
mkdir -p ./frontend

cp ../../dist/index.html ./frontend/
cp ../../dist/demo.min.js{,.map} ./frontend/
cp ../../dist/onfido.min.js{,.map} ./frontend/
cp ../../dist/onfido.crossDevice.min.js{,.map} ./frontend/
cp ../../dist/onfido.vendors~crossDevice.min.js{,.map} ./frontend/

cp ../../dist/onfido.crossDevice.css{,.map} ./frontend/
cp ../../dist/onfido.vendors~crossDevice.css{,.map} ./frontend/
cp ../../dist/style.css{,.map} ./frontend/