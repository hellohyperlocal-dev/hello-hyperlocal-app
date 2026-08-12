#!/bin/bash
export ANDROID_HOME=/opt/android-sdk
export ANDROID_SDK_ROOT=/opt/android-sdk
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64

echo "sdk.dir=$ANDROID_HOME" > ~/hello-hyperlocal-rebuild/android/local.properties
cat ~/hello-hyperlocal-rebuild/android/local.properties

cd ~/hello-hyperlocal-rebuild/android
./gradlew assembleDebug > ~/hello-hyperlocal-rebuild/wsl-build.log 2>&1
EXIT_CODE=$?
if [ $EXIT_CODE -eq 0 ]; then
  echo "WSL_BUILD_SUCCESS" >> ~/hello-hyperlocal-rebuild/wsl-build.log
else
  echo "WSL_BUILD_FAILED exit=$EXIT_CODE" >> ~/hello-hyperlocal-rebuild/wsl-build.log
fi
