#!/bin/bash
set -e
exec > /tmp/wsl-build.log 2>&1

export ANDROID_HOME=/opt/android-sdk
export ANDROID_SDK_ROOT=/opt/android-sdk
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64

echo "=== Ensuring rsync is available ==="
command -v rsync >/dev/null 2>&1 || apt-get install -y -qq rsync

echo "=== Copying project into WSL native filesystem ==="
rm -rf ~/hello-hyperlocal-rebuild
mkdir -p ~/hello-hyperlocal-rebuild
cd /mnt/c/Projects/apps/hello-hyperlocal-rebuild
rsync -a --exclude node_modules --exclude android --exclude dist --exclude .git \
  ./ ~/hello-hyperlocal-rebuild/

cd ~/hello-hyperlocal-rebuild

echo "=== npm install (fresh, Linux-native) ==="
npm install

echo "=== expo prebuild ==="
npx expo prebuild --platform android --clean

echo "=== gradlew assembleDebug ==="
cd android
chmod +x gradlew
./gradlew assembleDebug

echo "WSL_BUILD_COMPLETE"
