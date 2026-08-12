#!/bin/bash
set -e
exec > /tmp/wsl-setup.log 2>&1

echo "=== Installing Node.js 22 ==="
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y -qq nodejs
node --version
npm --version

echo "=== Setting up Android SDK ==="
mkdir -p /opt/android-sdk/cmdline-tools
cd /tmp
curl -fsSL -o cmdline-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip -q cmdline-tools.zip -d /opt/android-sdk/cmdline-tools
mv /opt/android-sdk/cmdline-tools/cmdline-tools /opt/android-sdk/cmdline-tools/latest

export ANDROID_HOME=/opt/android-sdk
export ANDROID_SDK_ROOT=/opt/android-sdk
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

echo "=== Accepting licenses ==="
yes | sdkmanager --licenses > /dev/null 2>&1 || true

echo "=== Installing SDK packages ==="
sdkmanager --install "platform-tools" "platforms;android-36" "build-tools;36.0.0" "ndk;27.1.12297006" "cmake;3.22.1"

echo "=== Persisting env vars for future shells ==="
cat >> /root/.bashrc << 'EOF'
export ANDROID_HOME=/opt/android-sdk
export ANDROID_SDK_ROOT=/opt/android-sdk
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"
EOF

echo "SETUP_COMPLETE"
