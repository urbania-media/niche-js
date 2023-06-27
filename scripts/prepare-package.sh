#!/bin/bash

# Help
usage() {
    echo "Usage: $0 [--styles|-s]"
}

# Transform long options to short ones
for arg in "$@"; do
    shift
    case "$arg" in
        "--help") set -- "$@" "-h" ;;
        "--styles") set -- "$@" "-s" ;;
        *)        set -- "$@" "$arg"
    esac
done

# Set defaults
styles=false
languages="en fr"

# Get options
while getopts 'is?h' c
do
    case $c in
        s) styles=true ;;
        h) usage; exit 0 ;;
        ?) usage >&2; exit 1 ;;
    esac
done

# Build methods
clean() {
    echo "Cleaning..."
    rm -rf css
    rm -rf assets
    rm -rf lib
    rm -rf es
}

build_rollup() {
    echo "Building JS with rollup..."
    if [ -f ./rollup.config.js ]; then
        ../../node_modules/.bin/rollup --config ./rollup.config.mjs
    else
        ../../node_modules/.bin/rollup --config ../../rollup.config.mjs
    fi
}

copy_css() {
    echo "Copying css..."
    mkdir -p ./assets/css/
    cp es/styles.css ./assets/css/styles.css
    rm -f es/styles.css
    rm -f lib/styles.css
}

copy_styles() {
    echo "Copying styles..."
    mkdir -p ./css/
    find ./src -type f -name "*.css" ! -name "*.module.css" ! -name "*.global.css" -exec cp {} ./css/ \;
}

# Build
export NODE_ENV=production
clean
build_rollup
if [ -f ./es/styles.css ]; then copy_css; fi
if [ "$styles" = true ]; then copy_styles; fi
