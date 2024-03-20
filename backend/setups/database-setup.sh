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



# Add the 'uuid-ossp' extension
psql -h $HOST -p $PORT -U $USERNAME -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

#create a new user here for reading data for simple task such as reading data from tables, and checking just question

# Create the 'users' table
psql -h $HOST -p $PORT -U $USERNAME -d $DB_NAME -c "CREATE TABLE IF NOT EXISTS users (
    user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password TEXT,
    name VARCHAR(255),
    address TEXT,
    phone VARCHAR(20),
    emailVerified BOOLEAN DEFAULT FALSE,
    phoneVerified BOOLEAN DEFAULT FALSE,
);"

# Create the 'userVerification' table
psql -h $HOST -p $PORT -U $USERNAME -d $DB_NAME -c "CREATE TABLE IF NOT EXISTS usersVerification (
    user_id UUID,
    unique_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    verifiyType VARCHAR(5) CHECK (verifiyType IN ('email', 'phone')),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiresAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 hour',
);"

# create an other user on db only to delete this table


psql -h "localhost" -p "5432" -U "masteruser" -d "quiz-app" -c "CREATE TABLE IF NOT EXISTS users (
    user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password TEXT,
    name VARCHAR(255),
    address TEXT,
    phone VARCHAR(20),
    emailVerified BOOLEAN DEFAULT FALSE,
    phoneVerified BOOLEAN DEFAULT FALSE,
    role VARCHAR(5) CHECK (role IN ('user', 'admin'))
);"