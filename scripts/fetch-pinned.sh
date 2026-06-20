#!/usr/bin/env bash
#
# Fetch the repositories pinned on a GitHub profile and write them to
# _data/pinned.json, which the homepage uses to render its "Featured
# Projects" section.
#
# Pinned repositories are only exposed through GitHub's GraphQL API
# (user.pinnedItems), so this runs at build time in CI where a token is
# available. The output schema matches _data/projects.yml so the same
# project-card include can render it. If the file is absent or empty, the
# homepage falls back to projects flagged `featured: true` in projects.yml.
#
# Usage:
#   GITHUB_TOKEN=<token> GITHUB_LOGIN=<login> scripts/fetch-pinned.sh
#
set -euo pipefail

LOGIN="${GITHUB_LOGIN:-terellison}"
OUT="${PINNED_OUT:-_data/pinned.json}"

if [[ -z "${GITHUB_TOKEN:-}" ]]; then
  echo "fetch-pinned: GITHUB_TOKEN is not set; skipping (homepage will use featured fallback)." >&2
  exit 0
fi

read -r -d '' QUERY <<EOF || true
{
  "query": "query(\$login: String!) { user(login: \$login) { pinnedItems(first: 6, types: REPOSITORY) { nodes { ... on Repository { name description url homepageUrl stargazerCount languages(first: 5, orderBy: {field: SIZE, direction: DESC}) { nodes { name } } } } } } }",
  "variables": { "login": "${LOGIN}" }
}
EOF

response="$(curl -sS \
  -H "Authorization: bearer ${GITHUB_TOKEN}" \
  -H "Content-Type: application/json" \
  -X POST \
  -d "${QUERY}" \
  https://api.github.com/graphql)"

if echo "${response}" | jq -e '.errors' >/dev/null 2>&1; then
  echo "fetch-pinned: GraphQL returned errors:" >&2
  echo "${response}" | jq '.errors' >&2
  exit 1
fi

count="$(echo "${response}" | jq '.data.user.pinnedItems.nodes | length')"
if [[ "${count}" -eq 0 ]]; then
  echo "fetch-pinned: no pinned repositories found for '${LOGIN}'; skipping." >&2
  exit 0
fi

echo "${response}" | jq '
  [ .data.user.pinnedItems.nodes[]
    | {
        name,
        description: (.description // ""),
        repo: .url,
        tech: ([.languages.nodes[].name] | .[0:4])
      }
      + (if (.homepageUrl // "") != "" then { demo: .homepageUrl } else {} end)
      + (if .stargazerCount > 0 then { stars: .stargazerCount } else {} end)
  ]
' > "${OUT}"

echo "fetch-pinned: wrote ${count} pinned repositories to ${OUT}."
