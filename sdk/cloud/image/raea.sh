#!/bin/sh
# raea in raea cloud's image (docs/cloud.feature CL15): with RAEA_CLOUD_GPU_URL set, `raea render ...` (each command in
# RAEA_CLOUD_GPU_COMMANDS) goes to that GPU worker (server/offload.ts); everything else, and everything when it isn't
# set, is raea itself. The server, the agents and their shells all reach raea through this one.
if [ -n "${RAEA_CLOUD_GPU_URL:-}" ] && [ -n "${1:-}" ]; then
  case " ${RAEA_CLOUD_GPU_COMMANDS:-render} " in
    *" $1 "*) exec node /opt/raea-cloud/server/offload.ts "$@" ;;
  esac
fi
exec /opt/raea/bin/raea "$@"
