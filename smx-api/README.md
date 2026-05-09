# smx-api

SourceMedX - API

## Global Requisites

* node (^20.*)
* express (^4.*)
* typeORM (^0.3.*)

## Install, Configure & Run

Below mentioned are the steps to install, configure & run in your platform/distributions.

### Install

```bash
# Run command to clone the repo.
git clone https://github.com/SourceMedX/smx-api.git

# Goto the cloned project folder, run command
cd smx-api

# Run command to install packages dependencies.
npm install
```

### Configuration

#### Configure database connection

- Create a new MySql database
- Edit your `.env.xxx` files to config database connection

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=smx
```

- Migrate database

```bash
# Generate migrations
npx typeorm-ts-node-commonjs migration:generate -d src/configs/database.ts src/migrations/<Name of migration>

# Run migrations
npx typeorm-ts-node-commonjs migration:run -d src/configs/database.ts
```

### Docker for Postgres & Redis

```bash
docker compose -f docker-compose.yml down
docker compose -f docker-compose.yml up
````

### Run

```bash
# Run development
npm run dev
 
# after run successful, access the link below to check your installation
http://locahost:3001
```

### Test & Code format validation

updating ...

### Build code and deployment

#### Required Installations

- NGINX
- pm2
- nodejs 18+

#### Setup Postgres + Redis on EC2

```bash
# Staging
docker compose -f docker-compose.staging.yml up

# Production
docker compose -f docker-compose.production.yml up
```

```bash
npx typeorm-ts-node-commonjs migration:run -d src/configs/database.ts
```

SSL Certificate

```bash
sudo certbot --nginx -d staging-api.sourcemedx.com
```

### Backup/Restore database

```bash
# Backup database
docker exec -it postgres-db pg_dump -U postgres -t table_name database_name > ../gudid_devices.sql
# Zip file (optional)
zip -r gudid_devices.sql.zip gudid_devices.sql
# Upload to google drive
# Download from google drive
gdown file_google_drive_id
# or Transfer file to server
scp -i source-medx-key.pem gudid_devices.sql.zip ubuntu@3.26.213.98:~/    
# unzip file
unzip gudid_devices.sql.zip
# copy file to docker container
docker cp gudid_devices.sql postgres-db:/tmp
# Restore database
docker exec -it postgres-db psql -U remote_user -d remote_db -f gudid_devices.sql
```

## API Document

[Swagger](https://swagger.io/) is Simplify API development for users, teams, and enterprises with the Swagger open
source and professional toolset.

Easily used by Swagger to design and document APIs at scale.

Start your app in development mode at http://localhost:3001/docs
