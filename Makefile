DOCKER_COMPOSE_FILE=docker-compose.yml
DOCKER_COMPOSE_FILE_DB=docker-compose-db.yml

dev:
	docker-compose -f ${DOCKER_COMPOSE_FILE} up

build:
	docker-compose -f ${DOCKER_COMPOSE_FILE} build

dbs-up:
	docker-compose -f ${DOCKER_COMPOSE_FILE_DB} up -d

dbs-down:
	docker-compose -f ${DOCKER_COMPOSE_FILE_DB} down
