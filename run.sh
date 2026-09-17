#!/usr/bin/env bash
#
# eCoach website — one script to run, build and ship the site.
#
#   ./run.sh              start the dev server (default)
#   ./run.sh build        production build into dist/
#   ./run.sh preview      build, then serve dist/ locally
#   ./run.sh deploy       build and push dist/ to the gh-pages branch
#   ./run.sh clean        remove node_modules and dist
#
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

GREEN=$'\033[38;5;35m'; DIM=$'\033[2m'; BOLD=$'\033[1m'; RED=$'\033[31m'; OFF=$'\033[0m'
say()  { printf '%s\n' "${GREEN}▸${OFF} $*"; }
warn() { printf '%s\n' "${RED}✗${OFF} $*" >&2; }

require_node() {
  if ! command -v node >/dev/null 2>&1; then
    warn "Node.js is not installed. Get it from https://nodejs.org (v18 or newer)."
    exit 1
  fi
  local major
  major="$(node -p 'process.versions.node.split(".")[0]')"
  if (( major < 18 )); then
    warn "Node $(node -v) is too old — this project needs v18 or newer."
    exit 1
  fi
}

install_deps() {
  # Reinstall when node_modules is missing or older than the lockfile.
  if [[ ! -d node_modules ]] || [[ package-lock.json -nt node_modules ]]; then
    say "Installing dependencies…"
    if [[ -f package-lock.json ]]; then npm ci; else npm install; fi
  fi
}

banner() {
  printf '\n  %s\n  %s\n\n' \
    "${BOLD}eCoach${OFF} ${DIM}—${OFF} the all-in-one platform for sport" \
    "${DIM}Vue 3 · Vite · GSAP ScrollTrigger${OFF}"
}

cmd="${1:-dev}"

banner
require_node

case "$cmd" in
  dev)
    install_deps
    say "Starting dev server on ${BOLD}http://localhost:5173${OFF}  ${DIM}(ctrl-c to stop)${OFF}"
    exec npm run dev -- --open
    ;;

  build)
    install_deps
    say "Building for production…"
    npm run build
    say "Done — output in ${BOLD}dist/${OFF} ($(du -sh dist | cut -f1))"
    ;;

  preview)
    install_deps
    say "Building…"
    npm run build
    say "Serving the production build on ${BOLD}http://localhost:4173${OFF}"
    exec npm run preview -- --open
    ;;

  deploy)
    install_deps

    if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
      warn "Not a git repository. Run 'git init' and add a GitHub remote first."
      exit 1
    fi

    remote="$(git config --get remote.origin.url || true)"
    if [[ -z "$remote" ]]; then
      warn "No 'origin' remote. Add one with:"
      warn "  git remote add origin git@github.com:<user>/<repo>.git"
      exit 1
    fi

    # A GitHub Pages *project* site is served from /<repo>/, so the bundle has
    # to be built with that prefix. A <user>.github.io repo is served from /.
    repo="$(basename -s .git "$remote")"
    owner_site_re='^[^.]+\.github\.io$'
    if [[ "$repo" =~ $owner_site_re ]]; then
      export BASE_PATH="/"
    else
      export BASE_PATH="/${repo}/"
    fi

    say "Building with base path ${BOLD}${BASE_PATH}${OFF}"
    npm run build

    # Tell Pages not to run the output through Jekyll, which would drop any
    # file or directory whose name starts with an underscore.
    touch dist/.nojekyll
    # Unknown URLs get the prerendered not-found page, not a copy of the home
    # page pretending to be one.
    cp dist/404/index.html dist/404.html

    say "Publishing dist/ to the gh-pages branch…"
    tmp="$(mktemp -d)"
    cp -R dist/. "$tmp/"
    (
      cd "$tmp"
      git init -q
      git checkout -qB gh-pages
      git add -A
      git -c user.name="${GIT_AUTHOR_NAME:-eCoach deploy}" \
          -c user.email="${GIT_AUTHOR_EMAIL:-deploy@e-coach.co.uk}" \
          commit -qm "Deploy site $(date -u '+%Y-%m-%d %H:%M UTC')"
      git push -q --force "$remote" gh-pages
    )
    rm -rf "$tmp"

    say "Pushed. Enable Pages → Branch: ${BOLD}gh-pages${OFF} / root, then visit:"
    if [[ "$BASE_PATH" == "/" ]]; then
      say "  https://${repo}/"
    else
      owner="$(basename "$(dirname "$remote")" | sed 's/.*://')"
      say "  https://${owner}.github.io/${repo}/"
    fi
    ;;

  clean)
    say "Removing node_modules and dist…"
    rm -rf node_modules dist
    say "Clean."
    ;;

  *)
    warn "Unknown command: $cmd"
    printf '\nUsage: ./run.sh [dev|build|preview|deploy|clean]\n\n'
    exit 1
    ;;
esac
