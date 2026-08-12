#!/bin/bash
export ANDROID_HOME=/opt/android-sdk
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
chmod +x /opt/android-sdk/cmdline-tools/latest/bin/sdkmanager
yes | sdkmanager "build-tools;35.0.0" 2>&1
