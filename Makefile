FLUTTER := $(HOME)/development/flutter/bin/flutter
DART    := $(HOME)/development/flutter/bin/dart
BROWSER := /usr/bin/brave-browser

.DEFAULT_GOAL := help

.PHONY: help setup run run-back build test test-domain test-front test-back commit push

help:
	@echo ""
	@echo "  setup           Install Husky git hooks"
	@echo ""
	@echo "  run             Run front on port 5000 (blog + dashboard at /dashboard)"
	@echo "  run-back        Run Dart Frog backend on port 8080"
	@echo ""
	@echo "  test            Run ALL tests across every package"
	@echo "  test-domain     Run packages/domain tests"
	@echo "  test-front      Run front/ tests"
	@echo "  test-back       Run back/ tests"
	@echo ""
	@echo "  build           Build front for web"
	@echo "  commit          Stage all and commit with type menu"
	@echo "  push            Push to remote (runs tests via pre-push hook)"
	@echo ""

setup:
	npm install
	chmod +x scripts/commit-menu.sh scripts/pre-push-checks.sh

run:
	cd front && $(FLUTTER) run -d web-server --web-port 5000 \
	  --dart-define=API_BASE_URL=http://localhost:8080

run-back:
	cd back && $(DART) run dart_frog_cli:dart_frog dev

build:
	cd front && $(FLUTTER) build web

test: test-domain test-front test-back

test-domain:
	cd packages/domain && $(DART) test

test-front:
	cd front && $(FLUTTER) test

test-back:
	cd back && $(DART) test

commit:
	GIT_EDITOR=true git commit

push:
	git push
