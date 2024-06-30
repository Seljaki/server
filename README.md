![banner](assets/banner-server-seljaki.png)

# About Agro Majster server

The server listens on port 3000. It serves as a connection between our database 
and application with an API for work with the database. 

## Prerequisites
To run this node server you will need:  
- PostgreSQL (version 15+) with the extension [PostGIS](https://postgis.net/)
- Node version 20+

## Configuring and running the app
1. Rename the ```example.env``` file to ```.env``` and configure all the setting to match your environment
2. Run ```npm install```
3. Run ```npm start```

Note that the default user will be created after 60s at first startup. Use credentials username: ```admin```, password: ```admin```.

## Hosting the server using docker
**Note: Docker is required for this build type**
1. Edit ```docker-compose.yml``` and change the environmental variables to match your environment
2. Run ```docker compose up```
