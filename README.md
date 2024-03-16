# quiz-app

## Backend 

### Microservice Architecture

1. Authentication Microservice

## Steps to Run the system in Local Machine :computer:

1. Go to ``` backend/setups``` Folder

2. Create an Environment File .env 

3. In the file add the following variables and assign values to it (You can use the .env.example file)
- POSTGRES_ADMIN_USER
- POSTGRES_ADMIN_PASSWORD
- POSTGRES_DB
- POSTGRES_PORT (Keep it 5432)
- POSTGRES_HOST
- JWT_SECRET
- JWT_EXPIRY

4. Run 

``` ./setup.sh ```

If unable to execute, give necessary executable permission. eg. ``` chmod +x image-builder.sh ``` and eg. ``` chmod +x setup.sh ```

5. On Another Terminal run the following to setup database

```./database-setup.sh <DATABASE NAME> <DB USER> ```

If unable to execute, give necessary executable permission. eg. ``` chmod +x database-setup.sh ```

6. Now you can do ```docker-compose down``` and then use ```docker-compose up``` to stop and start

7. Voila! :fireworks: All's Setup