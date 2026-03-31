COMPOSE = docker compose

CERTS_DIR = infrastructure/certs/generated
CERTS_IMAGE = mazad-certs-generator
CERTS_DOCKERFILE = infrastructure/certs/Dockerfile
CERTS_CONTEXT = infrastructure/certs

up: build
	$(COMPOSE) up -d
build: certs
	$(COMPOSE) build
down:
	$(COMPOSE) down
restart:
	$(COMPOSE) restart
logs:
	$(COMPOSE) logs -f
ps:
	$(COMPOSE) ps
clean-all: 
	$(COMPOSE) down -v --rmi all
clean-v:
	$(COMPOSE) down -v
clean-img:
	$(COMPOSE) down --rmi all
re: clean-all up

jwt-secret-key:
	@ openssl rand -base64 64 | tr -d '\n' &&  echo '\n'

certs-image:
	docker build -t $(CERTS_IMAGE) -f $(CERTS_DOCKERFILE) $(CERTS_CONTEXT)

# Generate SSL certificates if they don't exist
certs: certs-image
	@if [ ! -f $(CERTS_DIR)/nginx.crt ]; then \
		echo "Generating SSL certificates in Docker..."; \
		if [ -z "$$SSL_KEYSTORE_PASSWORD" ]; then \
			echo "SSL_KEYSTORE_PASSWORD environment variable is not set!"; \
			exit 1; \
		fi; \
		docker run --rm -u $(shell id -u):$(shell id -g) \
		  -v $(PWD)/infrastructure/certs:/certs \
		  -v $(PWD)/infrastructure/certs/generated:/certs/generated \
		  -e SSL_KEYSTORE_PASSWORD=$$SSL_KEYSTORE_PASSWORD \
		  $(CERTS_IMAGE); \
	else \
		echo "SSL certificates already exist. Skipping generation."; \
	fi

# Force regenerate all certificates
certs-force: certs-image
	@if [ -z "$$SSL_KEYSTORE_PASSWORD" ]; then \
		echo "SSL_KEYSTORE_PASSWORD environment variable is not set!"; \
		exit 1; \
	fi; \
	docker run --rm -u $(shell id -u):$(shell id -g) \
	  -v $(PWD)/infrastructure/certs:/certs \
	  -v $(PWD)/infrastructure/certs/generated:/certs/generated \
	  -e SSL_KEYSTORE_PASSWORD=$$SSL_KEYSTORE_PASSWORD \
	  $(CERTS_IMAGE) --force
