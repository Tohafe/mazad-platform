COMPOSE = docker compose
SERVICES = postgres redis mazad-gateway items-service auth-service user-service

up: build
	$(COMPOSE) up -d
down:
	$(COMPOSE) down
build:
	$(COMPOSE) build

re: down prune-img build up

re-s: clean-s build-s up-s

restart:
	$(COMPOSE) restart
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
	docker rmi $$(docker images | grep $(s) | awk '{print $$3}') || true