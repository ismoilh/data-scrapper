run:
	sudo rm -rf pgdata
	mkdir pgdata
	docker-compose up --build

migration-create:
	node-pg-migrate -m db/migrations -j sql create my table