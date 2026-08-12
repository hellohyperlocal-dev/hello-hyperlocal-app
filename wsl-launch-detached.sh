#!/bin/bash
export ANDROID_HOME=/opt/android-sdk
export ANDROID_SDK_ROOT=/opt/android-sdk
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64

cd ~/hello-hyperlocal-rebuild/android
rm -f ~/hello-hyperlocal-rebuild/wsl-build.log ~/hello-hyperlocal-rebuild/wsl-build.done
nohup bash -c '
  ./gradlew assembleDebug > ~/hello-hyperlocal-rebuild/wsl-build.log 2>&1
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 0 ]; then
    echo "SUCCESS" > ~/hello-hyperlocal-rebuild/wsl-build.done
  else
    echo "FAILED exit=$EXIT_CODE" > ~/hello-hyperlocal-rebuild/wsl-build.done
  fi
' > ~/hello-hyperlocal-rebuild/wsl-launch.log 2>&1 < /dev/null &
disown
echo "Launched detached build with PID $!"
