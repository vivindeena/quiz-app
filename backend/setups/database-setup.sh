#!/bin/bash

# if [ "$#" -ne 2 ]; then
#     echo "Usage: $0 <DB_NAME> <USERNAME>"
#     exit 1
# fi

if [ ! -f .env ]
then
  export $(cat .env | xargs)
else
    echo "No .env file found"
    exit 1
fi

HOST=$POSTGRES_HOST
PORT=$POSTGRES_PORT
DB_NAME=$POSTGRES_DB
USERNAME=$POSTGRES_ADMIN_USER


psql -h $HOST -p $PORT -U $USERNAME -d $DB_NAME -f ./database-setup.sql
#psql -h "localhost" -p 5432 -U masteruser -d quiz-app -f ./database-setup.sql


#

#