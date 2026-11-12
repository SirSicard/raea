#!/bin/bash
# The home folder kept in an S3-compatible object (docs/cloud.feature CL10), for platforms whose disk doesn't outlive
# the container (Cloudflare Containers): `state.sh restore` on start, `state.sh save` on stop. It holds the agents'
# sign-ins (~/.kimi-code, ~/.claude, ~/.codex, ...), raea's settings (~/.raea) and the workspace (~/work).
#
#   RAEA_CLOUD_STATE          the object's URL: https://ACCOUNT.r2.cloudflarestorage.com/BUCKET/home.tar.zst, or
#                             https://BUCKET.s3.REGION.amazonaws.com/home.tar.zst. Unset: nothing is restored or saved
#                             (a volume keeps the home instead).
#   RAEA_CLOUD_STATE_KEY      the access key id, and RAEA_CLOUD_STATE_SECRET its secret
#   RAEA_CLOUD_STATE_REGION   the signing region (auto for R2, the default)
#
# Caches that rebuild themselves stay out. curl signs the requests itself (--aws-sigv4).
set -uo pipefail
url=${RAEA_CLOUD_STATE:-}
[ -n "$url" ] || exit 0
sign=(--aws-sigv4 "aws:amz:${RAEA_CLOUD_STATE_REGION:-auto}:s3" --user "${RAEA_CLOUD_STATE_KEY:?}:${RAEA_CLOUD_STATE_SECRET:?}")
snap=/tmp/raea-home.tar.zst

case ${1:-} in
  restore)
    code=$(curl -sS "${sign[@]}" -o "$snap" -w '%{http_code}' "$url")
    if [ "$code" = 200 ]; then
      tar --zstd -xf "$snap" -C "$HOME" && echo "raea-cloud: home restored ($(du -sh "$HOME" | cut -f1))"
    elif [ "$code" = 404 ]; then
      echo "raea-cloud: no saved home yet; starting a new one"
    else
      echo "raea-cloud: couldn't read the saved home (HTTP $code); starting without it" >&2
    fi
    rm -f "$snap"
    ;;
  save)
    tar --zstd -cf "$snap" -C "$HOME" --exclude=./.npm/_cacache --exclude=./.cache --exclude=./tmp . || exit 1
    code=$(curl -sS "${sign[@]}" -T "$snap" -o /dev/null -w '%{http_code}' "$url")
    [ "$code" = 200 ] && echo "raea-cloud: home saved ($(du -h "$snap" | cut -f1))" || echo "raea-cloud: saving the home FAILED (HTTP $code)" >&2
    rm -f "$snap"
    ;;
  *) echo "usage: state.sh restore|save" >&2; exit 2 ;;
esac
