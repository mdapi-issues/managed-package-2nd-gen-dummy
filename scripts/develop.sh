#!/usr/bin/env bash

set -eo pipefail

sf org create scratch -f config/project-scratch-def.json -a mp2gp-dummy -d
sf project deploy start
