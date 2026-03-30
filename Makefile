COMPOSE = docker compose
SERVICES = postgres redis mazad-gateway items-service auth-service user-service

CERTS_DIR = infrastructure/certs/generated
CERTS_IMAGE = mazad-certs-generator
CERTS_DOCKERFILE = infrastructure/certs/Dockerfile
CERTS_CONTEXT = infrastructure/certs

up: build
	$(COMPOSE) up -d

watch:
	$(COMPOSE) up --watch
down:
	$(COMPOSE) down



certs-image:
	docker build -t $(CERTS_IMAGE) -f $(CERTS_DOCKERFILE) $(CERTS_CONTEXT)

# Generate SSL certificates if they don't exist
certs: certs-image
	@if [ ! -f $(CERTS_DIR)/nginx.crt ]; then \
		echo "Generating SSL certificates in Docker..."; \
		docker run --rm -u $(shell id -u):$(shell id -g) \
		  -v $(PWD)/infrastructure/certs:/certs \
		  -v $(PWD)/infrastructure/certs/generated:/certs/generated \
		  $(CERTS_IMAGE); \
	else \
		echo "SSL certificates already exist. Skipping generation."; \
	fi

# Force regenerate all certificates
certs-force: certs-image
	docker run --rm -u $(shell id -u):$(shell id -g) \
	  -v $(PWD)/infrastructure/certs:/certs \
	  -v $(PWD)/infrastructure/certs/generated:/certs/generated \
	  $(CERTS_IMAGE) --force

build: certs
	$(COMPOSE) build

re: clean-all up

re-s: clean-s build-s up-s

restart:
	$(COMPOSE) restart
restart-s: down-s up-s
logs:
	$(COMPOSE) logs -f
ps:
	$(COMPOSE) ps

prune-img:
	docker image prune -f

# to run a single service, cmd =  "make up-s s=service_name", the same for stop-s, logs-s, buil-s, clean-s
# if a service depends on an other service it will be ran by default
up-s:
	$(COMPOSE) up -d $(s)
down-s:
	$(COMPOSE) down $(s)
stop-s:
	$(COMPOSE) stop $(s)
logs-s:
	$(COMPOSE) logs -f $(s)
build-s:
	$(COMPOSE) build $(s)

# to clean images and volumes of all services
clean-all: 
	$(COMPOSE) down -v --rmi all
clean-v:
	$(COMPOSE) down -v
clean-img:
	$(COMPOSE) down --rmi all

clean-s: stop-s
	$(COMPOSE) rm -f $(s)
	docker rmi $$(docker images | grep $(s) | awk '{print $$3}')

jwt-secret-key:
	@ openssl rand -base64 64 | tr -d '\n' &&  echo '\n'