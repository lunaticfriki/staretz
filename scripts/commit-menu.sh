#!/usr/bin/env bash
set -euo pipefail

COMMIT_MSG_FILE="$1"
COMMIT_SOURCE="${2:-}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

[[ -n "$COMMIT_SOURCE" ]] && exit 0

exec < /dev/tty

echo ""
echo -e "${BOLD}${CYAN}── Commit type ──────────────────────────────${NC}"

types=("feat" "fix" "docs" "style" "refactor" "test" "chore" "perf" "ci")
descriptions=(
  "A new feature"
  "A bug fix"
  "Documentation only"
  "Formatting, no logic change"
  "Code restructure, no behaviour change"
  "Adding or updating tests"
  "Build process or tooling"
  "Performance improvement"
  "CI/CD changes"
)

for i in "${!types[@]}"; do
  printf "  ${YELLOW}%d)${NC} %-12s %s\n" "$((i+1))" "${types[$i]}" "${descriptions[$i]}"
done

echo ""

while true; do
  read -rp $'\e[1mType [1-9]: \e[0m' choice
  if [[ "$choice" =~ ^[1-9]$ ]] && [[ "$choice" -le "${#types[@]}" ]]; then
    type="${types[$((choice-1))]}"
    break
  fi
  echo -e "${RED}Invalid choice. Enter a number from 1 to ${#types[@]}.${NC}"
done

echo ""
read -rp $'\e[1mScope (optional, enter to skip): \e[0m' scope
echo ""
read -rp $'\e[1mDescription: \e[0m' description

if [[ -z "$description" ]]; then
  echo -e "${RED}Description is required.${NC}"
  exit 1
fi

if [[ -n "$scope" ]]; then
  message="${type}(${scope}): ${description}"
else
  message="${type}: ${description}"
fi

echo "$message" > "$COMMIT_MSG_FILE"

echo ""
echo -e "${GREEN}✔ Commit message:${NC} ${BOLD}${message}${NC}"
echo ""
