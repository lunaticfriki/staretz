FLUTTER := $(HOME)/development/flutter/bin/flutter
BROWSER := /usr/bin/brave-browser

.DEFAULT_GOAL := help

.PHONY: help setup run build test commit push

help:
	@echo ""
	@echo "  setup    Install Husky git hooks"
	@echo "  run      Run the app in Brave"
	@echo "  build    Build for web"
	@echo "  test     Run all tests"
	@echo "  commit   Stage all and commit with type menu"
	@echo "  push     Push to remote (runs tests via pre-push hook)"
	@echo ""

setup:
	npm install
	chmod +x scripts/commit-menu.sh scripts/pre-push-checks.sh

run:
	CHROME_EXECUTABLE=$(BROWSER) $(FLUTTER) run -d chrome

build:
	$(FLUTTER) build web

test:
	$(FLUTTER) test

commit:
	GIT_EDITOR=true git commit

push:
	git push
