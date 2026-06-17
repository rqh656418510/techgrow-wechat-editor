#!/bin/bash

RELEASE_DIR='./docker'
REPO_NAME='doocs/md'

pnpm web build

for app_ver in $RELEASE_DIR/*; do

    if [ -f "$app_ver/Dockerfile.tengine" ]; then

        tag=$(echo $app_ver | cut -b 10-)
        echo "Build: $tag"
        set -a
            . "$app_ver/.env"
        set +a

        echo $app_ver
        echo "VER_APP: $VER_APP"
        echo "VER_TENGINE: $VER_TENGINE"

        docker build \
            --build-arg VER_TENGINE=$VER_TENGINE \
            -f "$app_ver/Dockerfile.tengine" \
            -t "$REPO_NAME:${VER_APP}-tengine" \
            .
    fi

done
