DOCKER_COMPOSE = docker compose
DOCKER_API = $(DOCKER_COMPOSE) exec api
API_NPM = $(DOCKER_API) npm
API_NPX = $(DOCKER_API) npx

# Add task to .PHONY
.PHONY: help install up start down stop build test lint release

# HELP
# This will output the help for each task
help: ## This help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	
.DEFAULT_GOAL := help

##@ 🚀 Getting started
install: up ## Install the dependences of the project
	@echo "Installing Node dependencies"
	@$(API_NPM) install

##@  🖥️  Development
up: ## Starts the dev serve
	@$(DOCKER_COMPOSE) up -d --wait

start: up

down: ## Stops the dev serve
	$(DOCKER_COMPOSE) down

stop: down

build: ## Build the Docker images
	$(DOCKER_COMPOSE) build

##@  ✅  Tests
test: up ## Run unit tests
	@echo "Start running unit tests"
	@$(API_NPM) test

lint: up ## Run linting
	@echo "Running lint checks"
	@$(API_NPM) run lint

##@ 🚀 Release
release: up ## Run Semantic Release
	@$(API_NPM) run release
