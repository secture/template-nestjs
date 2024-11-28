DOCKER_COMPOSE = docker compose
DOCKER_API = $(DOCKER_COMPOSE) exec api
API_NPM = $(DOCKER_API) npm
API_NPX = $(DOCKER_API) npx
API_BASH = $(DOCKER_API) /bin/bash

# Add task to .PHONY
.PHONY: help install add-dep add-dev-dep up start down stop build terminal run-npm run-npx test lint release

# HELP
# This will output the help for each task
help: ## This help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	
.DEFAULT_GOAL := help

##@ 🚀 Getting started
install: ## Install the dependences of the project
	@echo "Installing Node dependencies"
	@$(API_NPM) install

##@  🖥️  Development
add-dep: up ## Add a new dependency (e.g., make add-dep dep=express)
	@echo "Adding dependency $(dep)"
	$(API_NPM) install $(dep)

add-dev-dep: up ## Add a new dev dependency (e.g., make add-dev-dep dep=@types/express)
	@echo "Adding dev dependency $(dep)"
	$(API_NPM) install $(dep) --save-dev

up: ## Starts the dev serve
	@$(DOCKER_COMPOSE) up -d --wait

start: up ## Alias for "up"

down: ## Stops the dev serve
	$(DOCKER_COMPOSE) down

stop: down ## Alias for "down"

build: ## Build the Docker images
	$(DOCKER_COMPOSE) build

terminal: up ## Open a terminal inside the container
	$(API_BASH)

run-npm: up ## Run an npm script inside the container (e.g., make run-npm cmd=start)
	@echo "Running npm $(cmd)"
	$(API_NPM) run $(cmd)

run-npx: up ## Run an npx command inside the container (e.g., make run-npx cmd=eslint src)
	@echo "Running npx $(cmd)"
	$(API_NPX) $(cmd)

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
