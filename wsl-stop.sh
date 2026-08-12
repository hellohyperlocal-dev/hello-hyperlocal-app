#!/bin/bash
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
cd /root/hello-hyperlocal-rebuild/android 2>/dev/null && ./gradlew --stop 2>&1
pkill -f "gradlew assembleDebug" 2>&1
pkill -f "GradleDaemon" 2>&1
pkill -f "KotlinCompileDaemon" 2>&1
echo "STOP_DONE"
ps aux | grep -E "gradle|kotlin|java" | grep -v grep
