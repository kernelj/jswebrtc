#!/bin/sh

# Concat all .js sources
cat \
	src/jswebrtc.js \
	src/video-element.js \
	src/player.js \
	> jswebrtc.js

# Minify
uglifyjs jswebrtc.js -o dist/jswebrtc.min.js

# Cleanup
rm jswebrtc.js

