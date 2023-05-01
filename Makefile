DOCKER_COMPOSE_FILE=docker-compose.yml
DOCKER_COMPOSE_FILE_DB=docker-compose-db.yml

dev:
	docker-compose -f ${DOCKER_COMPOSE_FILE} up

dev-down:
	docker-compose -f ${DOCKER_COMPOSE_FILE} down

build:
	docker-compose -f ${DOCKER_COMPOSE_FILE} build

dbs-up:
	docker-compose -f ${DOCKER_COMPOSE_FILE_DB} up -d

dbs-down:
	docker-compose -f ${DOCKER_COMPOSE_FILE_DB} down

configure:
	for id in $(docker ps | tr -s ' ' | cut -d ' ' -f1 | tail -n +2); do; docker network connect vulnscanner $id; done;
