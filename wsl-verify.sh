#!/bin/bash
export ANDROID_HOME=/opt/android-sdk
export ANDROID_SDK_ROOT=/opt/android-sdk
echo "node: $(node --version)"
echo "java: $(java --version | head -1)"
echo "ANDROID_HOME contents:"
ls "$ANDROID_HOME"
echo "NDK:"
ls "$ANDROID_HOME/ndk" 2>&1
echo "Platforms:"
ls "$ANDROID_HOME/platforms" 2>&1
echo "Build-tools:"
ls "$ANDROID_HOME/build-tools" 2>&1
