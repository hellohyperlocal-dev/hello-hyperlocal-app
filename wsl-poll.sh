#!/bin/bash
until grep -qE "WSL_BUILD_COMPLETE|BUILD FAILED|FAILURE:|npm ERR!" /tmp/wsl-build.log 2>/dev/null; do
  sleep 15
done
tail -40 /tmp/wsl-build.log
