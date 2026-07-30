#!/usr/bin/env bash
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

pause() {
  echo
  read -rp "Press enter to return to the menu..." _
}

while true; do
  clear
  echo "git — staretz"
  echo
  echo "  1) status"
  echo "  2) diff"
  echo "  3) commit"
  echo "  4) push"
  echo "  5) pull"
  echo "  6) log"
  echo "  q) quit"
  echo
  read -rp "> " choice

  case "$choice" in
    1) git status; pause ;;
    2) git diff; pause ;;
    3) git commit; pause ;;
    4) git push; pause ;;
    5) git pull; pause ;;
    6) git log --oneline --graph --decorate -20; pause ;;
    q | Q) break ;;
    *)
      echo "Unknown option: $choice"
      sleep 1
      ;;
  esac
done
